"use client";
import { GetGiveawaysOutput, trpc } from "@/app/(api)/api/trpc/client";
import { motion } from "framer-motion";
import { FC } from "react";
import { TransparentButton } from "../ui/buttons";
import { RequestError } from "../ui/error";
import { Loading } from "../ui/loading";
import { GiveawayCard } from "./giveaway-card";
import { CreateGiveaway } from "./create-giveaway";

export type GiveawayPreview = GetGiveawaysOutput["giveaways"][number];

export const Giveaways: FC = () => {
  const giveaways = trpc.getGiveaways.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 0,
    }
  );

  return (
    <>
      <div className="flex flex-col gap-3 mb-2 overflow-visible pt-3">
        {giveaways.data?.pages
          .map((page) => page.giveaways)
          .map((giveaways) => (
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
              className="grid gap-6 col-span-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
              initial="hidden"
              animate="show"
            >
              {giveaways.map((giveaway, index) => (
                <GiveawayCard giveaway={giveaway} index={index} />
              ))}
            </motion.div>
          ))}
      </div>
      {giveaways.isFetching && (
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
      {giveaways.isError && <RequestError error={giveaways.error} />}
      {!giveaways.isFetching &&
        (giveaways.hasNextPage ? (
          <TransparentButton
            className="px-2 bordered"
            disabled={giveaways.isFetchingNextPage}
            onClick={() => {
              giveaways.fetchNextPage();
            }}
          >
            Load More Giveaways
          </TransparentButton>
        ) : (
          "No More Giveaways"
        ))}
      <CreateGiveaway />
    </>
  );
};
