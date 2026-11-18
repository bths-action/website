import { prisma } from "@/utils/prisma";
import { sendEmail } from "@/utils/mail";
import {
  emailGenerator,
  eventEmailSubject,
  getEventEmailRecipients,
  recordEventEmailRecipients,
} from "@/utils/event-email";

export const EMAIL_JOB_RUNNING = "RUNNING";
export const EMAIL_JOB_SUCCEEDED = "SUCCEEDED";
export const EMAIL_JOB_FAILED = "FAILED";

/**
 * A job with no progress for this long is treated as dead (server restarted,
 * platform killed the function, ...). Sends can legitimately go quiet for a few
 * minutes while Mailgun's rate limiter makes us wait, so this is generous.
 */
export const STALE_JOB_MS = 10 * 60 * 1000;

export type EventEmailJobView = {
  id: string;
  status: string;
  target: number;
  sent: number;
  skipped: number;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
  finishedAt: Date | null;
  /** RUNNING but silent for too long: the process that started it is gone. */
  stalled: boolean;
};

export class EventEmailJobError extends Error {
  constructor(
    public code: "NOT_FOUND" | "CONFLICT" | "PRECONDITION_FAILED",
    message: string
  ) {
    super(message);
    this.name = "EventEmailJobError";
  }
}

export function toJobView(job: {
  id: string;
  status: string;
  target: number;
  sent: number;
  skipped: number;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
  finishedAt: Date | null;
}): EventEmailJobView {
  return {
    id: job.id,
    status: job.status,
    target: job.target,
    sent: job.sent,
    skipped: job.skipped,
    error: job.error,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    finishedAt: job.finishedAt,
    stalled:
      job.status === EMAIL_JOB_RUNNING &&
      Date.now() - job.updatedAt.getTime() > STALE_JOB_MS,
  };
}

export async function getLatestEventEmailJob(eventId: string) {
  const job = await prisma.eventEmailJob.findFirst({
    where: { eventId },
    orderBy: { createdAt: "desc" },
  });

  return job ? toJobView(job) : null;
}

/**
 * Creates a queued job for an event and starts sending in the background. The
 * caller returns immediately, so the edit modal can poll for progress.
 */
export async function startEventEmailJob(
  eventId: string,
  skipAlreadySent = true
) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    throw new EventEmailJobError("NOT_FOUND", "Event not found.");
  }

  if (event.testing) {
    if (!process.env.TESTING_EMAIL) {
      throw new EventEmailJobError(
        "PRECONDITION_FAILED",
        "TESTING_EMAIL is not configured."
      );
    }
    if (!process.env.TESTING_BCC_EMAIL) {
      throw new EventEmailJobError(
        "PRECONDITION_FAILED",
        "TESTING_BCC_EMAIL is not configured."
      );
    }
  }

  const active = await prisma.eventEmailJob.findFirst({
    where: { eventId, status: EMAIL_JOB_RUNNING },
    orderBy: { createdAt: "desc" },
  });

  if (active) {
    if (Date.now() - active.updatedAt.getTime() <= STALE_JOB_MS) {
      throw new EventEmailJobError(
        "CONFLICT",
        "This event is already sending an email. Watch the progress below."
      );
    }

    // Left behind by a dead process; close it out so a new run can start.
    await prisma.eventEmailJob.update({
      where: { id: active.id },
      data: {
        status: EMAIL_JOB_FAILED,
        error: "Interrupted before finishing.",
        finishedAt: new Date(),
      },
    });
  }

  const job = await prisma.eventEmailJob.create({
    data: { eventId, skipAlreadySent },
  });

  await scheduleEventEmailJob(job.id);

  return toJobView(job);
}

/**
 * Runs the send after the response is flushed, so a 4 minute send does not hold
 * the request open. Falls back to a detached promise when Next's request
 * context is not available (scripts, tests).
 */
async function scheduleEventEmailJob(jobId: string) {
  try {
    const { after } = await import("next/server");
    after(() => runEventEmailJob(jobId).catch(() => {}));
  } catch {
    void runEventEmailJob(jobId).catch(() => {});
  }
}

export async function runEventEmailJob(jobId: string) {
  const job = await prisma.eventEmailJob.findUnique({
    where: { id: jobId },
    include: { event: true },
  });

  if (!job || job.status !== EMAIL_JOB_RUNNING) return;

  const event = job.event;

  try {
    // Test sends always go to the configured test addresses and are never
    // recorded, otherwise a second test would be skipped entirely.
    let recipients: { recipient: string[]; bcc: string[] };
    let skipped = 0;

    if (event.testing) {
      recipients = {
        recipient: [process.env.TESTING_EMAIL!],
        bcc: [process.env.TESTING_BCC_EMAIL!],
      };
    } else {
      const eligible = await getEventEmailRecipients(event.emailEveryone, {
        eventId: event.id,
        skipAlreadySent: job.skipAlreadySent,
      });
      recipients = { recipient: eligible.recipient, bcc: eligible.bcc };
      skipped = eligible.skipped;
    }

    const target = recipients.recipient.length + recipients.bcc.length;
    await prisma.eventEmailJob.update({
      where: { id: jobId },
      data: { target, skipped },
    });

    if (target === 0) {
      await finishEventEmailJob(jobId, EMAIL_JOB_SUCCEEDED);
      return;
    }

    await sendEmail(
      {
        subject: eventEmailSubject(event.name),
        html: emailGenerator(event, event.id),
      },
      {
        recipient: recipients.recipient,
        bcc: recipients.bcc,
        onChunkSent: async (emails) => {
          if (!event.testing) {
            await recordEventEmailRecipients(event.id, emails);
          }
          // Progress is also the heartbeat used to detect dead jobs.
          await prisma.eventEmailJob.update({
            where: { id: jobId },
            data: { sent: { increment: emails.length } },
          });
        },
      }
    );

    await finishEventEmailJob(jobId, EMAIL_JOB_SUCCEEDED);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error while sending.";
    await finishEventEmailJob(jobId, EMAIL_JOB_FAILED, message);
  }
}

async function finishEventEmailJob(
  jobId: string,
  status: string,
  error?: string
) {
  await prisma.eventEmailJob
    .update({
      where: { id: jobId },
      data: {
        status,
        error: error?.slice(0, 1000) ?? null,
        finishedAt: new Date(),
      },
    })
    .catch(() => {
      // Nothing useful to do if even the final status update fails.
    });
}
