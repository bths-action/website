import { targetGiveawaySchema } from "@/schema/giveaways";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { TRPCError } from "@trpc/server";
import { pusher } from "@/utils/pusher";

export const enterGiveaway = memberProcedure
  .input(targetGiveawaySchema)
  .mutation(async ({ input: { id, socketId }, ctx: { user } }) => {
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

    await pusher().trigger(`private-g${id}`, "join", entry, {
      socket_id: socketId,
    });

    return entry;
  });
