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

const baseEventSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Event name is required. ",
    })
    .max(190, {
      message: "Event name too long. ",
    }),
  description: z
    .string()
    .min(1, {
      message: "Event description is required. ",
    })
    .max(4000, {
      message: "Event description too long. ",
    }),
  maxPoints: z
    .number({
      invalid_type_error: "Max points must be a number. ",
    })
    .min(0, {
      message: "Max points must be greater than or equal to 0. ",
    }),
  maxHours: z
    .number({
      invalid_type_error: "Max points must be a number. ",
    })
    .min(0, {
      message: "Max hours must be greater than or equal to 0. ",
    }),
  eventTime: z.date({
    invalid_type_error: "Event time must be a valid date. ",
  }),
  finishTime: z.date().optional().nullish(),
  limit: z
    .number({
      invalid_type_error: "Max points must be a number. ",
    })
    .min(0, {
      message: "Limit must be greater than or equal to 0. ",
    })
    .nullish()
    .optional(),
  imageUrl: z.string().url().optional().nullish(),
  // gdrive url
  serviceLetters: z
    .string()
    .url({
      message: "Service letter must be a URL. ",
    })
    .regex(/^https:\/\/drive\.google\.com\/[^\s]*/, {
      message: "Service letter must be a valid Google Drive URL. ",
    })
    .optional()
    .nullish(),

  address: z
    .string()
    .min(1, {
      message: "Address is required. ",
    })
    .max(1000, {
      message: "Address is too long. ",
    }),
});

export const createEventSchema = baseEventSchema
  .refine(
    (data) => {
      console.log(data.maxHours, data.maxPoints);
      if (data.maxHours == 0 && data.maxPoints == 0) return false;
      return true;
    },
    {
      message: "Max points or max hours must be specified. ",
      path: ["maxHours", "maxPoints"],
    }
  )
  .refine(
    (data) => {
      if (!data.finishTime) return true;
      return data.eventTime.valueOf() < data.finishTime?.valueOf();
    },
    {
      message: "Finish time must be after event time. ",
      path: ["finishTime"],
    }
  )
  .and(z.object({}));

export const updateEventSchema = baseEventSchema.partial().extend({
  id: z.string(),
});

export const deleteEventSchema = z.object({
  id: z.string(),
});
