import { prisma } from "@/utils/prisma";
import { Converter } from "showdown";
import { OLDEST_GRAD_YEAR, YOUNGEST_GRAD_YEAR } from "@/utils/constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bthsaction.org";

export function eventEmailSubject(name: string) {
  return "New Action Event: " + name;
}

export type EventEmailData = {
  name: string;
  description: string;
  eventTime: Date;
  finishTime: Date | null;
  limit?: number | null;
  address: string;
  maxPoints: number;
  maxHours: number;
};

export async function getEventEmailRecipients(
  emailEveryone: boolean,
  options?: {
    /** Only skip already-sent addresses when this is set. */
    eventId?: string;
    skipAlreadySent?: boolean;
  }
) {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          gradYear: {
            gte: OLDEST_GRAD_YEAR,
            lte: YOUNGEST_GRAD_YEAR,
          },
        },
        // Bulk-created accounts have not completed their profile yet (no
        // grad year), but they should still receive event alerts.
        { name: null },
      ],
    },
    select: {
      email: true,
      position: true,
      eventAlerts: true,
    },
  });

  const execs = uniqueEmails(
    users
      .filter((user) => user.position === "EXEC")
      .map((user) => user.email)
  );

  const execEmails = new Set(execs.map((email) => email.toLowerCase()));
  const eligibleMembers = uniqueEmails(
    users
      .filter(
        (user) =>
          user.position === "MEMBER" && (emailEveryone || user.eventAlerts)
      )
      .map((user) => user.email)
  ).filter((email) => !execEmails.has(email.toLowerCase()));

  let alreadySent: Set<string> | null = null;
  if (options?.eventId && options.skipAlreadySent) {
    const rows = await prisma.eventEmailRecipient.findMany({
      where: { eventId: options.eventId },
      select: { email: true },
    });
    alreadySent = new Set(rows.map((row) => row.email.toLowerCase()));
  }

  const wasSent = (email: string) =>
    alreadySent !== null && alreadySent.has(email.toLowerCase());

  return {
    recipient: execs.filter((email) => !wasSent(email)),
    bcc: eligibleMembers.filter((email) => !wasSent(email)),
    skipped: [...execs, ...eligibleMembers].filter(wasSent).length,
  };
}

/**
 * Records addresses that have successfully received this event's email.
 * Safe to call repeatedly: existing (eventId, email) pairs are ignored.
 */
export async function recordEventEmailRecipients(
  eventId: string,
  emails: string[]
) {
  const rows = [...new Set(emails.map((email) => email.trim().toLowerCase()))]
    .filter(Boolean)
    .map((email) => ({ eventId, email }));

  if (rows.length === 0) return;

  await prisma.eventEmailRecipient.createMany({
    data: rows,
    skipDuplicates: true,
  });
}

function uniqueEmails(emails: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const email of emails) {
    const key = email.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(email.trim());
  }

  return result;
}

export function emailGenerator(input: EventEmailData, id: string) {
  return /* HTML */ `<!DOCTYPE html>
    <html>
      <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          body {
            font-family: Poppins, Ubuntu, Helvetica, Arial;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          a {
            text-decoration: none;
            color: inherit;
          }
          .description {
            margin-bottom: 8px;
            border-radius: 8px;
            padding: 8px;
            font-size: 14px;
            background: rgba(128, 128, 128, 0.3);
          }
          .description h1 {
            font-size: 24px;
          }
          .description h2 {
            font-size: 22px;
          }
          .description h3 {
            font-size: 20px;
          }
          .description h4 {
            font-size: 18px;
          }
          .description h5 {
            font-size: 16px;
          }
          .description h6 {
            font-size: 14px;
          }
          .description * {
            margin: 0;
          }
        </style>
        <link
          href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Cabin:400,700"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Poppins:400,700"
          rel="stylesheet"
          type="text/css"
        />
        <style type="text/css">
          @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
          @import url(https://fonts.googleapis.com/css?family=Cabin:400,700);
          @import url(https://fonts.googleapis.com/css?family=Poppins:400,700);
        </style>
      </head>
      <body>
        <div style="max-width:800px;margin:0 auto;padding:8px;">
          <div style="width:100%;text-align:center;">
            <img
              src="${siteUrl}/icon-rounded.png"
              style="border:0;margin:0 auto;outline:none;text-decoration:none;height:auto;width:144px"
            />
            <hr />
          </div>
          <h1
            style="font-family: 'Cabin', sans-serif; font-size: 32px; text-align: center;"
          >
            ${input.name}
          </h1>
          <h2 style="font-size: 24px; ">
            Event Time:
            ${input.eventTime.toLocaleString("en-US", {
              timeZone: "America/New_York",
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}${input.finishTime
              ? ` - ${input.finishTime.toLocaleString("en-US", {
                  timeZone: "America/New_York",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}`
              : ""}
          </h2>
          ${input.limit
            ? /** HTML */ `<h2
            style="font-size: 24px; "
          >
            Event Limit (Register Quick!): ${input.limit}
          </h2>`
            : ""}
          <h2 style="font-size: 24px; ">
            Event Location:
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${input.address}&travelmode=transit"
              target="_blank"
              rel="noopener"
              style="color: #0000EE;"
              >${input.address}</a
            >
          </h2>
          <h2 style="font-size: 24px; ">
            Points: ${input.maxPoints} | Hours: ${input.maxHours}
          </h2>
          <h2 style="font-size: 24px; ">Description:</h2>
          <div class="description">
            ${new Converter().makeHtml(input.description)}
          </div>
          <div style="width:100%;text-align:center;">
            <a
              href="${siteUrl}/events/${id}"
              style="display: inline-block; background: #4299e1; color: #ffffff; font-size: 32px; font-style: normal; font-weight: normal; line-height: 40px; margin: 0; text-decoration: none; text-transform: none; padding: 10px 20px 10px 20px; mso-padding-alt: 0px; border-radius: 8px;"
              target="_blank"
            >
              Open Event
            </a>
          </div>
          <br />
          <span style="font-family: Cabin, sans-serif; font-size: 18px;">
            <a
              href="${siteUrl}/unsubscribe"
              target="_blank"
              rel="noopener"
              style="color: #0000EE;"
              >Click to Unsubscribe</a
            >
          </span>
        </div>
      </body>
    </html>`;
}
