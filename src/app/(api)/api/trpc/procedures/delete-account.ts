import { createId } from "@paralleldrive/cuid2";
import { memberProcedure } from "../trpc";
import { prisma } from "@/utils/prisma";

export const deleteAccount = memberProcedure.mutation(
  async ({ ctx: { user } }) => {
    const id = createId();

    // Fetch the user's registeredAt
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
      select: {
        registeredAt: true,
      },
    });

    // Delete the user
    const deletedUsers = await prisma.user.delete({
      where: {
        email: user.email,
      },
    });

    // Create the deletedUsers entry
    if (existingUser) {
      await prisma.deletedUsers.create({
        data: {
          id,
          registeredAt: existingUser.registeredAt,
          leftAt: new Date(),
        },
      });
    }

    return deletedUsers;
  }
);
