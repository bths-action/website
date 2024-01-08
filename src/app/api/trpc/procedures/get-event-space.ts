import { getEventSchema } from "@/schema/events";
import { publicProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { TRPCError } from "@trpc/server";

export const getEventSpace = publicProcedure
  .input(getEventSchema)
  .query(async ({ input: { id } }) => {
    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      select: {
        limit: true,
      },
    });

    if (!event)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Event not found.",
      });

    if (event.limit == null)
      return {
        limit: null,
      };

    const attendees = await prisma.eventAttendance.count({
      where: {
        eventId: id,
      },
    });

    return {
      limit: event.limit,
      attendees,
    };
  });
