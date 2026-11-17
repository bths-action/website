import { prisma } from "@/utils/prisma";
import { bulkAccountSchema } from "@/schema/bulk-accounts";
import { execProcedure } from "../trpc";

export const createBulkAccounts = execProcedure
  .input(bulkAccountSchema)
  .mutation(async ({ input }) => {
    const emails = [...new Set(input.emails.map((email) => email.toLowerCase()))];
    const result = await prisma.user.createMany({
      data: emails.map((email) => ({
        email,
        eventAlerts: true,
      })),
      skipDuplicates: true,
    });

    return {
      created: result.count,
      skipped: emails.length - result.count,
    };
  });
