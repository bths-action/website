"use client";

import { GetFormOutput, GetStatsOutput } from "@/app/(api)/api/trpc/client";
import {
  CREDIT_RATE,
  MAX_CREDITS,
  MAX_REFERRALS,
  REFERRAL_POINTS,
} from "@/utils/constants";
import { FC } from "react";
import { EventSummary, EventSummaryProps, SummaryCard } from "./card";

export const PointsStats: FC<{
  account: NonNullable<GetFormOutput>;
  data: GetStatsOutput;
}> = ({ account, data }) => {
  const refPoints = Math.min(data.referrals, MAX_REFERRALS) * REFERRAL_POINTS;
  const eventPoints = data.attendances.reduce(
    (acc, cur) => acc + cur.earnedPoints,
    0
  );
  const eventHours = data.attendances.reduce(
    (acc, cur) => acc + cur.earnedHours,
    0
  );
  const totalPoints = refPoints + eventPoints + (account.miscPoints || 0);
  // bths is 32 credits; 25 points per credit

  let awarded =
    account.position === "EXEC"
      ? MAX_CREDITS
      : account.didOsis
      ? Math.max(
          Math.min(
            MAX_CREDITS,
            Math.ceil(totalPoints / CREDIT_RATE - account.givenCredits)
          ),
          0
        )
      : 0;
  let credits = awarded;
  if (account.givenCredits !== 0 && awarded !== 0)
    credits = account.givenCredits + awarded;
  const eventSummary: EventSummaryProps[] = [
    {
      name: "Referrals",
      points: refPoints,
      hours: 0,
      index: 0,
      date: undefined,
    },
    ...data.attendances.map(
      ({ event, earnedPoints, earnedHours, eventId }, index) => ({
        name: "Event: " + event.name,
        points: earnedPoints,
        hours: earnedHours,
        link: `/events/${eventId}`,
        index: 0,
        date: event.eventTime,
      })
    ),
  ]
    .sort((a, b) => {
      // put no date ones at the end
      if (!a.date) return 1;
      if (!b.date) return -1;

      // put most recent first
      return b.date.getTime() - a.date.getTime();
    })
    .map((props, index) => ({
      ...props,
      index,
    }));

  return (
    <div>
      <div className="text-3xl font-bold">Summary</div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-6 m-3">
        <SummaryCard title="Total Points" value={totalPoints} />
        <SummaryCard title="Total Hours" value={eventHours} />
        <SummaryCard title="Total Club Credits" value={credits} />
        <SummaryCard title="Semester Club Credits" value={awarded} />
      </div>
      <div className="text-3xl font-bold pt-10">Breakdown</div>
      <div className="w-full">
        <div className="grid grid-cols-2 justify-between p-2">
          <span className="text-left text-xl font-semibold">Event/Task</span>
          <span className="text-right text-xl font-semibold">Rewards</span>
        </div>
        {eventSummary.map((props, index) => (
          <EventSummary key={index} {...props} />
        ))}
      </div>
    </div>
  );
};
