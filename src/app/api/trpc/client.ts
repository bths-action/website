import { TRPCClientErrorLike, createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from ".";

import type {
  inferRouterError,
  inferRouterInputs,
  inferRouterOutputs,
} from "@trpc/server";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterErrors = inferRouterError<AppRouter>;

export type GetEventsInput = RouterInput["getEvents"];
export type GetEventsOutput = RouterOutput["getEvents"];

export type RegisterInput = RouterInput["register"];
export type RegisterOutput = RouterOutput["register"];

export type CreateExecInput = RouterInput["createExec"];
export type CreateExecOutput = RouterOutput["createExec"];

export type EditExecInput = RouterInput["editExec"];
export type EditExecOutput = RouterOutput["editExec"];

export type EditFormInput = RouterInput["editForm"];
export type EditFormOutput = RouterOutput["editForm"];

export type GetFormInput = RouterInput["getForm"];
export type GetFormOutput = RouterOutput["getForm"];

export type GetEventInput = RouterInput["getEvent"];
export type GetEventOutput = RouterOutput["getEvent"];

export type CreateEventInput = RouterInput["createEvent"];
export type CreateEventOutput = RouterOutput["createEvent"];

export type EditEventInput = RouterInput["editEvent"];
export type EditEventOutput = RouterOutput["editEvent"];

export type DeleteEventInput = RouterInput["deleteEvent"];
export type DeleteEventOutput = RouterOutput["deleteEvent"];

export type JoinEventInput = RouterInput["joinEvent"];
export type JoinEventOutput = RouterOutput["joinEvent"];

export type ForceJoinEventInput = RouterInput["forceJoinEvent"];
export type ForceJoinEventOutput = RouterOutput["forceJoinEvent"];

export type LeaveEventInput = RouterInput["leaveEvent"];
export type LeaveEventOutput = RouterOutput["leaveEvent"];

export type GetEventSpaceInput = RouterInput["getEventSpace"];
export type GetEventSpaceOutput = RouterOutput["getEventSpace"];

export type GetAttendanceInput = RouterInput["getAttendance"];
export type GetAttendanceOutput = RouterOutput["getAttendance"];

export type EditAttendanceInput = RouterInput["editAttendance"];
export type EditAttendanceOutput = RouterOutput["editAttendance"];

export type GetAttendeesInput = RouterInput["getAttendees"];
export type GetAttendeesOutput = RouterOutput["getAttendees"];

export type GetExecsInput = RouterInput["getExecs"];
export type GetExecsOutput = RouterOutput["getExecs"];

export type TRPCError = TRPCClientErrorLike<RouterErrors>;

export const trpc = createTRPCReact<AppRouter>({});
