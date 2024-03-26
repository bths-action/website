"use client";
import { GetFormOutput, GetStatsOutput } from "@/app/(api)/api/trpc/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FC } from "react";
import { BsTriangleFill } from "react-icons/bs";

export const PointsStats: FC<{
  account: NonNullable<GetFormOutput>;
  data: GetStatsOutput;
}> = ({ account, data }) => {
  const refPoints = Math.min(data.referrals, 20) * 5;
  const refEntries = data.referrals * 0.5;
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
  const credits = Math.ceil(totalPoints / 25);
  const totalEntries =
    refEntries +
    data.attendances.reduce((acc, cur) => acc + cur.earnedEntries, 0);
  return (
    <div>
      <div className="text-3xl font-bold">Summary</div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3 my-3">
        <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg overflow-hidden h-full shadowed">
          <div className="h-14 overflow-visible z-20 bg-default -mb-1 flex justify-center items-center text-white relative">
            <div className="font-bold">Total Points</div>
          </div>
          <div className="p-4">
            <div className="font-bold text-center">{totalPoints}</div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg overflow-hidden h-full shadowed">
          <div className="h-14 overflow-visible z-20 bg-default -mb-1 flex justify-center items-center text-white relative">
            <div className="font-bold">Total Hours</div>
          </div>
          <div className="p-4">
            <div className="font-bold text-center">{eventHours}</div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg overflow-hidden h-full shadowed">
          <div className="h-14 overflow-visible z-20 bg-default flex justify-center items-center text-white relative">
            <div className="font-bold">Club Credits</div>
          </div>
          <div className="p-4">
            <div className="font-bold text-center">{credits}</div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg overflow-hidden h-full shadowed">
          <div className="h-14 overflow-visible z-20 bg-default -mb-1 flex justify-center items-center text-white relative">
            <div className="font-bold">Total Giveaway Entries</div>
          </div>
          <div className="p-4">
            <div className="font-bold text-center">{totalEntries}</div>
          </div>
        </div>
      </div>
      <div className="text-3xl font-bold pt-10">Breakdown</div>
      <div className="w-full">
        <div className="grid grid-cols-2 justify-between p-2">
          <span className="text-left text-xl font-semibold">Event/Task</span>
          <span className="text-right text-xl font-semibold">Rewards</span>
        </div>
        <hr />
        <motion.div
          animate={{
            x: 0,
          }}
          transition={{
            type: "spring",
            delay: 0.15,
            bounce: 0.2,
            duration: 0.6,
          }}
          initial={{
            x: "100%",
          }}
          className="grid grid-cols-2 justify-between items-center hover:dark:bg-zinc-900 hover:bg-zinc-100 px-2 py-1"
        >
          <span className="text-left">
            {data.referrals} Referral{data.referrals != 1 && "s"}
          </span>
          <span className="text-right">
            <BsTriangleFill className="text-green-500 inline mr-2 w-3 h-3" />
            {refPoints} Point{refPoints != 1 && "s"}
            <br />
            <BsTriangleFill className="text-green-500 inline mr-2 w-3 h-3" />
            {refEntries} Entr{refEntries != 1 ? "ies" : "y"}
          </span>
        </motion.div>
        {data.attendances.map((attendance, index) => (
          <>
            <hr />
            <motion.div
              animate={{
                x: 0,
              }}
              transition={{
                type: "spring",
                delay: 0.15 * (index + 1),
                bounce: 0.2,
                duration: 0.6,
              }}
              initial={{
                x: "100%",
              }}
              key={index}
              className="grid grid-cols-2 justify-between items-center hover:dark:bg-zinc-900 hover:bg-zinc-100 px-2 py-1"
            >
              <span className="text-left">
                <Link
                  href={`/events/${attendance.eventId}`}
                  className="default"
                >
                  {attendance.event.name}
                </Link>
              </span>
              <span className="text-right">
                {attendance.earnedPoints == 0 &&
                  attendance.earnedHours == 0 &&
                  attendance.earnedEntries == 0 && <>---</>}
                {attendance.earnedPoints != 0 && (
                  <div>
                    <BsTriangleFill
                      className={`${
                        attendance.earnedPoints > 0
                          ? "text-green-500 "
                          : "text-red-500 rotate-180"
                      } inline mr-2 w-3 h-3`}
                    />
                    {attendance.earnedPoints} Point
                    {attendance.earnedPoints != 1 && "s"}
                  </div>
                )}

                {attendance.earnedHours != 0 && (
                  <div>
                    <BsTriangleFill
                      className={`${
                        attendance.earnedHours > 0
                          ? "text-green-500 "
                          : "text-red-500 rotate-180"
                      } inline mr-2 w-3 h-3`}
                    />
                    {attendance.earnedHours} Hour
                    {attendance.earnedHours != 1 && "s"}
                  </div>
                )}

                {attendance.earnedEntries != 0 && (
                  <div>
                    <BsTriangleFill
                      className={`${
                        attendance.earnedEntries > 0
                          ? "text-green-500"
                          : "text-red-500 rotate-180"
                      } inline mr-2 w-3 h-3`}
                    />
                    {attendance.earnedEntries} Entr
                    {attendance.earnedEntries != 1 ? "ies" : "y"}
                  </div>
                )}
              </span>
            </motion.div>
          </>
        ))}
      </div>
    </div>
  );
};
