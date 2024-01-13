import { GRAD_YEARS } from "@/utils/constants";
import { z } from "zod";

export const queryEmailSchema = z.object({
  eventAlerts: z.boolean().optional(),
  sgoSticker: z.boolean().optional(),
  gradYears: z.array(z.number()).default(GRAD_YEARS),
});
