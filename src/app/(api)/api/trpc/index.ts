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
import { editAttendance } from "./procedures/edit-attendance";
import { getAttendees } from "./procedures/get-attendees";
import { getExecs } from "./procedures/get-execs";
import { getEmails } from "./procedures/get-emails";
import { getStats } from "./procedures/get-stats";
import { getSpreadsheet } from "./procedures/get-spreadsheet";
import { editCredits } from "./procedures/edit-credits";
import { editSubscription } from "./procedures/edit-subscription";
import { getGiveaways } from "./procedures/get-giveaways";
import { disconnectDiscord } from "./procedures/disconnect-discord";
import { createGiveaway } from "./procedures/create-giveaway";
import { editGiveaway } from "./procedures/edit-giveaway";
import { deleteGiveaway } from "./procedures/delete-giveaway";
import { enterGiveaway } from "./procedures/enter-giveaway";
import { getEntryBalance } from "./procedures/get-balance";
import { leaveGiveaway } from "./procedures/leave-giveaway";
import { editEntryBalance } from "./procedures/edit-entry-balance";
import { getGiveawayEntry } from "./procedures/get-giveaway-entry";
import { endGiveawayProcedure } from "./procedures/end-giveaway";
import { getGiveawayClaims } from "./procedures/get-giveaway-claims";
import { deleteAccount } from "./procedures/delete-account";

export const appRouter = router({
  //generate smth random
  getEvents,
  getExecs,

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
  editAttendance,
  getAttendees,

  getEmails,
  getStats,
  getSpreadsheet,
  editCredits,

  editSubscription,
  disconnectDiscord,
  deleteAccount,

  getGiveaways,
  createGiveaway,
  editGiveaway,
  deleteGiveaway,
  endGiveaway: endGiveawayProcedure,

  enterGiveaway,
  getEntryBalance,
  leaveGiveaway,
  editEntryBalance,
  getGiveawayEntry,
  getGiveawayClaims,
});

export const createContext = async () => {
  return {};
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export type AppRouter = typeof appRouter;
