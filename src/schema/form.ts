import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required. ",
    })
    .max(190, {
      message: "Name is too long. ",
    }),
  pronouns: z
    .string()
    .min(1, {
      message: "Pronouns are required. ",
    })
    .max(190, {
      message: "Pronouns are too long. ",
    }),
  gradYear: z
    .number()
    .min(2024, {
      message: "Graduation year must be at least 2024. ",
    })
    .max(2027, {
      message: "Graduation year must be at most 2027. ",
    }),
  preferredName: z
    .string()
    .min(1, {
      message: "Preferred name is required. ",
    })
    .max(190, {
      message: "Preferred name is too long. ",
    }),
  prefect: z.string().regex(/^[A-Za-z]\d[A-Za-z]$/, {
    message: "Prefect must be in the format A1A. ",
  }),
  birthday: z
    .string()
    .regex(/^(?:\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]))$/, {
      message: "Birthday must be declared properly. ",
    })
    .refine((d) => Boolean(d), {
      message: "Birthday is required. ",
    })
    .refine(
      (d) => {
        const date = new Date(d);
        if (isNaN(date.getTime())) return true;
        return date.getTime() < new Date().getTime();
      },
      {
        message: "Birthday must be in the past. ",
      }
    )
    .refine(
      (d) => {
        const date = new Date(d);
        if (isNaN(date.getTime())) return true;
        const now = new Date();
        date.setFullYear(date.getFullYear() + 11);
        return date.getTime() < now.getTime();
      },
      {
        message: "Birthday must be at least 11 years ago. ",
      }
    )
    .refine(
      (d) => {
        const date = new Date(d);
        if (isNaN(date.getTime())) return true;
        return date.getFullYear() > 1990;
      },
      {
        message: "Are you a 69x super senior? ",
      }
    ),

  referredBy: z
    .string()
    .max(190, {
      message: "Email is too long. ",
    })
    .email({
      message: "Email is invalid. ",
    })
    .regex(/@nycstudents.net$/, {
      message: "Email must be a NYCDOE email. ",
    })
    .nullish()
    .optional(),
  sgoSticker: z.boolean(),
  eventAlerts: z.boolean(),
});

export const editSchema = registerSchema.partial();
