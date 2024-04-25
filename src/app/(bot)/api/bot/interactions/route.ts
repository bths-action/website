import { verifyInteractionRequest } from "@/app/(bot)/verify-request";
import { prisma } from "@/utils/prisma";

import {
  APIInteractionResponse,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from "discord-api-types/v10";
import { NextResponse } from "next/server";
import { eventCommand } from "../commands/events";

/**
 * Use edge runtime which is faster, cheaper, and has no cold-boot.
 * If you want to use node runtime, you can change this to `node`, but you'll also have to polyfill fetch (and maybe other things).
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
 */

const ROOT_URL = "https://bthsaction.org/";

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Handle Discord interactions. Discord will send interactions to this endpoint.
 *
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction
 */
export async function POST(request: Request): Promise<NextResponse<any>> {
  const unknown = new NextResponse("Unknown command", { status: 400 });
  const verifyResult = await verifyInteractionRequest(
    request,
    process.env.DISCORD_APP_PUBLIC_KEY!
  );
  if (!verifyResult.isValid || !verifyResult.interaction) {
    return new NextResponse("Invalid request", { status: 401 });
  }
  const { interaction } = verifyResult;

  if (interaction.type === InteractionType.Ping) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return NextResponse.json({ type: InteractionResponseType.Pong });
  }

  // const { createCallerFactory } = t;
  const id = interaction.member?.user?.id;
  if (!id) {
    return new NextResponse("No user", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      discordID: id,
    },
    select: {
      email: true,
    },
  });

  if (!user) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
        embeds: [
          {
            color: 0xff0000,
            title: "Account Not Connected",
            description:
              "In order to use our Discord bot, you must connect your Discord account on the club website.",
          },
        ],
      },
    } as APIInteractionResponse);
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    const { data } = interaction;
    const params = {
      user,
      interaction,
    };
    if (data.name === "events") {
      return eventCommand(params);
    }
  }

  return unknown;
}
