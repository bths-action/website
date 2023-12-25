import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from ".";

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type GetEventsInput = RouterInput["getEvents"];
export type GetEventsOutput = RouterOutput["getEvents"];

export const trpc = createTRPCReact<AppRouter>({});
