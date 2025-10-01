import { z } from "zod";

export const queryEventsSchema = z.object({
  startRange: z.date().optional(),
  endRange: z.date().optional(),
  search: z.string().optional(),
  cursor: z.int().min(0).prefault(0),
  orderBy: z.enum(["eventTime", "createdAt"]).prefault("eventTime"),
  order: z.enum(["asc", "desc"]).prefault("desc"),
  includeStatus: z
    .object({
      unavailable: z.boolean(),
      available: z.boolean(),
      upcoming: z.boolean(),
    })
    .prefault({
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
      error: "Event name is required. ",
    })
    .max(190, {
      error: "Event name too long. ",
    }),
  description: z
    .string()
    .min(1, {
      error: "Event description is required. ",
    })
    .max(4000, {
      error: "Event description too long. ",
    }),
  maxPoints: z
    .number({
      error: (issue) =>
        issue.input === undefined ? undefined : "Max points must be a number. ",
    })
    .min(0, {
      error: "Max points must be greater than or equal to 0. ",
    }),
  maxHours: z
    .number({
      error: (issue) =>
        issue.input === undefined ? undefined : "Max points must be a number. ",
    })
    .min(0, {
      error: "Max hours must be greater than or equal to 0. ",
    }),
  eventTime: z.date({
    error: (issue) =>
      issue.input === undefined
        ? undefined
        : "Event time must be a valid date. ",
  }),
  finishTime: z.date({
    error: (issue) =>
      issue.input === undefined
        ? undefined
        : "Event time must be a valid date. ",
  }),
  registerBefore: z.boolean().prefault(true),
  limit: z
    .number({
      error: (issue) =>
        issue.input === undefined ? undefined : "Max points must be a number. ",
    })
    .min(0, {
      error: "Limit must be greater than or equal to 0. ",
    })
    .nullish()
    .optional(),
  imageURL: z.url().optional().nullish(),
  // gdrive url
  serviceLetters: z
    .url({
      error: "Service letter must be a URL. ",
    })
    .regex(/^https:\/\/drive\.google\.com\/[^\s]*/, {
      error: "Service letter must be a valid Google Drive URL. ",
    })
    .optional()
    .nullish(),

  address: z
    .string()
    .min(1, {
      error: "Address is required. ",
    })
    .max(1000, {
      error: "Address is too long. ",
    }),
});

export const createEventSchema = baseEventSchema
  .refine(
    (data) => {
      return !(data.maxHours == 0 && data.maxPoints == 0);
    },
    {
      path: ["maxHours"],
      error: "Some reward must be specified. ",
    }
  )
  .refine(
    (data) => {
      return !(data.maxHours == 0 && data.maxPoints == 0);
    },
    {
      path: ["maxPoints"],
      error: "Some reward must be specified. ",
    }
  )
  .refine(
    (data) => {
      if (!data.finishTime) return true;
      return data.eventTime.valueOf() < data.finishTime?.valueOf();
    },
    {
      path: ["finishTime"],
      error: "Finish time must be after event time. ",
    }
  )
  .and(z.object({}));

export const updateEventSchema = baseEventSchema.partial().extend({
  id: z.string(),
  closed: z.boolean().optional(),
});

export const deleteEventSchema = z.object({
  id: z.string(),
});
