import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { execProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const setMemberPosition = execProcedure
  .input(
    z.object({
      email: z.email({ error: "Email is invalid. " }),
      position: z.enum(["MEMBER", "EXEC"]),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const email = input.email;

    if (email.toLowerCase() === ctx.user.email.toLowerCase()) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You cannot change your own position.",
      });
    }

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

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { email: target.email },
        data: { position: input.position, lastUpdated: new Date() },
        include: { execDetails: true },
      });

      // A demoted exec keeps their ExecDetails row otherwise, which would leave
      // them listed on /executives even though they are no longer an exec.
      if (input.position === "MEMBER") {
        await tx.execDetails.deleteMany({ where: { email: target.email } });
      } else {
        // Execs are always listed on /executives, so make sure they have a row
        // even before they fill in their exec profile.
        await tx.execDetails.upsert({
          where: { email: target.email },
          update: {},
          create: { email: target.email },
        });
      }

      return user;
    });
  });
