import { targetEntrySchema } from "@/schema/giveaways";
import { execProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { TRPCError } from "@trpc/server";
import { chooseWinners } from "@/utils/helpers";
import { pusher } from "@/utils/pusher";
import { editMessage, generateGiveawayMessage } from "@/utils/webhook";

// so biolerplate needs to be export name shoudl be similar to file name blah blah
export const rerollWinner = execProcedure
  .input(targetEntrySchema)
  .mutation(async function ({ ctx, input: { id, userEmail, socketId } }) {
    const giveaway = await prisma.giveaway.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        type: true,
        ended: true,
        entries: {
          select: {
            order: true,
            userEmail: true,
            entries: true,
            won: true,
            rewardId: true,
            user: {
              select: {
                discordID: true,
                preferredName: true,
              },
            },
          },
        },
        winnerMsgID: true,
      },
    });

    if (!giveaway) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Giveaway not found",
      });
    }

    if (!giveaway.ended) {
    }

    const prevWinner = giveaway.entries.find(
      (entry) => entry.userEmail == userEmail
    );

    if (!prevWinner) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Entry not found",
      });
    }

    if (!prevWinner.won) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User did not win",
      });
    }

    const oldWinner = await prisma.giveawayEntry.update({
      where: {
        userEmail_giveawayId: {
          userEmail,
          giveawayId: id,
        },
      },
      data: {
        won: false,
        rewardId: null,
      },
    });

    const entries = giveaway.entries.filter((entry) => !entry.won);

    const [winner] = chooseWinners(entries, 1);
    const pushClient = pusher();

    const winners = giveaway.entries.filter(
      (entry) => entry.won && entry.userEmail !== oldWinner.userEmail
    );
    winners.push(giveaway.entries.find((entry) => entry.userEmail == winner)!);

    await prisma.giveawayEntry
      .update({
        where: {
          userEmail_giveawayId: {
            userEmail: winner,
            giveawayId: id,
          },
        },
        data: {
          won: true,
          ...(giveaway.type === "RANDOM" && { rewardId: prevWinner.rewardId }),
          ...(giveaway.type === "ORDERED_CLAIM" && { order: prevWinner.order }),
        },
      })
      .then((entry) =>
        Promise.all([
          pushClient.trigger(`private-g${id}`, "update", entry, {
            socket_id: socketId,
          }),
          pushClient.trigger(`private-g${id}`, "update", oldWinner, {
            socket_id: socketId,
          }),

          giveaway.winnerMsgID &&
            editMessage(
              giveaway.winnerMsgID,
              {
                content: generateGiveawayMessage(
                  giveaway.id,
                  winners.map(({ user }) => ({
                    preferredName: user.preferredName,
                    discordID: user.discordID,
                  }))
                ),
              },
              process.env.GIVEAWAY_WEBHOOK!
            ),
        ])
      );
  });
