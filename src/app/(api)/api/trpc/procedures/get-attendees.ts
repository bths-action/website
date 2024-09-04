import { attendanceSchema } from "@/schema/attendance";
import { adminProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";
import { TRPCError } from "@trpc/server";

export const getAttendees = adminProcedure
  .input(attendanceSchema)
  .query(async ({ ctx, input: { id } }) => {
    const data = await prisma.event.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        maxHours: true,
        maxPoints: true,
        eventTime: true,
        attendees: {
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
        },
      },
    });

    if (!data)
      throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

    return data;
  });
