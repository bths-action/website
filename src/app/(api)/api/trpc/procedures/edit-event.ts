import { adminProcedure } from "../trpc";
import { updateEventSchema } from "@/schema/events";
import { prisma } from "@/utils/prisma";
import { editMessage, generateEvent, getEventWebhook } from "@/utils/webhook";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bthsaction.org";

export const editEvent = adminProcedure
  .input(updateEventSchema)
  .mutation(async ({ input, ctx }) => {
    if (input.description) {
      input.description = input.description.replaceAll(
        "{@link}",
        `${siteUrl}/events/${input.id}`
      );
    }


    const event = await prisma.event.update({
      where: {
        id: input.id,
      },
      data: { ...input },
    });

    await editMessage(event.messageID, {
      embeds: [
        generateEvent(
          {
            name: event.name,
            description: event.description,
            maxPoints: event.maxPoints,
            maxHours: event.maxHours,
            eventTime: event.eventTime,
            finishTime: event.finishTime,
            address: event.address,
            registerBefore: event.registerBefore,
            limit: event.limit,
            imageURL: event.imageURL,
            serviceLetters: event.serviceLetters,
          },
          event.id
        ),
      ],
    }, getEventWebhook("testing" in event && event.testing === true)).catch(() => {});

    return event;
  });
