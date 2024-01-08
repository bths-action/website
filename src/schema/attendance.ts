import { z } from "zod";

export const attendanceSchema = z.object({
  id: z.string(),
});

export const forceSchema = attendanceSchema.extend({
  user: z.string().email(),
});
