import { router } from "./trpc";
import { getEvents } from "./procedures/get-events";
import { register } from "./procedures/register";
import { editForm } from "./procedures/edit-form";
import { getForm } from "./procedures/get-form";

export const appRouter = router({
  //generate smth random
  getEvents,
  register,
  editForm,
  getForm,
});

export const createContext = async () => {
  return {};
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export type AppRouter = typeof appRouter;
