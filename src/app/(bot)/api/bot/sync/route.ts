import { registerCommands } from "@/app/(bot)/register-commands";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const headersList = headers();
  const auth = headersList.get("Authorization");
  if (auth !== process.env.BOT_SYNC_API_KEY) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  await registerCommands();

  return NextResponse.json(
    { success: true },
    {
      status: 200,
    }
  );
}
