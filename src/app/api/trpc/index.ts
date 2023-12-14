import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  //generate smth random
  random: publicProcedure.query(async () => {
    return Math.random();
  }),
});

export type AppRouter = typeof appRouter;
