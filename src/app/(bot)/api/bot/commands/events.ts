import { NextResponse } from "next/server";
import { Params } from "./types";
import { joinEventProcedure } from "@/app/(api)/api/trpc/procedures/join-event";
import { PRIMARY_COLOR_HEX } from "@/utils/constants";
import { TRPCError } from "@trpc/server";
import {
  ApplicationCommandOptionType,
  InteractionResponseType,
  MessageFlags,
  APIInteractionResponse,
} from "discord-api-types/v10";
import { leaveEventProcedure } from "@/app/(api)/api/trpc/procedures/leave-event";

export async function eventCommand({ user, interaction }: Params) {
  const unknown = new NextResponse("Unknown command", { status: 400 });
  const { data } = interaction;
  if (
    !data.options?.length ||
    data.options[0].type !== ApplicationCommandOptionType.Subcommand
  )
    return unknown;
  const action = data.options[0];
  if (!["join", "leave"].includes(action.name)) return unknown;
  if (
    !action.options?.length ||
    action.options[0].type !== ApplicationCommandOptionType.String
  )
    return unknown;
  const event = action.options[0];
  try {
    await (action.name === "join" ? joinEventProcedure : leaveEventProcedure)(
      user.email,
      event.value
    );
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
        embeds: [
          {
            color: PRIMARY_COLOR_HEX,
            title: `Successfully ${
              action.name === "join" ? "Joined" : "Left"
            } Event`,
            description:
              action.name === "join"
                ? `You have joined the event. However there may be more steps you have to take, please double check [the website](https://bthsaction.org/${event.value}) for more details.`
                : `You have left the event. Keep in mind that certain events may explicitly or implicitly require you to tell executives of such action.`,
          },
        ],
      },
    } as APIInteractionResponse);
  } catch (e) {
    if (e instanceof TRPCError)
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          flags: MessageFlags.Ephemeral,
          embeds: [
            {
              color: 0xff0000,
              title: `Failed to ${
                action.name === "join" ? "Join" : "Leave"
              } Event`,
              description: `Reason: ${e.message}`,
            },
          ],
        },
      } as APIInteractionResponse);
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        flags: MessageFlags.Ephemeral,
        embeds: [
          {
            color: 0xff0000,
            title: "Unknown Internal Error",
            description: `Error: ${String(e)}`,
          },
        ],
      },
    } as APIInteractionResponse);
  }
}
