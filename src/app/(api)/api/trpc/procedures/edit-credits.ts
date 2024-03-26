import { z } from "zod";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const editCredits = adminProcedure
  .input(
    z.object({
      email: z.string(),
      credits: z.number(),
    })
  )
  .mutation(async ({ input }) => {
    return (
      await prisma.user.update({
        where: {
          email: input.email,
        },
        data: {
          givenCredits: input.credits,
        },
      })
    ).givenCredits;
  });
