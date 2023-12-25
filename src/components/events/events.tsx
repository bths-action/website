"use client";
import { trpc } from "@/app/api/trpc/client";
import { useState, FC } from "react";
import { GetEventsInput } from "@/app/api/trpc/client";

export const Events: FC = () => {
  const [query, setQuery] = useState<GetEventsInput>({});
  const events = trpc.getEvents.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 0,
    }
  );

  console.log(events.data?.pages[0].events[0].createdAt);

  return (
    <>
      <code>{JSON.stringify(events.data, null, "\t")}</code>
      <br />
      {events.isLoading ? (
        "Loading"
      ) : events.hasNextPage ? (
        <button
          onClick={() => {
            events.fetchNextPage();
          }}
        >
          load more
        </button>
      ) : (
        "No more pages"
      )}
    </>
  );
};
