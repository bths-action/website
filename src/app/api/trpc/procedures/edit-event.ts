import { adminProcedure } from "../trpc";
import { updateEventSchema } from "@/schema/events";
import { prisma } from "@/utils/prisma";
import { editMessage, generateEmbed } from "@/utils/webhook";

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
      embeds: [generateEmbed(event, event.id)],
    }).catch(() => {});

    return event;
  });
