import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/app/api/trpc";

const handler = (req: Request) => {
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });
};
