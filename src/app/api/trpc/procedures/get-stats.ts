import { authedProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const getStats = authedProcedure.query(async ({ ctx }) => {
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
    }),
    prisma.user
      .findMany({
        where: {
          referredBy: ctx.session.user.email,
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
