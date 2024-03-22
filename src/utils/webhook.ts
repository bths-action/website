import { CreateEventInput, CreateGiveawayInput } from "@/app/api/trpc/client";
import {
  APIEmbed,
  APIEmbedField,
  APIMessage,
  RESTPatchAPIWebhookWithTokenMessageJSONBody,
  RESTPostAPIWebhookWithTokenJSONBody,
} from "discord-api-types/v10";
import { GIVEAWAY_TYPE_MAP } from "./constants";

export function generateEvent(event: CreateEventInput, id: string): APIEmbed {
  const fields: APIEmbedField[] = [
    {
      name: `**Event ${event.finishTime ? "Start " : ""}Time:**`,
      value: event.eventTime.toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    },
  ];

  if (event.finishTime) {
    fields.push({
      name: "**Event Finish Time:**",
      value: event.finishTime.toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    });
  }

  if (event.limit) {
    fields.push({
      name: "**Max Members:**",
      value: event.limit.toString(),
    });
  }

  if (event.maxPoints) {
    fields.push({
      name: "**Points:**",
      value: event.maxPoints.toString(),
    });
  }

  if (event.maxHours) {
    fields.push({
      name: "**Hours:**",
      value: event.maxHours.toString(),
    });
  }

  if (event.maxGiveawayEntries) {
    fields.push({
      name: "**Giveaway Entries:**",
      value: event.maxGiveawayEntries.toString(),
    });
  }

  fields.push({
    name: "**Location:**",
    value: `[${event.address}](${encodeURI(
      `https://www.google.com/maps/dir/?api=1&destination=${event.address}&travelmode=transit`
    )})`,
  });

  return {
    title: "New Event: " + event.name,
    description: event.description,
    image: {
      url: event.imageURL || "https://bthsaction.org/icon.png",
    },
    timestamp: new Date().toISOString(),
    url: `https://bthsaction.org/events/${id}`,
    fields,
  };
}

export function generateGiveaway(
  giveaway: CreateGiveawayInput,
  id: string
): APIEmbed[] {
  const fields: APIEmbedField[] = [
    {
      name: "**Giveaway End Date:**",
      value: giveaway.endsAt.toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    },
    {
      name: "**Winners:**",
      value: giveaway.maxWinners.toString(),
    },
    {
      name: "Giveaway Type:",
      value: GIVEAWAY_TYPE_MAP[giveaway.type],
    },
  ];

  return [
    {
      title: "New Giveaway: " + giveaway.name,
      description: giveaway.description,
      image: {
        url: giveaway.imageURL || "https://bthsaction.org/icon.png",
      },
      timestamp: new Date().toISOString(),
      url: `https://bthsaction.org/giveaways/${id}`,
      fields,
    },
    {
      title: "Prizes:",
      timestamp: new Date().toISOString(),
      fields: giveaway.prizes.map((prize) => ({
        name: prize.name,
        value: prize.details,
      })),
    },
  ];
}

export async function sendMessage(
  options: string | RESTPostAPIWebhookWithTokenJSONBody,
  url = process.env.EVENT_WEBHOOK!
): Promise<APIMessage> {
  return fetch(url + "?wait=true", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  }).then((res) => res.json());
}

export async function editMessage(
  id: string,
  options: string | RESTPatchAPIWebhookWithTokenMessageJSONBody,
  url = process.env.EVENT_WEBHOOK!
): Promise<APIMessage> {
  return await fetch(`${url}/messages/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  }).then((e) => e.json());
}

export async function deleteMessage(
  id: string,
  url = process.env.EVENT_WEBHOOK!
): Promise<void> {
  if (!id) return;
  try {
    await fetch(`${url}/messages/${id}`, {
      method: "DELETE",
    });
  } catch (e) {}
}
