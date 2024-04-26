import {
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
  RESTPutAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";
import { prisma } from "@/utils/prisma";

const FETCH_URL = `https://discord.com/api/v10/applications/${process.env.DISCORD_APP_ID}/guilds/${process.env.DISCORD_GUILD_ID}/commands`;
export async function registerCommands() {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: {
      OR: [
        {
          eventTime: {
            gt: now,
          },
        },
        {
          finishTime: {
            gt: now,
          },
        },
      ],
    },
    select: {
      name: true,
      id: true,
    },
    take: 25,
    orderBy: {
      eventTime: "asc",
    },
  });

  const eventChoices: APIApplicationCommandOptionChoice[] = events.map(
    ({ name, id }) => ({
      name: name.length < 95 ? name : name.substring(0, 95) + "...",
      value: id,
    })
  );
  const response = await fetch(FETCH_URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
    method: "PUT",
    body: JSON.stringify([
      {
        name: "events",
        description: "Event related commands",
        options: [
          {
            name: "join",
            description: "Join event.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "event",
                description: "Event to join",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: eventChoices,
              },
            ],
          },
          {
            name: "leave",
            description: "Leave event.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: "event",
                description: "Event to leave",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: eventChoices,
              },
            ],
          },
        ],
      },
    ] as RESTPutAPIApplicationCommandsJSONBody),
  });

  if (response.ok) {
    console.log("Registered all commands");
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.error("Error registering commands");
    let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
    try {
      const error = await response.text();
      if (error) {
        errorText = `${errorText} \n\n ${error}`;
      }
    } catch (err) {
      console.error("Error reading body from request:", err);
    }
    console.error(errorText);
  }
}
