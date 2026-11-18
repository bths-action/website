import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { recipientCapacityNow, sendEmail } from "@/utils/mail";
import {
  emailGenerator,
  eventEmailSubject,
  getEventEmailRecipients,
  recordEventEmailRecipients,
} from "@/utils/event-email";

/**
 * Sends one Mailgun message worth of an event email and reports what is left.
 * The edit modal calls this in a loop while it is open, so no single request
 * has to stay alive for the whole (several minute) send.
 */
export const resendEventEmail = adminProcedure
  .input(
    z.object({
      id: z.string(),
      /** Leave out anyone already recorded as having received this event. */
      skipAlreadySent: z.boolean().prefault(true),
    })
  )
  .mutation(async ({ input }) => {
    const event = await prisma.event.findUnique({
      where: { id: input.id },
    });

    if (!event) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Event not found.",
      });
    }

    const testingEmail = event.testing
      ? process.env.TESTING_EMAIL
      : undefined;
    const testingBccEmail = event.testing
      ? process.env.TESTING_BCC_EMAIL
      : undefined;

    if (event.testing && !testingEmail) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "TESTING_EMAIL is not configured.",
      });
    }
    if (event.testing && !testingBccEmail) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "TESTING_BCC_EMAIL is not configured.",
      });
    }

    const email = {
      subject: eventEmailSubject(event.name),
      html: emailGenerator(event, event.id),
    };

    // Testing sends always go to the configured test addresses in a single
    // message, and are never recorded (so a second test still delivers).
    if (event.testing) {
      const response = await sendEmail(email, {
        recipient: [testingEmail!],
        bcc: [testingBccEmail!],
      });

      return {
        pending: response.recipientCount,
        sent: response.recipientCount,
        remaining: 0,
        skipped: 0,
        waitMs: 0,
      };
    }

    const eligible = await getEventEmailRecipients(event.emailEveryone, {
      eventId: event.id,
      skipAlreadySent: input.skipAlreadySent,
    });

    const pending = eligible.recipient.length + eligible.bcc.length;
    if (pending === 0) {
      return {
        pending: 0,
        sent: 0,
        remaining: 0,
        skipped: eligible.skipped,
        waitMs: 0,
      };
    }

    // Mailgun allows 26 recipients per rolling 30 seconds. Rather than sleeping
    // here (which risks a request timeout), tell the client how long to wait.
    // A member batch needs two slots: the member and the `noreply@` To.
    const capacity = recipientCapacityNow(
      eligible.recipient.length > 0 ? 1 : 2
    );
    if (capacity.waitMs > 0) {
      return {
        pending,
        sent: 0,
        remaining: pending,
        skipped: eligible.skipped,
        waitMs: capacity.waitMs,
      };
    }

    const response = await sendEmail(email, {
      recipient: eligible.recipient,
      bcc: eligible.bcc,
      onChunkSent: (emails) => recordEventEmailRecipients(event.id, emails),
      maxMessages: 1,
      maxRetryWaitMs: 25_000,
    });

    return {
      pending,
      sent: response.recipientCount,
      remaining: response.remaining,
      skipped: eligible.skipped,
      waitMs: 0,
    };
  });
