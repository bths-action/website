import { TRPCError, initTRPC } from "@trpc/server";
import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "../auth/[...nextauth]/options";
import { Context } from ".";
import superjson from "superjson";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(async (opts) => {
  const session = await getServerSession(AUTH_OPTIONS);
  if (!session || !session.user || !session.user.email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not logged in.",
    });
  }
  return opts.next({
    ...opts,
    ctx: {
      ...opts.ctx,
      session: {
        ...session,
        user: {
          ...session.user,
          email: session.user.email,
        },
      },
    },
  });
});

const isAuthedAndExists = isAuthed.unstable_pipe(async (opts) => {
  const user = await prisma.user.findUnique({
    where: {
      email: opts.ctx.session.user.email,
    },
    include: {
      execDetails: true,
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not registered.",
    });
  }

  return opts.next({
    ...opts,
    ctx: {
      ...opts.ctx,
      user,
    },
  });
});

const isAdmin = isAuthedAndExists.unstable_pipe(async (opts) => {
  if (opts.ctx.user.position === "MEMBER") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not an admin.",
    });
  }
  return opts.next(opts);
});

const isExecOnly = isAuthedAndExists.unstable_pipe(async (opts) => {
  if (opts.ctx.user.position !== "EXEC") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not an exec.",
    });
  }
  return opts.next(opts);
});

export const authedProcedure = publicProcedure.use(isAuthed);
export const memberProcedure = publicProcedure.use(isAuthedAndExists);
export const adminProcedure = publicProcedure.use(isAdmin);
export const execProcedure = publicProcedure.use(isExecOnly);
