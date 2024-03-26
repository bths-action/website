import { queryEmailSchema } from "@/schema/emails";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const getEmails = adminProcedure
  .input(queryEmailSchema)
  .query(async ({ ctx, input }) => {
    const { eventAlerts, sgoSticker, gradYears } = input;

    const query = await prisma.user.findMany({
      where: {
        eventAlerts,
        sgoSticker,
        gradYear: {
          in: gradYears,
        },
      },
      select: {
        email: true,
      },
    });

    return query.map((u) => u.email);
  });
