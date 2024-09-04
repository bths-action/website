"use client";
import { FC, PropsWithChildren } from "react";
import { IconType } from "react-icons";
import { motion } from "framer-motion";
import { BiCalendarAlt, BiTime, BiUser } from "react-icons/bi";
import { MAX_CREDITS } from "@/utils/constants";
import { BsAward } from "react-icons/bs";
import { FaTrophy } from "react-icons/fa";
import { MdOutlineMoneyOff } from "react-icons/md";

export const StatsCard: FC<
  PropsWithChildren<{
    icon: IconType;
    title: string;
    index: number;
  }>
> = ({ children, title, icon: Icon, index }) => {
  return (
    <motion.span
      variants={{
        hidden: {
          opacity: 0,
          y: 100,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay: index * 0.2 + 0.3,
          },
        },
      }}
    >
      <motion.div
        whileHover={{
          scale: 1.05,
          transition: {
            duration: 0.2,
          },
        }}
        className={
          "rounded-lg bg-zinc-50 dark:bg-zinc-900 overflow-hidden h-full shadowed"
        }
      >
        <div className="flex flex-row items-center justify-between p-4 h-full border-l-default dark:border-l-default border-l-8">
          <div className="text-lg font-bold text-left">
            {title} <div className="text-2xl">{children}</div>
          </div>
          <Icon className="w-12 h-12 ml-2" />
        </div>
      </motion.div>
    </motion.span>
  );
};

export const Stats: FC<{
  members: number;
  credits: number;
  serviceHours: number;
  events: number;
}> = ({ members, credits, serviceHours, events }) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-2"
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.5,
      }}
    >
      <StatsCard title="Club Members" icon={BiUser} index={1}>
        {members}
      </StatsCard>
      <StatsCard title="Events" icon={BiCalendarAlt} index={2}>
        {events}
      </StatsCard>
      <StatsCard title="Club Credits" icon={BsAward} index={3}>
        {credits}
      </StatsCard>
      <StatsCard title="Service Hours Contributed" icon={BiTime} index={4}>
        {serviceHours}
      </StatsCard>
    </motion.div>
  );
};
