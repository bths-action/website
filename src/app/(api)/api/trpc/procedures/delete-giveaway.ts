import { targetGiveawaySchema } from "@/schema/giveaways";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { deleteMessage } from "@/utils/webhook";

export const deleteGiveaway = adminProcedure
  .input(targetGiveawaySchema)
  .mutation(async ({ input: { id } }) => {
    await prisma.giveawayEntry.deleteMany({
      where: {
        giveawayId: id,
      },
    });

    const giveaway = await prisma.giveaway.delete({
      where: {
        id,
      },
    });

    await Promise.all([
      deleteMessage(giveaway.messageID, process.env.GIVEAWAY_WEBHOOK).catch(
        () => {}
      ),
      giveaway.winnerMsgID
        ? deleteMessage(
            giveaway.winnerMsgID,
            process.env.GIVEAWAY_WEBHOOK
          ).catch()
        : undefined,
    ]);

    return giveaway;
  });
