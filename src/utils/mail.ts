import formData from "form-data";
import Mailgun from "mailgun.js";
import { convert } from "html-to-text";
import { OLDEST_GRAD_YEAR, YOUNGEST_GRAD_YEAR } from "./constants";
import { prisma } from "./prisma";

export async function sendEmail(
  data: { subject: string; html: string },
  options?: { recipient?: string }
) {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
  });

  // Keep recipients within the current graduating classes.
  const recipients = options?.recipient
    ? [options.recipient]
    : (
        await prisma.user.findMany({
          where: {
            position: "EXEC",
            gradYear: {
              gte: OLDEST_GRAD_YEAR,
              lte: YOUNGEST_GRAD_YEAR,
            },
          },
        })
      ).map((user) => user.email);

  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: "BTHS Action <events@bthsaction.org>",
      to: recipients,
      subject: data.subject,
      html: data.html,
      text: convert(data.html),
    });
    return response;
  } catch (error) {
    throw error;
  }
}
