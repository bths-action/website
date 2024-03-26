import { authedProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const getForm = authedProcedure.query(async ({ ctx }) => {
  return await prisma.user.findUnique({
    where: {
      email: ctx.session.user.email,
    },
    include: {
      execDetails: true,
    },
  });
});
