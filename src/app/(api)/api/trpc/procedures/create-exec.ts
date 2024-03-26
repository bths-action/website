import { execProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { createExecSchema } from "@/schema/exec";

export const createExec = execProcedure
  .input(createExecSchema)
  .mutation(async ({ ctx, input }) => {
    return await prisma.execDetails.create({
      data: {
        ...input,
        email: ctx.session.user.email!,
      },
    });
  });
