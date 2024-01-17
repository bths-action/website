"use client";
import { GetFormOutput, GetStatsOutput } from "@/app/api/trpc/client";
import { FC } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export const PointsStats: FC<{
  account: NonNullable<GetFormOutput>;
  data: GetStatsOutput;
}> = ({ account, data }) => {
  const refPoints = Math.min(data.referrals, 20) * 5;
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
  const maxPoints = Math.max(totalPoints, 800);
  // console log everything
  for (const attendance of data.attendances) {
    console.log(attendance.earnedPoints);
  }
  return (
    <div>
      <h3>Points:</h3>
      <div className="relative w-full bg-gray-300 bg-opacity-30 h-4 flex">
        <motion.div
          className="h-full bg-yellow-500"
          initial={{
            width: 0,
          }}
          animate={{
            width: `${(account.miscPoints / maxPoints) * 100}%`,
          }}
          transition={{
            duration: 1,
          }}
        ></motion.div>
        <motion.div
          className="h-full bg-green-500 text-sm overflow-visible"
          initial={{
            width: 0,
          }}
          animate={{
            width: `${(refPoints / maxPoints) * 100}%`,
          }}
          transition={{
            duration: 1,
          }}
        ></motion.div>
        <motion.div
          className="h-full bg-blue-500 text-sm overflow-visible"
          initial={{
            width: 0,
          }}
          animate={{
            width: `${(eventPoints / maxPoints) * 100}%`,
          }}
          transition={{
            duration: 1,
          }}
        ></motion.div>
      </div>
      <div className="relative w-full bg-gray-300 bg-opacity-30 h-4 flex">
        <motion.div
          className="h-full bg-pink-500 text-sm overflow-visible"
          initial={{
            width: 0,
          }}
          animate={{
            width: `${((account.givenCredits * 25) / maxPoints) * 100}%`,
          }}
          transition={{
            duration: 1,
          }}
        ></motion.div>
      </div>
      32 credits is needed for the Tech diploma. <br />
      <span className="rounded-full w-3 h-3 bg-yellow-500 inline-block mr-2" />{" "}
      Last Year + Other Misc Points ({account.miscPoints})
      <br />
      <span className="rounded-full w-3 h-3 bg-green-500 inline-block mr-2" />{" "}
      Points from {data.referrals} Referral{data.referrals === 1 ? "" : "s"} (
      {refPoints})
      <br />
      <span className="rounded-full w-3 h-3 bg-blue-500 inline-block mr-2" />{" "}
      Points from Events ({eventPoints})
      <br />
      <span className="rounded-full w-3 h-3 bg-pink-500 inline-block mr-2" />{" "}
      {account.givenCredits} Credit{account.givenCredits === 1 ? "" : "s"} Paid
      Off ({account.givenCredits * 25} Points)
      <br />
      <span className="text-md">
        What does this mean? Since our club has to submit credits every
        semester, we do a system of "paying off" where we give the advisor the
        max we can give, and leave rest for next semester.
      </span>
      <h3>Hours:</h3>
      <div className="relative w-full bg-gray-300 bg-opacity-30 h-4 flex">
        <motion.div
          className="h-full bg-indigo-500 text-sm overflow-visible"
          initial={{
            width: 0,
          }}
          animate={{
            width: `${(eventHours / 50) * 100}%`,
          }}
          transition={{
            duration: 1,
          }}
        ></motion.div>
      </div>
      50 hours is needed for the Tech diploma. <br />
      <span className="rounded-full w-3 h-3 bg-indigo-500 inline-block mr-2" />{" "}
      Hours from Events ({eventHours})<h3>Event History:</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {
          // @ts-ignore
          data.attendances
            .sort((a, b) => {
              return a.event.eventTime.valueOf() < b.event.eventTime.valueOf()
                ? 1
                : -1;
            })
            .map((attendance) => {
              return (
                <div key={attendance.eventId}>
                  <h6>{attendance.event.name}</h6>
                  <p className="text-md">
                    Earned {attendance.earnedPoints} Points and{" "}
                    {attendance.earnedHours} Hours
                  </p>
                  <Link
                    href={`/events/${attendance.eventId}`}
                    className="default"
                  >
                    View Event
                  </Link>
                </div>
              );
            })
        }
      </div>
    </div>
  );
};
