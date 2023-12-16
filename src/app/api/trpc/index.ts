import { getServerSession } from "next-auth";
import { publicProcedure, router } from "./trpc";
import { AUTH_OPTIONS } from "../auth/[...nextauth]/options";

export const appRouter = router({
  //generate smth random
  hello: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
});

export const createContext = async () => {
  const session = await getServerSession(AUTH_OPTIONS);

  return {
    session,
  };
};

export type AppRouter = typeof appRouter;
