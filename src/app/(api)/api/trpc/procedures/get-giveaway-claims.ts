// alr lets see if u can implement this

import { targetGiveawaySchema } from "@/schema/giveaways";
import { publicProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "../../auth/[...nextauth]/options";

// method summary: return all winners of a giveaway and their associated prizes, order name (maybe email lets see that later)
export const getGiveawayClaims = publicProcedure
  .input(targetGiveawaySchema)
  .query(async ({ input: { id } }) => {
    const session = await getServerSession(AUTH_OPTIONS);
    // only show bare nessessities if user is not logged in
    const winners = await prisma.giveawayEntry.findMany({
      where: {
        giveawayId: id,
        ...(!session?.user?.email && {
          won: true,
        }),
      },
      select: {
        userEmail: Boolean(session?.user?.email),

        user: {
          select: {
            preferredName: true,
          },
        },
        rewardId: true,
        order: Boolean(session?.user?.email),
      },
    });

    return winners;
  });
