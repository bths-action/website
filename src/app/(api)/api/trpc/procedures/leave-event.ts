import { attendanceWriteSchema } from "@/schema/attendance";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { pusher } from "@/utils/pusher";
import { TRPCError } from "@trpc/server";

export const leaveEventProcedure = async (
  email: string,
  id: string,
  socketId?: string
) => {
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    select: {
      finishTime: true,
      eventTime: true,
      attendees: {
        where: {
          userEmail: email,
        },
        select: {
          userEmail: true,
        },
      },
    },
  });

  if (event == null)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    });

  if (!event.attendees.length) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cannot leave, since you are not in the event.",
    });
  }

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
        userEmail: email,
      },
    },
  });

  await pusher().trigger(
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
};

export const leaveEvent = memberProcedure
  .input(attendanceWriteSchema)
  .mutation(async ({ ctx, input: { id, socketId } }) => {
    return await leaveEventProcedure(ctx.user.email, id, socketId);
  });
