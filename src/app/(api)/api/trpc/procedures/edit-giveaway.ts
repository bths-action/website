import { adminProcedure } from "../trpc";
import { updateGiveawaySchema } from "@/schema/giveaways";
import { prisma } from "@/utils/prisma";
import { editMessage, generateGiveaway } from "@/utils/webhook";
import { TRPCError } from "@trpc/server";

export const editGiveaway = adminProcedure
  .input(updateGiveawaySchema)
  .mutation(async ({ input, ctx }) => {
    const giveaway = await prisma.giveaway.findUnique({
      where: {
        id: input.id,
      },
      select: {
        ended: true,
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

    const updated = await prisma.giveaway.update({
      where: {
        id: input.id,
      },
      data: { ...input },
    });

    await editMessage(
      updated.messageID,
      {
        embeds: generateGiveaway(updated as any, updated.id),
      },
      process.env.GIVEAWAY_WEBHOOK
    ).catch(() => {});

    return updated;
  });
