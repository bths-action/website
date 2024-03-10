import { publicProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const getGiveaways = publicProcedure.query(async ({ ctx }) => {
  return await prisma.giveaway.findMany();
});
