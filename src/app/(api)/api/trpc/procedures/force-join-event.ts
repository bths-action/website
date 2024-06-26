import { forceAttendanceSchema } from "@/schema/attendance";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { pusher } from "@/utils/pusher";
import { TRPCError } from "@trpc/server";

export const forceJoinEvent = adminProcedure
  .input(forceAttendanceSchema)
  .mutation(async ({ ctx, input: { id, user } }) => {
    user = user.toLowerCase();
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
    if (
      await prisma.eventAttendance.findFirst({
        where: { eventId: id, userEmail: user },
      })
    ) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User is already attending",
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
            discordID: true,
            instagram: true,
            phone: true,
          },
        },
      },
    });

    await pusher().trigger(`private-${id}`, "join", attendance);

    return attendance;
  });
