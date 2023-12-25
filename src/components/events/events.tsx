"use client";
import { GetEventsOutput, trpc, GetEventsInput } from "@/app/api/trpc/client";
import { useState, FC } from "react";
import { EventCard } from "./event-card";
import { LimitedContainer } from "../ui/container";
import { TransparentButton } from "../ui/buttons";

export type EventPreview = GetEventsOutput["events"][number];

export const metadata = {
  title: "Events",
  description: "Check out some of BTHS Action's events!",
};

export const Events: FC = () => {
  const [query, setQuery] = useState<GetEventsInput>({});
  const events = trpc.getEvents.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 0,
    }
  );

  return (
    <main>
      <LimitedContainer>
        <div className="flex flex-col gap-3 mb-2">
          {events.data?.pages
            .map((page) => page.events)
            .flat()
            .map((event) => (
              <EventCard event={event} />
            ))}
        </div>
        {events.isLoading || events.isFetchingNextPage ? (
          "Loading"
        ) : events.hasNextPage ? (
          <TransparentButton
            className="px-2 border-2 border-black dark:border-white"
            onClick={() => {
              events.fetchNextPage();
            }}
          >
            Load More
          </TransparentButton>
        ) : (
          "No more pages"
        )}
      </LimitedContainer>
    </main>
  );
};
