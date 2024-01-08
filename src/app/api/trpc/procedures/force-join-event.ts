import { forceSchema } from "@/schema/attendance";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { pusher } from "@/utils/pusher";

export const forceJoinEvent = adminProcedure
  .input(forceSchema)
  .mutation(async ({ ctx, input: { id, user } }) => {
    const attendance = await prisma.eventAttendance.create({
      data: {
        userEmail: user,
        eventId: id,
      },
    });

    await pusher.trigger(id, "join", attendance);

    return attendance;
  });
