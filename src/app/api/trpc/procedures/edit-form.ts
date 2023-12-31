import { memberProcedure } from "../trpc";
import { registerSchema } from "./register";
import { prisma } from "@/utils/prisma";

const editSchema = registerSchema.partial();

export const editForm = memberProcedure
  .input(editSchema)
  .mutation(({ ctx, input }) => {
    prisma.user.update({
      where: {
        email: ctx.session.user.email,
      },
      data: input,
    });
  });
