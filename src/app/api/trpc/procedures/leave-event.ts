import { attendanceWriteSchema } from "@/schema/attendance";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { pusher } from "@/utils/pusher";

export const leaveEvent = memberProcedure
  .input(attendanceWriteSchema)
  .mutation(async ({ ctx, input: { id, socketId } }) => {
    const attendance = await prisma.eventAttendance.delete({
      where: {
        userEmail_eventId: {
          eventId: id,
          userEmail: ctx.user.email,
        },
      },
    });

    await pusher.trigger(
      `private-${id}`,
      "delete",
      {
        email: attendance.userEmail,
      },
      {
        socket_id: socketId,
      }
    );

    return attendance;
  });
