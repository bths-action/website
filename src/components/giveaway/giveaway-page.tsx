"use client";

import { Giveaway } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { GiveawayBanner } from "./giveaway-banner";

export const GiveawayPage: FC<{
  giveaway: Giveaway;
}> = ({ giveaway }) => {
  const [date, setDate] = useState<Date | null>(null);
  const tick = () => {
    setDate(new Date());
    console.log("tick");
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
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt officiis
      commodi libero earum optio dolorum laborum, voluptas corrupti, id, cum
      repellendus eos ducimus recusandae ut soluta adipisci vitae architecto
      possimus.
    </div>
  );
};
