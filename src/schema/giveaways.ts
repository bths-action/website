import { GiveawayType } from "@prisma/client";
import { z } from "zod";

export const baseGiveawaySchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required. ",
    })
    .max(190, { message: "Name is too long. " }),
  description: z
    .string()
    .min(1, {
      message: "Description is required. ",
    })
    .max(4000, { message: "Description is too long. " }),
  imageURL: z.string().url().optional().nullish(),
  endsAt: z.date({
    invalid_type_error: "Ends at must be a valid date. ",
  }),
  maxWinners: z
    .number({
      invalid_type_error: "Max winners must be a number. ",
    })
    .min(1, { message: "Max winners must be greater than or equal to 1. " }),
  prizes: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, {
            message: "Name is required. ",
          })
          .max(100, {
            message: "Name is too long. ",
          }),
        details: z
          .string()
          .max(1000, {
            message: "Details is too long. ",
          })
          .min(1, {
            message: "Details is required. ",
          }),
      })
    )
    .min(1, {
      message: "At least one prize is required. ",
    }),
  type: z.enum(
    [GiveawayType.RANDOM, GiveawayType.FIRST_CLAIM, GiveawayType.ORDERED_CLAIM],
    {
      errorMap: (error) => {
        if (error.code === "invalid_enum_value" && error.received == "") {
          return { message: "Please specify a giveaway type. " };
        }
        return { message: "Unknown error. " };
      },
    }
  ),
});

export const createGiveawaySchema = baseGiveawaySchema.refine(
  (data) => {
    return data.prizes.length === data.maxWinners;
  },
  {
    message: "Number of prizes must match number of winners. ",
    path: ["prize"],
  }
);

export const updateGiveawaySchema = baseGiveawaySchema.partial().extend({
  id: z.string(),
});

export const deleteGiveawaySchema = z.object({
  id: z.string(),
});
