import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { prisma } from "@/utils/prisma";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) => {
  const { email } = await params;
  if (
    (req.headers.get("Authorization")) !== process.env.LRLOGIN_API_KEY ||
    !(email.endsWith("@nycstudents.net") || email.endsWith("@schools.nyc.gov"))
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body;

  try {
    body = z
      .object({
        id: z.string(),
      })
      .parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: (e as ZodError).issues },
      { status: 400 }
    );
  }

  await prisma.user.upsert({
    where: { email },
    update: { discordID: body.id },
    create: {
      discordID: body.id,
      email,
      birthday: `${new Date().getFullYear() - 14}-01-01`,
      eventAlerts: true,
      gradYear: new Date().getFullYear() + 3,
      name: "New User",
      prefect: "A1A",
      preferredName: "New User",
      pronouns: "they/them",
      sgoSticker: false,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
};
