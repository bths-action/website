import { claimPrizeSchema } from "@/schema/giveaways";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { TRPCError } from "@trpc/server";
import { pusher } from "@/utils/pusher";

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

    const entry = giveaway.entries.find(
      (entry) => entry.userEmail === userEmail
    );

    if (!entry)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User did not win.",
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

    if (entry.rewardId !== null)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User has already claimed prize.",
      });

    if (giveaway.type === "ORDERED_CLAIM") {
      if (!entry.order || entry.order < 0)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Assertion failed that an ordered claim giveaway has an correct order. Report this to the devs immediately.",
        });
      for (let i = 0; i < entry.order - 1; i++) {
        const otherReward = giveaway.entries[i].rewardId;
        if (otherReward === null)
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "Cannot claim prize until previous winners have claimed their prize.",
          });

        if (otherReward === rewardId)
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Prize has already been claimed.",
          });
      }
    }

    if (
      giveaway.type === "FIRST_CLAIM" &&
      giveaway.entries.some((entry) => entry.rewardId === rewardId)
    )
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Prize has already been claimed.",
      });

    const updatedEntry = await prisma.giveawayEntry.update({
      where: {
        userEmail_giveawayId: {
          userEmail,
          giveawayId: id,
        },
      },
      data: {
        rewardId,
      },
    });

    await pusher().trigger(`private-g${id}`, "update", updatedEntry, {
      socket_id: socketId,
    });

    return updatedEntry;
  });
