import { createEventSchema } from "@/schema/events";
import { adminProcedure } from "../trpc";
import { createId } from "@paralleldrive/cuid2";
import { prisma } from "@/utils/prisma";
import { generateEvent, getEventWebhook, sendMessage } from "@/utils/webhook";
import { startEventEmailJob } from "@/utils/event-email-job";
import { Event } from "@prisma/client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bthsaction.org";

export const createEvent = adminProcedure
  .input(createEventSchema)
  .mutation(async function ({ input, ctx }): Promise<Event> {
    const id = createId();

    input.description = input.description.replaceAll(
      "{@link}",
      `${siteUrl}/events/${id}`
    );

    const testingEmail = input.testing
      ? process.env.TESTING_EMAIL
      : undefined;
    const testingBccEmail = input.testing
      ? process.env.TESTING_BCC_EMAIL
      : undefined;
    if (input.testing && !testingEmail) {
      throw new Error("TESTING_EMAIL is not configured.");
    }
    if (input.testing && !testingBccEmail) {
      throw new Error("TESTING_BCC_EMAIL is not configured.");
    }

    const message = await sendMessage({
      content:
        "Tired of events? Go to <#1134529490740064307> to remove <@&1136780952274735266>.\n# New event posted!",
      username: ctx.user.preferredName ?? undefined,
      avatar_url: ctx.user.execDetails?.selfieURL || undefined,
      embeds: [generateEvent(input, id)],
    }, getEventWebhook(input.testing));

    // Create the row first so the email job and the Discord embed can point at
    // it.
    const event = await prisma.event.create({
      data: {
        ...input,
        messageID: message.id,
        id,
      },
    });

    // Emails go out in the background: a full send is paced over a few minutes,
    // so it must not hold the create request (or the form) open.
    await startEventEmailJob(event.id);

    return event;
  });
