"use client";
import { GetEventsOutput, trpc, GetEventsInput } from "@/app/api/trpc/client";
import { useState, FC } from "react";
import { EventCard } from "./event-card";
import { TransparentButton } from "../ui/buttons";
import { QueryForm } from "./query-form";
import { Loading } from "../ui/loading";
import { RequestError } from "../ui/error";
import { CreateEvent } from "./create-event";
import { motion } from "framer-motion";

export type EventPreview = GetEventsOutput["events"][number];

export const Events: FC = () => {
  const [query, setQuery] = useState<GetEventsInput>({
    cursor: 0,
    includeStatus: {
      available: true,
      unavailable: true,
      upcoming: true,
    },
    order: "desc",
    orderBy: "eventTime",
    search: "",
  });
  const events = trpc.getEvents.useInfiniteQuery(query, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialCursor: 0,
  });

  return (
    <>
      <QueryForm query={query} setQuery={setQuery} />

      <div className="flex flex-col gap-3 mb-2 overflow-visible pt-3">
        {events.data?.pages
          .map((page) => page.events)
          .map((events) => (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
              className="flex flex-col gap-3"
              initial="hidden"
              animate="show"
            >
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </motion.div>
          ))}
      </div>
      {events.isFetching && (
        <Loading
          loadingType="bar"
          spinnerProps={{
            height: 10,
            width: 800,
          }}
        >
          Loading...
        </Loading>
      )}
      {events.isError && <RequestError error={events.error} />}
      {!events.isFetching &&
        (events.hasNextPage ? (
          <TransparentButton
            className="px-2 bordered"
            disabled={events.isFetchingNextPage}
            onClick={() => {
              events.fetchNextPage();
            }}
          >
            Load More Events
          </TransparentButton>
        ) : (
          "No More Events"
        ))}

      <CreateEvent />
    </>
  );
};
