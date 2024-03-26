import { adminProcedure } from "../trpc";
import { updateGiveawaySchema } from "@/schema/giveaways";
import { prisma } from "@/utils/prisma";
import { editMessage, generateGiveaway } from "@/utils/webhook";

export const editGiveaway = adminProcedure
  .input(updateGiveawaySchema)
  .mutation(async ({ input, ctx }) => {
    const giveaway = await prisma.giveaway.update({
      where: {
        id: input.id,
      },
      data: { ...input },
    });

    await editMessage(
      giveaway.messageID,
      {
        embeds: generateGiveaway(giveaway as any, giveaway.id),
      },
      process.env.GIVEAWAY_WEBHOOK
    ).catch(() => {});

    return giveaway;
  });
