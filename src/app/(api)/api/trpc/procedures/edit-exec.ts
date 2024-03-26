import { updateExecSchema } from "@/schema/exec";
import { execProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const editExec = execProcedure
  .input(updateExecSchema)
  .mutation(async ({ ctx, input }) => {
    return await prisma.execDetails.update({
      where: {
        email: ctx.session.user.email,
      },
      data: input,
    });
  });
