import { editSchema } from "@/schema/form";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const editForm = memberProcedure
  .input(editSchema)
  .mutation(async function ({ ctx, input }) {
    return await prisma.user.update({
      where: {
        email: ctx.session.user.email,
      },
      data: { ...input, lastUpdated: new Date() },
    });
  });
