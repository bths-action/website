import { claimPrizeSchema } from "@/schema/giveaways";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { TRPCError } from "@trpc/server";

// alr lets see if u can build the boilerplate for this file
export const claimPrize = memberProcedure
  .input(claimPrizeSchema)
  .mutation(async ({ ctx, input: { id, socketId, rewardId, userEmail } }) => {
    const giveaway = await prisma.giveaway.findUnique({
      where: {
        id,
      },
      select: {
        prizes: true,
        type: true,
        ended: true,
        entries: {
          where: {
            userEmail,
            won: true,
          },
          select: {
            order: true,
            rewardId: true,
            userEmail: true,
          },
        },
      },
    });

    if (!giveaway)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Giveaway not found.",
      });

    if (!giveaway.ended)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Giveaway has not ended.",
      });

    if (giveaway.type === "RANDOM")
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Cannot claim prize for random giveaway.",
      });

    if (!giveaway.entries.some((entry) => entry.userEmail === userEmail))
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User did not win.",
      });

    if (giveaway.type === "ORDERED_CLAIM") {
      // code to check and error early if user is not next in line
      // if (giveaway.entries.order  )
      //     throw new TRPCError({
      //     code: "FORBIDDEN",
      //     message: "User is not next in line.",
      //     });
    }

    // code to claim prize
  });
