import { editEntrySchema } from "@/schema/giveaways";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { REFERRAL_ENTRIES } from "@/utils/constants";
import { TRPCError } from "@trpc/server";
import { pusher } from "@/utils/pusher";

export const editEntryBalance = memberProcedure
  .input(editEntrySchema)
  .mutation(async ({ input: { id, entries, socketId }, ctx: { user } }) => {
    const giveaway = await prisma.giveaway.findUnique({
      where: {
        id,
      },
      select: {
        endsAt: true,
      },
    });

    if (!giveaway) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Giveaway not found",
      });
    }

    if (giveaway.endsAt < new Date()) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Giveaway has ended",
      });
    }

    const [events, referrals, used, entry] = await Promise.all([
      prisma.eventAttendance.findMany({
        where: {
          userEmail: user.email,
          earnedEntries: {
            gt: 0,
          },
        },
        select: {
          earnedEntries: true,
        },
      }),
      prisma.user.count({
        where: {
          referredBy: user.email,
        },
      }),
      prisma.giveawayEntry.findMany({
        where: {
          userEmail: user.email,
          entries: {
            gt: 0,
          },
        },
        select: {
          entries: true,
        },
      }),
      prisma.giveawayEntry.findUnique({
        where: {
          userEmail_giveawayId: {
            userEmail: user.email,
            giveawayId: id,
          },
        },
      }),
    ]);

    if (!entry) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You do not have any entries for this giveaway.",
      });
    }

    const balance =
      events.reduce((acc, { earnedEntries }) => acc + earnedEntries, 0) +
      referrals * REFERRAL_ENTRIES -
      used.reduce((acc, { entries }) => acc + entries, 0);

    if (balance > 0 || entry.entries > entries) {
      const newEntry = await prisma.giveawayEntry.update({
        where: {
          userEmail_giveawayId: {
            userEmail: user.email,
            giveawayId: id,
          },
        },
        data: {
          entries: Math.min(entry.entries + balance, entries),
        },
      });

      return {
        entry: newEntry,
        balance: balance + entry.entries - newEntry.entries,
      };
    }

    // take a look a this, examine its types and make an educated guess on what it does
    // feel free to take a look at function content
    await pusher().trigger(`private-g${id}`, "update", entry, {
      socket_id: socketId,
    });

    return {
      balance,
      entry,
    };
  });
