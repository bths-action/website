import { editMemberSchema } from "@/schema/form";
import { TRPCError } from "@trpc/server";
import { execProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const editMember = execProcedure
  .input(editMemberSchema)
  .mutation(async ({ input: { email, ...data } }) => {
    const target = await prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });

    if (!target) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Member not found.",
      });
    }

    return await prisma.user.update({
      where: { email: target.email },
      data: { ...data, lastUpdated: new Date() },
      include: { execDetails: true },
    });
  });
