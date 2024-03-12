import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { APIUser } from "discord-api-types/v10";
import { BASE_URL } from "@/utils/constants";

const REDIRECT_URI = `${BASE_URL}/api/connections/discord`;

const scope = ["identify"].join(" ");
const OAUTH_QS = new URLSearchParams({
  client_id: process.env.DISCORD_CLIENT_ID!,
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope,
}).toString();

const OAUTH_URI = `https://discord.com/api/oauth2/authorize?${OAUTH_QS}`;

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.redirect(
      `${BASE_URL}/api/connections/discord/error?${new URLSearchParams({
        error: "You are not logged in. Try logging in first.",
      })}`
    );
  }
  const form = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      discordID: true,
    },
  });

  if (!form) {
    return NextResponse.redirect(
      `${BASE_URL}/api/connections/discord/error?${new URLSearchParams({
        error: "No existing club member exists. Try signing up first.",
      })}`
    );
  }

  if (form.discordID) {
    return NextResponse.redirect(
      `${BASE_URL}/api/connections/discord/error?${new URLSearchParams({
        error: "Already connected to Discord.",
      })}`
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${BASE_URL}/api/connections/discord/error?${new URLSearchParams({
        error,
      })}`
    );
  }

  if (!code || typeof code !== "string")
    return NextResponse.redirect(OAUTH_URI);

  const body = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
    code,
    scope,
  }).toString();

  const { access_token = null, token_type = "Bearer" } = await fetch(
    "https://discord.com/api/oauth2/token",
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body,
    }
  ).then((res) => res.json());

  if (!access_token || typeof access_token !== "string") {
    return NextResponse.redirect(OAUTH_URI);
  }

  const user: APIUser = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `${token_type} ${access_token}`,
    },
  }).then((res) => res.json());

  if (!user.id) {
    return NextResponse.redirect(OAUTH_URI);
  }

  await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      discordID: user.id,
    },
  });

  return NextResponse.redirect(`${BASE_URL}/api/connections/discord/success`);
};
