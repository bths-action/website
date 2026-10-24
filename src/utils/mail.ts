import formData from "form-data";
import Mailgun from "mailgun.js";
import { convert } from "html-to-text";

export async function sendEmail(
  data: { subject: string; html: string },
  options?: {
    recipient?: string | string[];
    bcc?: string[];
  }
) {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
  });

  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: "BTHS Action <events@bthsaction.org>",
      to: options?.recipient,
      bcc: options?.bcc,
      subject: data.subject,
      html: data.html,
      text: convert(data.html),
    });
    return response;
  } catch (error) {
    throw error;
  }
}
