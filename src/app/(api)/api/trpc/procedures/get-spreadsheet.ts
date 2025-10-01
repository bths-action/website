import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const getSpreadsheet = adminProcedure.query(async () => {
  const today = new Date();
  const refsRaw = await prisma.user.findMany({
    where: {
      referredBy: {
        not: null,
      },
      registeredAt: {
        gte: new Date(
          today.getFullYear() + (today.getMonth() >= 6 ? 0 : -1),
          6,
          1
        ),
        lt: new Date(
          today.getFullYear() + (today.getMonth() >= 6 ? 1 : 0),
          6,
          1
        ),
      },
    },
    select: {
      referredBy: true,
    },
  });

  const refUsers = refsRaw.map((user) => user.referredBy!);

  const refMap: Record<string, number> = {};

  for (const user of refsRaw) {
    refMap[user.referredBy!] = refMap[user.referredBy!]
      ? refMap[user.referredBy!] + 1
      : 1;
  }

  const [users, events] = await Promise.all([
    prisma.user
      .findMany({
        where: {
          OR: [
            {
              events: {
                some: {
                  earnedPoints: {
                    gt: 0,
                  },
                },
              },
            },
            {
              miscPoints: {
                gt: 0,
              },
            },
            {
              email: {
                in: refUsers,
              },
            },
          ],
        },
        select: {
          name: true,
          email: true,
          gradYear: true,
          prefect: true,
          events: {
            select: {
              eventId: true,
              earnedPoints: true,
            },
          },
          givenCredits: true,
          miscPoints: true,
          position: true,
        },
      })
      .then((users) =>
        users
          .map((user) => ({
            ...user,
            events: Object.fromEntries(
              user.events.map((event) => [event.eventId, event.earnedPoints])
            ),
            refCount: refMap[user.email] || 0,
          }))
          .sort((a, b) => {
            // sort by email
            return a.email.localeCompare(b.email);
          })
      ),
    prisma.event.findMany({
      select: {
        name: true,
        id: true,
      },
    }),
  ]);

  return {
    users,
    events,
  };
});
