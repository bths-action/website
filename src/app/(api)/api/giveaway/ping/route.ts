import { NextRequest, NextResponse } from "next/server";
import { endGiveaway } from "../../trpc/procedures/end-giveaway";
import { headers } from "next/headers";
import { prisma } from "@/utils/prisma";

export async function POST(request: NextRequest) {
  const headersList = headers();
  const auth = headersList.get("Authorization");
  if (auth !== process.env.GIVEAWAY_API_KEY) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const overdueGiveaways = await prisma.giveaway.findMany({
    where: { endsAt: { lt: new Date() }, ended: false },
    select: { id: true },
  });
  await Promise.all(
    overdueGiveaways.map((giveaway) => endGiveaway(giveaway.id))
  );
  return NextResponse.json(
    {
      message: "Ended giveaways",
    },
    { status: 200 }
  );
}
