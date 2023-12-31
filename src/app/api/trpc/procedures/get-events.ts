import { prisma } from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { publicProcedure } from "../trpc";

export const getEvents = publicProcedure
  .input(
    z.object({
      startRange: z.date().optional(),
      endRange: z.date().optional(),
      search: z.string().optional(),
      cursor: z.number().default(0),
      orderBy: z.enum(["eventTime", "createdAt"]).default("eventTime"),
      order: z.enum(["asc", "desc"]).default("desc"),
      includeStatus: z
        .object({
          unavailable: z.boolean(),
          available: z.boolean(),
          upcoming: z.boolean(),
        })
        .default({
          unavailable: true,
          available: true,
          upcoming: true,
        }),
    })
  )
  .query(async ({ ctx, input }) => {
    const whereConditions: Prisma.EventWhereInput[] = [];

    const { includeStatus, orderBy, order, search, cursor } = input;

    if (includeStatus.available)
      whereConditions.push({
        finishTime: null,
        eventTime: {
          gte: new Date(),
        },
      });

    if (includeStatus.unavailable) {
      whereConditions.push({
        finishTime: null,
        eventTime: {
          lt: new Date(),
        },
      });
      whereConditions.push({
        finishTime: {
          lt: new Date(),
        },
      });
    }

    if (includeStatus.upcoming) {
      whereConditions.push({
        finishTime: {
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
        cacheStrategy: {
          ttl: 15,
        },
        take: 11,
        skip: cursor * 10,
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
          attendees: {
            select: {
              eventId: true,
            },
          },
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
      nextCursor: events.length === 11 ? events.pop()! && cursor + 1 : null,
    };
  });
