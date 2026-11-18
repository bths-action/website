import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure } from "../trpc";
import {
  EventEmailJobError,
  startEventEmailJob,
} from "@/utils/event-email-job";

export const resendEventEmail = adminProcedure
  .input(
    z.object({
      id: z.string(),
      /** Leave out anyone already recorded as having received this event. */
      skipAlreadySent: z.boolean().prefault(true),
    })
  )
  .mutation(async ({ input }) => {
    try {
      // Returns as soon as the job is queued; the send continues in the
      // background and the client polls getEventEmailJob for progress.
      return await startEventEmailJob(input.id, input.skipAlreadySent);
    } catch (error) {
      if (error instanceof EventEmailJobError) {
        throw new TRPCError({ code: error.code, message: error.message });
      }
      throw error;
    }
  });
