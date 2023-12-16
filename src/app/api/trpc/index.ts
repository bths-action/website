import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  //generate smth random
  hello: publicProcedure.query(async ({ ctx }) => {
    return ctx.session;
  }),
});

export type AppRouter = typeof appRouter;
