import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { sendEmail } from "@/utils/mail";
import {
  emailGenerator,
  eventEmailSubject,
  getEventEmailRecipients,
  recordEventEmailRecipients,
} from "@/utils/event-email";

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

    // Testing sends always go to the configured test addresses, and are never
    // recorded (otherwise a second test resend would be skipped entirely).
    let recipients: { recipient: string[]; bcc: string[] };
    let skipped = 0;
    let onChunkSent: ((emails: string[]) => Promise<void>) | undefined;

    if (event.testing) {
      recipients = {
        recipient: [testingEmail!],
        bcc: [testingBccEmail!],
      };
    } else {
      const eligible = await getEventEmailRecipients(event.emailEveryone, {
        eventId: event.id,
        skipAlreadySent: input.skipAlreadySent,
      });

      recipients = { recipient: eligible.recipient, bcc: eligible.bcc };
      skipped = eligible.skipped;
      onChunkSent = (emails) => recordEventEmailRecipients(event.id, emails);
    }

    const recipientCount = recipients.recipient.length + recipients.bcc.length;

    if (recipientCount === 0) {
      return {
        messageID: null,
        recipientCount: 0,
        skippedCount: skipped,
        messages: 0,
      };
    }

    const response = await sendEmail(
      {
        subject: eventEmailSubject(event.name),
        html: emailGenerator(event, event.id),
      },
      {
        recipient: recipients.recipient,
        bcc: recipients.bcc,
        onChunkSent,
      }
    );

    return {
      messageID: response.id,
      recipientCount: response.recipientCount,
      skippedCount: skipped,
      messages: response.messages,
    };
  });
