import { z } from "zod";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const editSubscription = memberProcedure
  .input(
    z.object({
      subscribed: z.boolean(),
    })
  )
  .mutation(async ({ ctx, input: { subscribed } }) => {
    return await prisma.user.update({
      where: {
        email: ctx.user.email,
      },
      data: {
        eventAlerts: subscribed,
      },
    });
  });
