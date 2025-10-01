import { adminProcedure } from "../trpc";
import { updateEventSchema } from "@/schema/events";
import { prisma } from "@/utils/prisma";
import { editMessage, generateEvent } from "@/utils/webhook";

export const editEvent = adminProcedure
  .input(updateEventSchema)
  .mutation(async ({ input, ctx }) => {
    if (input.description) {
      input.description = input.description.replaceAll(
        "{@link}",
        `https://bthsaction.org/events/${input.id}`
      );
    }

    console.log(input);

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
    }).catch(() => {});

    return event;
  });
