import { targetGiveawaySchema } from "@/schema/giveaways";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { TRPCError } from "@trpc/server";
import { chooseWinners, shuffle } from "@/utils/helpers";
import {
  editMessage,
  generateGiveaway,
  generateGiveawayMessage,
  sendMessage,
} from "@/utils/webhook";
import { pusher } from "@/utils/pusher";

// the reason im export    ing endGiveaway is cuz for the cron job btw
export const endGiveaway = async (
  id: string,
  earlyEnd = false,
  socketId: string | undefined = undefined
) => {
  const giveaway = await prisma.giveaway.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      maxWinners: true,
      name: true,
      description: true,
      endsAt: true,
      prizes: true,
      type: true,
      ended: true,
      messageID: true,
      entries: {
        select: {
          userEmail: true,
          entries: true,
          user: {
            select: {
              discordID: true,
              preferredName: true,
            },
          },
        },
      },
    },
  });

  if (!giveaway) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Giveaway not found",
    });
  }

  if (giveaway.ended) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Giveaway has already ended",
    });
  }

  const winners: string[] = chooseWinners(
    giveaway.entries,
    giveaway.maxWinners
  );

  await prisma.giveawayEntry.updateMany({
    where: {
      giveawayId: id,
      userEmail: { in: winners },
    },
    data: {
      won: true,
    },
  });

  // so when we end the giveaway, it says I have not won cuz no socket msg has been sent.
  // we can fix this by sending a pusher msg just like seen previously

  const winnerObjs = winners.map(
    (email) => giveaway.entries.find((entry) => entry.userEmail === email)!.user
  );

  let winnersPrizes:
    | {
        rewardID: number;
        discordID: string | null;
        preferredName: string;
      }[]
    | undefined;

  if (giveaway.type === "RANDOM" || giveaway.type === "ORDERED_CLAIM") {
    const list: number[] = [
      ...shuffle(
        Array(giveaway.maxWinners)
          .fill(0)
          .map((_, i) => i)
      ),
    ];

    if (giveaway.type === "RANDOM") {
      winnersPrizes = winnerObjs.map((user, i) => ({
        rewardID: list[i],
        discordID: user.discordID,
        preferredName: user.preferredName,
      }));
    }

    const pushClient = pusher();

    await Promise.all(
      winners.map(async (email, i) => {
        await prisma.giveawayEntry
          .update({
            where: {
              userEmail_giveawayId: {
                giveawayId: id,
                userEmail: email,
              },
            },
            data: {
              [giveaway.type == "RANDOM" ? "rewardId" : "order"]: list[i],
            },
          })
          .then((entry) => {
            pushClient.trigger(`private-g${id}`, "update", entry, {
              socket_id: socketId,
            });
          });
      })
    );
  }

  const [message] = await Promise.all([
    sendMessage(
      {
        // lets go back to reroll winner and regenerate the message
        content: generateGiveawayMessage(giveaway.id, winnerObjs),
      },
      process.env.GIVEAWAY_WEBHOOK!
    ),
    editMessage(
      giveaway.messageID,
      {
        embeds: generateGiveaway(giveaway as any, id, winnersPrizes),
      },
      process.env.GIVEAWAY_WEBHOOK
    ).then(console.log),
  ]);

  const updated = await prisma.giveaway.update({
    where: {
      id,
    },
    data: {
      ended: true,
      winnerMsgID: message.id,
      ...(earlyEnd && { endsAt: new Date() }),
    },
  });

  giveaway.ended = true;

  return { ...giveaway, endsAt: updated.endsAt };
};

export const endGiveawayProcedure = adminProcedure
  .input(targetGiveawaySchema)
  .mutation(async ({ ctx, input }) => {
    const { id, socketId } = input;

    return await endGiveaway(id, true, socketId);
  });
// sent on discord
