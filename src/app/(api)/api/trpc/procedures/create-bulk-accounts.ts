import { prisma } from "@/utils/prisma";
import { bulkAccountSchema } from "@/schema/bulk-accounts";
import { YOUNGEST_GRAD_YEAR } from "@/utils/constants";
import { execProcedure } from "../trpc";

export const createBulkAccounts = execProcedure
  .input(bulkAccountSchema)
  .mutation(async ({ input }) => {
    const emails = [...new Set(input.emails.map((email) => email.toLowerCase()))];
    const result = await prisma.user.createMany({
      data: emails.map((email) => ({
        email,
        name: email.split("@")[0],
        preferredName: email.split("@")[0],
        pronouns: "Prefer not to say",
        gradYear: YOUNGEST_GRAD_YEAR,
        prefect: "A1A",
        birthday: "2000-01-01",
        sgoSticker: false,
        eventAlerts: true,
      })),
      skipDuplicates: true,
    });

    return {
      created: result.count,
      skipped: emails.length - result.count,
    };
  });
