"use client";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { TransparentButton } from "./buttons";
import { Collapse } from "./collapse";
import { FaChevronUp } from "react-icons/fa";
import { DISCORD_INVITE_LINK } from "@/utils/constants";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const BannerAd: FC<PropsWithChildren> = ({ children }) => {
  return (
    <motion.div
      initial={{
        x: "100%",
      }}
      animate={{
        x: 0,
      }}
      exit={{
        x: "-100%",
      }}
      className="w-full h-16 flex items-center justify-center flex-wrap flex-col text-center overflow-ellipsis transform translate-x-full"
    >
      {children}
    </motion.div>
  );
};

const GiveawayAd: FC = () => {
  const [date, setDate] = useState<number | null>(null);

  const tick = () => {
    setDate(1709243999809 - Date.now());
  };

  useEffect(() => {
    const timerID = setTimeout(() => tick(), 1000);
    return () => {
      clearTimeout(timerID);
    };
  }, [date]);

  return (
    <BannerAd>
      <div className="text-[16px] md:text-sm ">
        🎉 Exclusive Discord Giveaway{" "}
        {date &&
          (date > 0 ? (
            <>
              ends in {Math.floor(date / 86400000)}d,{" "}
              {Math.floor((date % 86400000) / 3600000)}h,{" "}
              {Math.floor((date % 3600000) / 60000)}m,{" "}
              {Math.floor((date % 60000) / 1000)}s!
            </>
          ) : (
            <>has ended!</>
          ))}
        <TransparentButton className="mx-1 p-0 bordered">
          <Link
            href={DISCORD_INVITE_LINK}
            target="_blank"
            className="p-1 text-sm"
          >
            Join Discord Server
          </Link>
        </TransparentButton>
        <div className="md:block hidden">
          Gift cards, rare souvenirs, and more!
        </div>
      </div>
    </BannerAd>
  );
};

export const BannerAds: FC = () => {
  const ads = [
    <GiveawayAd key={0} />,
    <BannerAd key={1}>
      <div className="text-[14px] md:text-lg">
        📢 Want to be featured? Request an advertisement on{" "}
        <TransparentButton className="mx-1 p-0 bordered">
          <Link
            href={DISCORD_INVITE_LINK}
            target="_blank"
            className="p-1 text-[14px] md:text-lg"
          >
            our Discord
          </Link>
        </TransparentButton>
        !
      </div>
    </BannerAd>,
  ];

  const [collapsed, setCollapsed] = useState(false);

  const [adIndex, setAdIndex] = useState(0);

  const tick = () => {
    setAdIndex((adIndex + 1) % ads.length);
  };

  useEffect(() => {
    const timerID = setTimeout(() => tick(), 7500);
    return () => {
      clearTimeout(timerID);
    };
  }, [adIndex]);

  return (
    <div className="w-full relative overflow-visible">
      <Collapse collapsed={collapsed}>
        <div className="w-full h-16 dark:bg-zinc-900 dark:hover:bg-zinc-800 bg-slate-100 hover:bg-slate-200">
          <AnimatePresence>{ads[adIndex]}</AnimatePresence>
        </div>
      </Collapse>
      <div className="absolute bottom-[1px] mt-1 right-0 translate-y-full z-20 dark:bg-zinc-900 dark:hover:bg-zinc-800 bg-slate-100 hover:bg-slate-200 rounded-b-xl overflow-hidden">
        <TransparentButton
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-none p-2 px-3"
        >
          <FaChevronUp
            className={
              "transform transition-transform " +
              (collapsed ? "-rotate-180" : "")
            }
          />
        </TransparentButton>
      </div>
    </div>
  );
  // club and non-club advertisements gonna go here
};
