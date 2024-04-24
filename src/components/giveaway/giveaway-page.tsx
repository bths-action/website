"use client";

import { Giveaway } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { GiveawayBanner } from "./giveaway-banner";
import { GiveawayDescription } from "./giveaway-details";
import { GiveawayEntries } from "./giveaway-entries";
import { AdminActions } from "./admin-actions";

export interface Props {
  giveaway: Giveaway;
}

export interface PropsWrite {
  giveaway: Giveaway;
  setGiveaway: (giveaway: Giveaway) => void;
}

export const GiveawayPage: FC<Props> = ({ giveaway: initial }) => {
  const [giveaway, setGiveaway] = useState(initial);
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
      <div className="flex flex-wrap gap-2 my-2 justify-center">
        <AdminActions giveaway={giveaway} setGiveaway={setGiveaway} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 my-4">
        <GiveawayDescription giveaway={giveaway} />
        <GiveawayEntries giveaway={giveaway} />
      </div>
    </div>
  );
};
