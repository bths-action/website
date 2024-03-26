import { deleteGiveawaySchema } from "@/schema/giveaways";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { deleteMessage } from "@/utils/webhook";

export const deleteGiveaway = adminProcedure
  .input(deleteGiveawaySchema)
  .mutation(async ({ input: { id } }) => {
    await prisma.giveawayEntry.deleteMany({
      where: {
        giveawayId: id,
      },
    });

    const event = await prisma.giveaway.delete({
      where: {
        id,
      },
    });

    await deleteMessage(event.messageID, process.env.GIVEAWAY_WEBHOOK).catch(
      () => {}
    );

    return event;
  });
