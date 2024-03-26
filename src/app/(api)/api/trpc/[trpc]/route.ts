import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createContext } from "@/app/(api)/api/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
