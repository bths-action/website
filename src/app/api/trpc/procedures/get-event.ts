import { getEventSchema } from "../schema/events";
import { publicProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const getEvent = publicProcedure
  .input(getEventSchema)
  .query(async ({ input: { id } }) => {
    return await prisma.event.findUnique({
      where: {
        id,
      },
    });
  });
