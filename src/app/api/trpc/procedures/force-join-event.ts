import { forceAttendanceSchema } from "@/schema/attendance";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { pusher } from "@/utils/pusher";
import { TRPCError } from "@trpc/server";

export const forceJoinEvent = adminProcedure
  .input(forceAttendanceSchema)
  .mutation(async ({ ctx, input: { id, user } }) => {
    if (
      (await prisma.user.findUnique({
        where: { email: user },
        select: { email: true },
      })) === null
    ) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
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
