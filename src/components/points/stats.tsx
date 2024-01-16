"use client";
import { GetFormOutput, GetStatsOutput } from "@/app/api/trpc/client";
import { FC } from "react";

export const Stats: FC<{
  account: NonNullable<GetFormOutput>;
  data: GetStatsOutput;
}> = ({ account, data }) => {
  const refPoints = Math.max(data.referrals, 20) * 5;
  const eventPoints = data.attendances.reduce(
    (acc, cur) => acc + cur.earnedPoints,
    0
  );
  const eventHours = data.attendances.reduce(
    (acc, cur) => acc + cur.earnedHours,
    0
  );
  const totalPoints = refPoints + eventPoints + account.miscPoints || 0;

  return (
    <div>
      <h3>Points:</h3>
      <div className="relative w-full bg-gray-300 bg-opacity-30 h-6"></div>
    </div>
  );
};
