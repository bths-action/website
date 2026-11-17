import { memberLookupSchema } from "@/schema/form";
import { execProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const getMember = execProcedure
  .input(memberLookupSchema)
  .query(async ({ input: { email } }) => {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { execDetails: true },
    });
  });
