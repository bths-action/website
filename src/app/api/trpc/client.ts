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

export type EditFormInput = RouterInput["editForm"];
export type EditFormOutput = RouterOutput["editForm"];
export type GetFormInput = RouterInput["getForm"];
export type GetFormOutput = RouterOutput["getForm"];

export type TRPCError = TRPCClientErrorLike<RouterErrors>;

export const trpc = createTRPCReact<AppRouter>({});
