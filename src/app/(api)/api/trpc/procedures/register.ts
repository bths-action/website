import { authedProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { registerSchema } from "@/schema/form";

export const register = authedProcedure
  .input(registerSchema)
  .mutation(async ({ ctx, input }) => {
    return await prisma.user.create({
      data: {
        ...input,
        email: ctx.session.user.email!,
      },
    });
  });
