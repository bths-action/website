import { z } from "zod";

export const bulkAccountSchema = z.object({
  emails: z
    .array(
      z
        .email({ error: "Each entry must be a valid email address." })
        .regex(/@nycstudents\.net$/i, {
          error: "Student emails must use the @nycstudents.net domain.",
        })
    )
    .min(1, { error: "At least one student email is required." })
    .max(500, { error: "You can create at most 500 accounts at a time." }),
});
