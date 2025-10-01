import { ExecPosition } from "@prisma/client";
import { z } from "zod";

export const createExecSchema = z.object({
  position: z.enum(ExecPosition, {
    error: (error) => {
      if (error.code === "invalid_value" && error.received == "") {
        return "Please specify a position. ";
      }
      return "Unknown error. ";
    },
  }),
  selfieURL: z
    .url({
      error: "Invalid URL. ",
    })
    .max(190, {
      error: "URL too long. ",
    })
    .nullish()
    .optional(),
  description: z
    .string()
    .min(1, {
      error: "Description can't be empty. ",
    })
    .max(5000, {
      error: "Description too long. ",
    }),
});

export const updateExecSchema = createExecSchema.partial();
