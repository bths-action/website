import { z } from "zod";

export const attendanceSchema = z.object({
  id: z.string(),
});

export const attendanceWriteSchema = attendanceSchema.extend({
  socketId: z.string().optional(),
});

export const forceAttendanceSchema = attendanceWriteSchema.extend({
  user: z.string().email(),
});
