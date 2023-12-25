import { router } from "./trpc";
import { getEvents } from "./procedures/get-events";

export const appRouter = router({
  //generate smth random
  getEvents,
});

export const createContext = async () => {
  return {};
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export type AppRouter = typeof appRouter;
