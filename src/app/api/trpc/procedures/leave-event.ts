import { attendanceSchema } from "@/schema/attendance";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { pusher } from "@/utils/pusher";

export const leaveEvent = memberProcedure
  .input(attendanceSchema)
  .mutation(async ({ ctx, input: { id } }) => {
    const attendance = await prisma.eventAttendance.delete({
      where: {
        userEmail_eventId: {
          eventId: id,
          userEmail: ctx.user.email,
        },
      },
    });

    await pusher.trigger(id, "delete", {
      email: attendance.userEmail,
    });

    return attendance;
  });
