import { CreateEventInput } from "@/app/api/trpc/client";
import {
  APIEmbed,
  APIEmbedField,
  APIMessage,
  RESTPatchAPIWebhookWithTokenMessageJSONBody,
  RESTPostAPIWebhookWithTokenJSONBody,
} from "discord-api-types/v10";

export function generateEmbed(event: CreateEventInput, id: string): APIEmbed {
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

  fields.push(
    {
      name: "**Points:**",
      value: event.maxPoints.toString(),
    },
    {
      name: "**Hours:**",
      value: event.maxHours.toString(),
    },
    {
      name: "**Location:**",
      value: `[${event.address}](${encodeURI(
        `https://www.google.com/maps/dir/?api=1&destination=${event.address}&travelmode=transit`
      )})`,
    }
  );

  return {
    title: "New Event: " + event.name,
    description: event.description,
    image: {
      url: event.imageUrl || "https://bthsaction.org/icon.png",
    },
    timestamp: new Date().toISOString(),
    url: `https://bthsaction.org/events/${id}`,
    fields,
  };
}

export async function sendMessage(
  options: string | RESTPostAPIWebhookWithTokenJSONBody
): Promise<APIMessage> {
  return fetch(process.env.EVENT_WEBHOOK! + "?wait=true", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  }).then((res) => res.json());
}

export async function editMessage(
  id: string,
  options: string | RESTPatchAPIWebhookWithTokenMessageJSONBody
): Promise<APIMessage> {
  return await fetch(`${process.env.EVENT_WEBHOOK!}/messages/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  }).then((e) => e.json());
}

export async function deleteMessage(id: string): Promise<void> {
  if (!id) return;
  try {
    await fetch(`${process.env.EVENT_WEBHOOK!}/messages/${id}`, {
      method: "DELETE",
    });
  } catch (e) {}
}
