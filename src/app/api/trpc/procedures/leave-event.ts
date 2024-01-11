import { attendanceWriteSchema } from "@/schema/attendance";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { pusher } from "@/utils/pusher";
import { TRPCError } from "@trpc/server";

export const leaveEvent = memberProcedure
  .input(attendanceWriteSchema)
  .mutation(async ({ ctx, input: { id, socketId } }) => {
    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      select: {
        finishTime: true,
        eventTime: true,
      },
    });

    if (event == null)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Event not found",
      });

    if (event.finishTime) {
      if (event.finishTime.valueOf() < new Date().valueOf())
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Event has already ended.",
        });
    } else if (event.eventTime.valueOf() < new Date().valueOf())
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Event has already ended.",
      });

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
