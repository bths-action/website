import { createGiveawaySchema } from "@/schema/giveaways";
import { adminProcedure } from "../trpc";
import { createId } from "@paralleldrive/cuid2";
import { generateGiveaway, sendMessage } from "@/utils/webhook";
import { prisma } from "@/utils/prisma";

export const createGiveaway = adminProcedure
  .input(createGiveawaySchema)
  .mutation(async ({ input, ctx }) => {
    // Create the giveaway
    const id = createId();

    const message = await sendMessage(
      {
        content: "<@&1131381016288825374> Giveaway Alert! 🎉 🤑",
        embeds: generateGiveaway(input, id),
      },
      process.env.GIVEAWAY_WEBHOOK!
    );

    const giveaway = await prisma.giveaway.create({
      data: {
        ...input,
        messageID: message.id,
        id,
      },
    });

    return giveaway;
  });
