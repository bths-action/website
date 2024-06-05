"use client";
import { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsTriangleFill } from "react-icons/bs";

export const SummaryCard: FC<{ title: ReactNode; value: ReactNode }> = ({
  title,
  value,
}) => (
  <motion.div
    whileHover={{
      scale: 1.05,
    }}
    className="bg-gray-50 dark:bg-zinc-900 rounded-lg overflow-hidden h-full shadowed"
  >
    <div className="h-14 overflow-visible z-20 bg-default -mb-1 flex justify-center items-center text-white relative">
      <div className="font-bold">{title}</div>
    </div>
    <div className="p-4">
      <div className="font-bold text-center">{value}</div>
    </div>
  </motion.div>
);

export type EventSummaryProps = {
  name: string;
  points: number;
  hours: number;
  link?: string;
  index: number;
  date: Date | undefined;
};

export const EventSummary: FC<EventSummaryProps> = ({
  name,
  points,
  hours,
  link,
  index,
}) => (
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
        {link ? (
          <Link href={link} className="default">
            {name}
          </Link>
        ) : (
          name
        )}
      </span>
      <span className="text-right">
        {points == 0 && hours == 0 && <>---</>}
        {points != 0 && (
          <div>
            <BsTriangleFill
              className={`${
                points > 0 ? "text-green-500 " : "text-red-500 rotate-180"
              } inline mr-2 w-3 h-3`}
            />
            {points} Point
            {points != 1 && "s"}
          </div>
        )}

        {hours != 0 && (
          <div>
            <BsTriangleFill
              className={`${
                hours > 0 ? "text-green-500 " : "text-red-500 rotate-180"
              } inline mr-2 w-3 h-3`}
            />
            {hours} Hour
            {hours != 1 && "s"}
          </div>
        )}
      </span>
    </motion.div>
  </>
);
