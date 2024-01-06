import { updateExecSchema } from "../schema/exec";
import { execProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const editExec = execProcedure
  .input(updateExecSchema)
  .mutation(({ ctx, input }) => {
    return prisma.execDetails.update({
      where: {
        email: ctx.session.user.email,
      },
      data: input,
    });
  });
