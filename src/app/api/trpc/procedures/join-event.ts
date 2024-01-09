import { attendanceWriteSchema } from "@/schema/attendance";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { TRPCError } from "@trpc/server";
import { pusher } from "@/utils/pusher";

export const joinEvent = memberProcedure
  .input(attendanceWriteSchema)
  .mutation(async ({ ctx, input: { id, socketId } }) => {
    const event = await prisma.event.findUnique({
      where: { id },
      select: {
        attendees: {
          select: {
            earnedPoints: true,
          },
        },
        limit: true,
        finishTime: true,
        eventTime: true,
      },
    });

    if (!event)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Event not found.",
      });

    if (event.finishTime) {
      if (event.eventTime.valueOf() > new Date().valueOf())
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Event has not started yet.",
        });
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

    if (event.limit && event.attendees.length >= event.limit)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Event limit reached.",
      });

    const attendance = await prisma.eventAttendance.create({
      data: {
        userEmail: ctx.user.email,
        eventId: id,
      },
    });

    await pusher.trigger(id, "join", attendance, {
      socket_id: socketId,
    });

    return attendance;
  });
