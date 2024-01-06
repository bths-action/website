import { z } from "zod";

export const queryEventsSchema = z.object({
  startRange: z.date().optional(),
  endRange: z.date().optional(),
  search: z.string().optional(),
  cursor: z.number().default(0),
  orderBy: z.enum(["eventTime", "createdAt"]).default("eventTime"),
  order: z.enum(["asc", "desc"]).default("desc"),
  includeStatus: z
    .object({
      unavailable: z.boolean(),
      available: z.boolean(),
      upcoming: z.boolean(),
    })
    .default({
      unavailable: true,
      available: true,
      upcoming: true,
    }),
});

export const getEventSchema = z.object({
  id: z.string(),
});
