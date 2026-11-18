import { z } from "zod";
import { adminProcedure } from "../trpc";
import { getLatestEventEmailJob } from "@/utils/event-email-job";

/** Latest (or current) background email send for an event, for the edit modal. */
export const getEventEmailJob = adminProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => getLatestEventEmailJob(input.id));
