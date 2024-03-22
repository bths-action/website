import { ExecPosition } from "@prisma/client";
import { z } from "zod";

export const createExecSchema = z.object({
  position: z.nativeEnum(ExecPosition, {
    errorMap: (error) => {
      if (error.code === "invalid_enum_value" && error.received == "") {
        return { message: "Please specify a position. " };
      }
      return { message: "Unknown error. " };
    },
  }),
  selfieURL: z
    .string()
    .url({
      message: "Invalid URL. ",
    })
    .max(190, {
      message: "URL too long. ",
    })
    .nullish()
    .optional(),
  description: z
    .string()
    .min(1, {
      message: "Description can't be empty. ",
    })
    .max(5000, {
      message: "Description too long. ",
    }),
});

export const updateExecSchema = createExecSchema.partial();
