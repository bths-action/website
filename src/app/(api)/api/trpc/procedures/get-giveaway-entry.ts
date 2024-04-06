import { targetGiveawaySchema } from "@/schema/giveaways";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const getGiveawayEntry = memberProcedure
  .input(targetGiveawaySchema)
  .query(async ({ input: { id }, ctx: { user } }) => {
    const entry = await prisma.giveawayEntry.findUnique({
      where: {
        userEmail_giveawayId: {
          userEmail: user.email,
          giveawayId: id,
        },
      },
    });

    return entry;
  });
