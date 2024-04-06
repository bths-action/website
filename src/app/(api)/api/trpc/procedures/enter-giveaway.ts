import { targetGiveawaySchema } from "@/schema/giveaways";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { TRPCError } from "@trpc/server";

export const enterGiveaway = memberProcedure
  .input(targetGiveawaySchema)
  .mutation(async ({ input: { id }, ctx: { user } }) => {
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

    const entry = await prisma.giveawayEntry.create({
      data: {
        giveawayId: id,
        userEmail: user.email,
      },
    });

    return entry;
  });
