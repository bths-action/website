import { z } from "zod";
import { authedProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const registerSchema = z.object({
  name: z.string().min(1).max(190),
  pronouns: z.string().min(1).max(190),
  gradYear: z.number().min(2024).max(2027),
  preferredName: z.string().min(1).max(190),
  prefect: z.string().regex(/^[A-Za-z]\d[A-Za-z]$/),
  birthday: z
    .string()
    .regex(/\b\d{4}-(?:1[0-2]|0?[1-9])-(?:3[0-1]|[12][0-9]|0?[1-9])\b/),
  referredBy: z
    .string()
    .max(190)
    .email()
    .regex(/@nycstudents.net$/)
    .optional(),
  sgoSticker: z.boolean(),
  eventAlerts: z.boolean(),
});

export const register = authedProcedure
  .input(registerSchema)
  .mutation(({ ctx, input }) => {
    prisma.user.create({
      data: {
        ...input,
        email: ctx.session.user.email!,
      },
    });
  });
