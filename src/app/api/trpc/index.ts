import { router } from "./trpc";
import { getEvents } from "./procedures/get-events";
import { register } from "./procedures/register";
import { editForm } from "./procedures/edit-form";
import { getForm } from "./procedures/get-form";
import { createExec } from "./procedures/create-exec";
import { editExec } from "./procedures/edit-exec";
import { getEvent } from "./procedures/get-event";
import { createEvent } from "./procedures/create-event";
import { editEvent } from "./procedures/edit-event";
import { deleteEvent } from "./procedures/delete-event";
import { forceJoinEvent } from "./procedures/force-join-event";
import { joinEvent } from "./procedures/join-event";
import { leaveEvent } from "./procedures/leave-event";
import { getEventSpace } from "./procedures/get-event-space";
import { getAttendance } from "./procedures/get-attendance";

export const appRouter = router({
  //generate smth random
  getEvents,

  register,
  editForm,
  getForm,

  createExec,
  editExec,

  getEvent,
  createEvent,
  editEvent,
  deleteEvent,

  joinEvent,
  forceJoinEvent,
  leaveEvent,
  getEventSpace,
  getAttendance,
});

export const createContext = async () => {
  return {};
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export type AppRouter = typeof appRouter;
