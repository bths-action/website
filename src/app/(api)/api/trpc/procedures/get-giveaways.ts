import { prisma } from "@/utils/prisma";
import { publicProcedure } from "../trpc";
import { getGiveawaysSchema } from "@/schema/giveaways";

export const getGiveaways = publicProcedure
  .input(getGiveawaysSchema)
  .query(async ({ ctx, input: { cursor } }) => {
    const giveaways = await prisma.giveaway.findMany({
      cacheStrategy: {
        ttl: 15,
      },
      take: 7,
      skip: cursor * 6,
      select: {
        name: true,
        id: true,
        endsAt: true,
        maxWinners: true,
        type: true,
        imageURL: true,
      },
    });

    return {
      giveaways,
      nextCursor:
        giveaways.length === 13 ? giveaways.pop()! && cursor + 1 : null,
    };
  });
