import { authedProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { registerSchema } from "@/schema/form";
import { TRPCError } from "@trpc/server";

export const register = authedProcedure
  .input(registerSchema)
  .mutation(async ({ ctx, input }) => {
    const email = ctx.session.user.email!;

    // Bulk-created accounts only have an email, so registering completes the
    // existing row instead of failing on the unique email.
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { name: true },
    });

    if (existing?.name) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "You are already registered.",
      });
    }

    return await prisma.user.upsert({
      where: { email },
      create: {
        ...input,
        email,
      },
      update: {
        ...input,
        lastUpdated: new Date(),
      },
    });
  });
