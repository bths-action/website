import { targetGiveawaySchema } from "@/schema/giveaways";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const enterGiveaway = memberProcedure
  .input(targetGiveawaySchema)
  .mutation(async ({ input: { id }, ctx: { user } }) => {
    const entry = await prisma.giveawayEntry.create({
      data: {
        giveawayId: id,
        userEmail: user.email,
      },
    });

    return entry;
  });
