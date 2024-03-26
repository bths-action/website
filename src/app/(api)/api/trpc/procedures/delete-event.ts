import { adminProcedure } from "../trpc";
import { deleteEventSchema } from "@/schema/events";
import { prisma } from "@/utils/prisma";
import { deleteMessage } from "@/utils/webhook";

export const deleteEvent = adminProcedure
  .input(deleteEventSchema)
  .mutation(async ({ input: { id } }) => {
    await prisma.eventAttendance.deleteMany({
      where: {
        eventId: id,
      },
    });

    const event = await prisma.event.delete({
      where: {
        id,
      },
    });

    await deleteMessage(event.messageID).catch(() => {});

    return event;
  });
