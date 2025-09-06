
import formData from "form-data";
import Mailgun from "mailgun.js";
import { convert } from "html-to-text";
import { prisma } from "./prisma";

export async function sendEmail(
  data: {
    subject: string;
    html: string;
  }
) {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
  });

  const recipients = (
    await prisma.user.findMany({
      where: { position: "EXEC", gradYear: { gt: 2025 } },
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
    console.log(response);
    return response;
  } catch (error) {
    console.log(JSON.stringify(error));
    throw error;
  }
}
