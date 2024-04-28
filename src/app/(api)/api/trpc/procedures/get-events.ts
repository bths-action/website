import { prisma } from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { publicProcedure } from "../trpc";
import { queryEventsSchema } from "@/schema/events";

export const getEvents = publicProcedure
  .input(queryEventsSchema)
  .query(async ({ ctx, input }) => {
    const whereConditions: Prisma.EventWhereInput[] = [];

    const { includeStatus, orderBy, order, search, cursor } = input;

    if (includeStatus.available)
      whereConditions.push({
        OR: [
          {
            closed: false,
            registerBefore: true,
            eventTime: {
              gte: new Date(),
            },
          },
          {
            closed: false,
            registerBefore: false,
            eventTime: {
              lt: new Date(),
            },
            finishTime: {
              gte: new Date(),
            },
          },
        ],
      });

    if (includeStatus.unavailable) {
      whereConditions.push({
        OR: [
          {
            registerBefore: true,
            eventTime: {
              lt: new Date(),
            },
          },
          {
            registerBefore: false,
            finishTime: {
              lt: new Date(),
            },
          },
          {
            closed: true,
          },
        ],
      });
    }

    if (includeStatus.upcoming) {
      whereConditions.push({
        registerBefore: false,
        eventTime: {
          gte: new Date(),
        },
      });
    }

    const where: Prisma.EventWhereInput = {
      OR: whereConditions,
      eventTime: {
        gte: input.startRange,
        lte: input.endRange,
      },
      name: {
        contains: search,
      },
    };

    const events = await prisma.event
      .findMany({
        take: 13,
        skip: cursor * 12,
        orderBy: {
          [orderBy]: order,
        },
        where,
        select: {
          id: true,
          name: true,
          imageURL: true,
          eventTime: true,
          finishTime: true,
          limit: true,
          maxHours: true,
          maxPoints: true,
          closed: true,
          registerBefore: true,
          attendees: {
            select: {
              eventId: true,
            },
          },
          maxGiveawayEntries: true,
        },
      })
      .then((events) =>
        events
          .filter(
            (event) =>
              // just (!(!includeStatus.unavailable && event.limit !== null && event.attendees.length >= event.limit))
              // but we need demorgans law! 🤓
              includeStatus.unavailable ||
              !event.limit ||
              event.attendees.length < event.limit
          )
          .map((event) => {
            return {
              ...event,
              attendees: event.attendees.length,
            };
          })
      );

    return {
      events,
      nextCursor: events.length === 13 ? events.pop()! && cursor + 1 : null,
    };
  });
