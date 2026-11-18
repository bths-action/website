"use client";

import { trpc } from "@/app/(api)/api/trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { FC, PropsWithChildren, useState } from "react";
import superjson from "superjson";

export const TRPCProvider: FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchInterval: false,
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  );
  const [trpcClient] = useState(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          // A request that dies (server restart, proxy timeout) comes back as an
          // empty or HTML body, which tRPC would report as "JSON.parse:
          // unexpected character". Say what actually happened instead.
          async fetch(input, init) {
            const response = await fetch(input, init);
            const contentType = response.headers.get("content-type") ?? "";

            if (!contentType.includes("application/json")) {
              throw new Error(
                `The server returned ${response.status} ${
                  response.statusText || "with no body"
                } instead of a response. The request may have timed out or the server restarted — reload and try again.`
              );
            }

            return response;
          },
        }),
      ],
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
