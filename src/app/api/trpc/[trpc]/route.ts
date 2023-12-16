import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from "@trpc/server/adapters/fetch";

import { appRouter } from "@/app/api/trpc";
import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "../../auth/[...nextauth]/options";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await getServerSession(AUTH_OPTIONS);

  return {
    session,
  };
};

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
