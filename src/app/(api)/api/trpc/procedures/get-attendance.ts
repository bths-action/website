import { attendanceSchema } from "@/schema/attendance";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const getAttendance = memberProcedure
  .input(attendanceSchema)
  .query(async ({ ctx, input: { id } }) => {
    const attendance = await prisma.eventAttendance.findUnique({
      where: {
        userEmail_eventId: {
          eventId: id,
          userEmail: ctx.user.email,
        },
      },
    });

    return attendance;
  });
