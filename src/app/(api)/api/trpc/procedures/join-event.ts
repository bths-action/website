import { attendanceWriteSchema } from "@/schema/attendance";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { TRPCError } from "@trpc/server";
import { pusher } from "@/utils/pusher";

export const joinEventProcedure = async (
  email: string,
  id: string,
  socketId?: string
) => {
  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      attendees: {
        select: {
          earnedPoints: true,
          userEmail: true,
        },
      },
      limit: true,
      finishTime: true,
      eventTime: true,
      closed: true,
      registerBefore: true,
    },
  });

  if (!event)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found.",
    });

  if (event.closed) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Event is closed.",
    });
  }

  if (!event.registerBefore && event.eventTime > new Date()) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Event has not started yet.",
    });
  }

  if ((event.registerBefore ? event.eventTime : event.finishTime) < new Date())
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Event has already ended.",
    });

  if (event.limit && event.attendees.length >= event.limit)
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Event limit reached.",
    });

  if (event.attendees.find((user) => user.userEmail == email)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You have already joined the event.",
    });
  }

  const attendance = await prisma.eventAttendance.create({
    data: {
      userEmail: email,
      eventId: id,
    },
    include: {
      user: {
        select: {
          name: true,
          preferredName: true,
        },
      },
    },
  });

  await pusher().trigger(`private-${id}`, "join", attendance, {
    socket_id: socketId,
  });

  return attendance;
};

export const joinEvent = memberProcedure
  .input(attendanceWriteSchema)
  .mutation(async ({ ctx, input: { id, socketId } }) => {
    return await joinEventProcedure(ctx.user.email, id, socketId);
  });
