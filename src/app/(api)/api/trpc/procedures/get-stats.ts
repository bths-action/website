import { authedProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const getStats = authedProcedure.query(async ({ ctx }) => {
  const today = new Date();
  const [attendances, referrals] = await Promise.all([
    prisma.eventAttendance.findMany({
      where: {
        userEmail: ctx.session.user.email,
      },
      include: {
        event: {
          select: {
            name: true,
            eventTime: true,
          },
        },
      },
      orderBy: {
        registeredAt: "desc",
      },
    }),
    prisma.user
      .findMany({
        where: {
          referredBy: ctx.session.user.email,
          // only current school year
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
          miscPoints: true,
        },
      })
      .then((users) => users.length),
  ]);

  return {
    attendances,
    referrals,
  };
});
