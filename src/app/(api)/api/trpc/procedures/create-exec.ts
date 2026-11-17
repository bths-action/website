import { execProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { createExecSchema } from "@/schema/exec";

export const createExec = execProcedure
  .input(createExecSchema)
  .mutation(async ({ ctx, input }) => {
    // Exec details may already exist with default values from a promotion, so
    // upsert instead of create.
    return await prisma.execDetails.upsert({
      where: { email: ctx.session.user.email! },
      update: input,
      create: {
        ...input,
        email: ctx.session.user.email!,
      },
    });
  });
