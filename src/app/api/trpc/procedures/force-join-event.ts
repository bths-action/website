import { forceAttendanceSchema } from "@/schema/attendance";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { pusher } from "@/utils/pusher";

export const forceJoinEvent = adminProcedure
  .input(forceAttendanceSchema)
  .mutation(async ({ ctx, input: { id, user } }) => {
    const attendance = await prisma.eventAttendance.create({
      data: {
        userEmail: user,
        eventId: id,
      },
      include: {
        user: {
          select: {
            name: true,
            preferredName: true,
          },
        },
      },
    });

    await pusher().trigger(`private-${id}`, "join", attendance);

    return attendance;
  });
