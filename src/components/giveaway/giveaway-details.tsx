"use client";
import { Props } from "./giveaway-page";
import { FC } from "react";
import { MarkDownView } from "../ui/md-view";
import { GiveawayPrize } from "@/utils/constants";

export const GiveawayDescription: FC<Props> = ({ giveaway }) => {
  return (
    <div>
      <h4>Giveaway Details: </h4>
      <div className="min-h-[200px] max-h-[400px] m-2 bordered bg-gray-100 dark:bg-zinc-900 shadowed overflow-auto break-words p-2 rounded-md">
        <MarkDownView>{giveaway.description}</MarkDownView>
      </div>

      <h4>Prizes:</h4>

      <ol>
        {(giveaway.prizes as GiveawayPrize[]).map((prize, i) => (
          <li key={i}>
            <h5 className="inline">{prize.name}</h5>
            <p>
              {prize.details
                .split("\n")
                .map((val) => [<br />, val])
                .flat()
                .slice(1)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
};
