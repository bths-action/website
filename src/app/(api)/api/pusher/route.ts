import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_OPTIONS } from "../auth/[...nextauth]/options";
import { z } from "zod";
import { pusher } from "@/utils/pusher";

const schema = z.object({
  socket_id: z.string(),
  channel_name: z.string(),
});

export const POST = async (req: NextRequest) => {
  const allowed = await getServerSession({ ...AUTH_OPTIONS }).then(
    async (s) => {
      if (!s?.user?.email) return false;

      return (
        (await prisma.user.findUnique({
          where: { email: s.user.email },
          select: { position: true },
        })) !== null
      );
    }
  );

  if (!allowed)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  if (!req.body)
    return NextResponse.json({ error: "Missing body" }, { status: 400 });
  const body: { [key: string]: any } = {};
  (await req.formData()).forEach((value, key) => {
    body[key] = value;
  });

  let parsedBody: z.infer<typeof schema>;

  try {
    parsedBody = schema.parse(body);
  } catch (e) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const response = pusher().authorizeChannel(
    parsedBody.socket_id,
    parsedBody.channel_name
  );
  return NextResponse.json(response);
};
