import { targetGiveawaySchema } from "@/schema/giveaways";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const leaveGiveaway = memberProcedure
  .input(targetGiveawaySchema)
  .mutation(async ({ input: { id }, ctx: { user } }) => {
    const entry = await prisma.giveawayEntry.delete({
      where: {
        userEmail_giveawayId: {
          giveawayId: id,
          userEmail: user.email,
        },
      },
    });

    return entry;
  });
