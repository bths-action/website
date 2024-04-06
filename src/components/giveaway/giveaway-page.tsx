"use client";

import { Giveaway } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { GiveawayBanner } from "./giveaway-banner";
import { GiveawayDescription } from "./giveaway-details";
import { GiveawayEntries } from "./giveaway-entries";

export interface Props {
  giveaway: Giveaway;
}

export const GiveawayPage: FC<Props> = ({ giveaway }) => {
  const [date, setDate] = useState<Date | null>(null);
  const tick = () => {
    setDate(new Date());
  };

  useEffect(() => {
    const timerID = setTimeout(tick, 1000);
    return () => {
      clearTimeout(timerID);
    };
  }, [date]);

  return (
    <div>
      <GiveawayBanner date={date} giveaway={giveaway} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        <GiveawayDescription giveaway={giveaway} />
        <GiveawayEntries giveaway={giveaway} />
      </div>
    </div>
  );
};
