import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, {
      error: "Name is required. ",
    })
    .max(190, {
      error: "Name is too long. ",
    }),
  pronouns: z
    .string()
    .min(1, {
      error: "Pronouns are required. ",
    })
    .max(190, {
      error: "Pronouns are too long. ",
    }),
  gradYear: z
    .number()
    .min(2026, {
      error: "Graduation year must be at least 2026. ",
    })
    .max(2029, {
      error: "Graduation year must be at most 2029. ",
    }),
  preferredName: z
    .string()
    .min(1, {
      error: "Preferred name is required. ",
    })
    .max(190, {
      error: "Preferred name is too long. ",
    }),
  prefect: z.string().regex(/^[A-Za-z]\d[A-Za-z]$/, {
    error: "Prefect must be in the format A1A. ",
  }),
  birthday: z
    .string()
    .regex(/^(?:\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]))$/, {
      error: "Birthday must be declared properly. ",
    })
    .refine((d) => Boolean(d), {
      error: "Birthday is required. ",
    })
    .refine(
      (d) => {
        const date = new Date(d);
        if (isNaN(date.getTime())) return true;
        return date.getTime() < new Date().getTime();
      },
      {
        error: "Birthday must be in the past. ",
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
        error: "Birthday must be at least 11 years ago. ",
      }
    )
    .refine(
      (d) => {
        const date = new Date(d);
        if (isNaN(date.getTime())) return true;
        return date.getFullYear() > 1990;
      },
      {
        error: "Are you a 69x super senior? ",
      }
    ),

  phone: z
    .string()
    .regex(/^\d*?$/, {
      error: "Phone number must be a number.",
    })
    .nullish()
    .optional(),

  instagram: z.string().nullish().optional(),

  referredBy: z
    .email({
      error: "Email is invalid. ",
    })
    .max(190, {
      error: "Email is too long. ",
    })
    .regex(/@nycstudents.net$/, {
      error: "Email must be a NYCDOE email. ",
    })
    .nullish()
    .optional(),
  sgoSticker: z.boolean(),
  eventAlerts: z.boolean(),
});

export const editSchema = registerSchema.partial();
