import { memberSearchSchema } from "@/schema/form";
import { UserPosition } from "@prisma/client";
import { execProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export type MemberSearchResult = {
  email: string;
  name: string | null;
  preferredName: string | null;
  position: UserPosition;
  gradYear: number | null;
};

const SEARCH_LIMIT = 10;

export const searchMembers = execProcedure
  .input(memberSearchSchema)
  .query(async ({ input: { query } }) => {
    // The database uses a binary collation, so LOWER() keeps the search
    // case-insensitive regardless of TiDB's collation settings.
    const term = `%${query.toLowerCase()}%`;

    // Emails are only searched when the query looks like an email. Otherwise a
    // single letter would match every address because of the shared domain.
    if (query.includes("@")) {
      return await prisma.$queryRaw<MemberSearchResult[]>`
        SELECT \`email\`, \`name\`, \`preferredName\`, \`position\`, \`gradYear\`
        FROM \`User\`
        WHERE LOWER(\`email\`) LIKE ${term}
           OR LOWER(\`name\`) LIKE ${term}
           OR LOWER(\`preferredName\`) LIKE ${term}
        ORDER BY COALESCE(\`name\`, \`email\`)
        LIMIT ${SEARCH_LIMIT}
      `;
    }

    return await prisma.$queryRaw<MemberSearchResult[]>`
      SELECT \`email\`, \`name\`, \`preferredName\`, \`position\`, \`gradYear\`
      FROM \`User\`
      WHERE LOWER(\`name\`) LIKE ${term}
         OR LOWER(\`preferredName\`) LIKE ${term}
      ORDER BY COALESCE(\`name\`, \`email\`)
      LIMIT ${SEARCH_LIMIT}
    `;
  });
