import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const disconnectDiscord = memberProcedure.mutation(
  async ({ ctx: { user } }) => {
    const updated = await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        discordID: null,
      },
    });
    return updated;
  }
);
