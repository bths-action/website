import { publicProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const getExecs = publicProcedure.query(async () => {
  const details = await prisma.execDetails.findMany({
    include: {
      user: {
        select: {
          name: true,
          preferredName: true,
          pronouns: true,
          gradYear: true,
        },
      },
    },
  });

  return details;
});
