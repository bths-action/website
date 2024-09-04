import { createEventSchema } from "@/schema/events";
import { adminProcedure } from "../trpc";
import { createId } from "@paralleldrive/cuid2";
import { CreateEventInput } from "../client";
import { Converter } from "showdown";
import { prisma } from "@/utils/prisma";
import { generateEvent, sendMessage } from "@/utils/webhook";
import { sendEmail } from "@/utils/mail";
import { Event } from "@prisma/client";

export const createEvent = adminProcedure
  .input(createEventSchema)
  .mutation(async function ({ input, ctx }): Promise<Event> {
    const id = createId();

    input.description = input.description.replaceAll(
      "{@link}",
      `https://bthsaction.org/events/${id}`
    );

    const message = await sendMessage({
      content:
        "Tired of events? Go to <#1134529490740064307> to remove <@&1136780952274735266>.\n# New event posted!",
      username: ctx.user.preferredName,
      avatar_url: ctx.user.execDetails?.selfieURL || undefined,
      embeds: [generateEvent(input, id)],
    });

    const emailBody = emailGenerator(input, id);

    const data = await Promise.all([
      prisma.event.create({
        data: {
          ...input,
          messageID: message.id,
          id,
        },
      }),
      sendEmail({
        subject: "New Action Event: " + input.name,
        html: emailBody,
      }),
    ]);

    const event = data[0];

    return event;
  });

function emailGenerator(input: CreateEventInput, id: string) {
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
              src="https://bthsaction.org/icon-rounded.png"
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
              href="https://bthsaction.org/events/${id}"
              style="display: inline-block; background: #4299e1; color: #ffffff; font-size: 32px; font-style: normal; font-weight: normal; line-height: 40px; margin: 0; text-decoration: none; text-transform: none; padding: 10px 20px 10px 20px; mso-padding-alt: 0px; border-radius: 8px;"
              target="_blank"
            >
              Open Event
            </a>
          </div>
          <br />
          <span style="font-family: Cabin, sans-serif; font-size: 18px;">
            <a
              href="https://bthsaction.org/unsubscribe"
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
