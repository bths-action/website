import { attendanceEditSchema } from "@/schema/attendance";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { pusher } from "@/utils/pusher";

export const editAttendance = adminProcedure
  .input(attendanceEditSchema)
  .mutation(async ({ ctx, input }) => {
    const { id, user, socketId, ...data } = input;
    const attendance = await prisma.eventAttendance.update({
      where: { userEmail_eventId: { eventId: id, userEmail: user } },
      data,
    });

    pusher.trigger(`private-${id}`, "update", attendance, {
      socket_id: socketId,
    });

    return attendance;
  });
