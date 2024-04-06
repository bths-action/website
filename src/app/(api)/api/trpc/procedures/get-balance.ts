import { REFERRAL_ENTRIES } from "@/utils/constants";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const getEntryBalance = memberProcedure.query(
  async ({ ctx: { user } }) => {
    const email = user.email;
    const [referrals, events, giveaways] = await Promise.all([
      prisma.user.findMany({
        where: {
          referredBy: email,
        },
        select: {
          gradYear: true,
        },
      }),
      prisma.eventAttendance.findMany({
        where: {
          userEmail: email,
        },
        select: {
          earnedEntries: true,
        },
      }),
      prisma.giveawayEntry.findMany({
        where: {
          userEmail: email,
        },
        select: {
          entries: true,
        },
      }),
    ]);

    const entries =
      referrals.length * REFERRAL_ENTRIES +
      events.reduce((acc, { earnedEntries }) => acc + earnedEntries, 0) -
      giveaways.reduce((acc, { entries }) => acc + entries, 0);

    return {
      entries,
    };
  }
);
