import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { sendEmail } from "@/utils/mail";
import {
  emailGenerator,
  eventEmailSubject,
  getEventEmailRecipients,
} from "@/utils/event-email";

export const resendEventEmail = adminProcedure
  .input(z.object({ id: z.string() }))
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

    const recipients = event.testing
      ? { recipient: testingEmail!, bcc: [testingBccEmail!] }
      : await getEventEmailRecipients(event.emailEveryone);

    const recipientCount =
      (Array.isArray(recipients.recipient)
        ? recipients.recipient.length
        : recipients.recipient
          ? 1
          : 0) + (recipients.bcc?.length ?? 0);

    const response = await sendEmail(
      {
        subject: eventEmailSubject(event.name),
        html: emailGenerator(event, event.id),
      },
      recipients
    );

    return {
      messageID: response.id,
      recipientCount,
    };
  });
