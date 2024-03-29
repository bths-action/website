"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { IconType } from "react-icons";
import {
  BiLinkExternal,
  BiLogoTailwindCss,
  BiLogoTypescript,
} from "react-icons/bi";
import { FaCloudflare, FaReact } from "react-icons/fa";
import {
  SiAuth0,
  SiDiscord,
  SiFramer,
  SiNextdotjs,
  SiPusher,
  SiTrpc,
} from "react-icons/si";

const ORGANIZATIONS = [
  {
    name: "Repair the World",
    logo: "/logos/repair.svg",
    url: "https://werepair.org/",
  },
  {
    name: "Kings Bay Y",
    logo: "/logos/kingsbayy.svg",
    url: "https://kingsbayy.org/",
  },
  {
    name: "NYC H2O",
    logo: "/logos/nych2o.png",
    url: "https://www.nych2o.org/",
  },
  {
    name: "NYC Parks",
    logo: "/logos/nycparks.png",
    url: "https://www.nycgovparks.org/",
  },
  {
    name: "St. John's Bread and Life",
    logo: "/logos/sjbl.png",
    url: "https://www.breadandlife.org/",
  },
  {
    name: "9 Million Reasons",
    logo: "/logos/9mr.jpg",
    url: "https://9millionreasons.nyc/",
  },
].map((e) => (
  <Link href={e.url} target="_blank" className="w-48 h-48 mx-8 rounded-full">
    <div className="w-48 h-48 mb-4 relative rounded-full">
      <Image
        src={e.logo}
        alt=""
        className="rounded-full w-full bg-white"
        width={200}
        height={200}
      />
      <div className="absolute top-0 left-0 flex justify-center text-white items-center bg-black opacity-0 rounded-full z-30 w-48 h-48 hover:opacity-70 transition-all duration-700">
        <BiLinkExternal className="inline w-10 h-10" />
      </div>
    </div>
  </Link>
));

export const About: FC = () => {
  return (
    <div className="text-xl my-4">
      <h3 className="py-20">
        "Action speaks louder than words." - Emma Katz, 2024
      </h3>
      <h2>What We Are:</h2>
      <div className="text-center grid grid-cols-1 lg:grid-cols-2 items-stretch gap-y-40 mb-40 gap-x-2 lg:gap-y-36 my-14">
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 1,
          }}
        >
          <motion.h2
            variants={{
              hidden: {
                y: "-100%",
                opacity: 0,
              },
              visible: {
                y: 0,
                opacity: 1,
              },
            }}
          >
            Modern
          </motion.h2>
          <br />
          <br />
          <motion.span
            variants={{
              hidden: {
                rotate: 180,
                opacity: 0,
              },
              visible: {
                rotate: 0,
                opacity: 1,
              },
            }}
          >
            We use the latest technologies to make our club functions more
            efficent, and to make our members' lives easier.
          </motion.span>
        </motion.span>
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 1,
          }}
          className="flex w-full justify-center items-center gap-3 flex-wrap"
        >
          {[
            BiLogoTailwindCss,
            SiNextdotjs,
            BiLogoTypescript,
            FaReact,
            SiTrpc,
            FaCloudflare,
            SiAuth0,
            SiFramer,
            SiPusher,
            SiDiscord,
          ].map((Icon: IconType, i) => (
            <motion.span
              variants={{
                hidden: {
                  rotate: Math.pow(-1, i) * 360,
                  scale: 0,
                  opacity: 0,
                  x: "300%",
                },
                visible: {
                  rotate: 0,
                  scale: 1,
                  opacity: 1,
                  x: 0,
                },
              }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Icon
                key={i}
                style={{
                  transitionDelay: `${i * 75 + 300}ms`,
                  transitionDuration: "300ms",
                }}
                className="w-16 h-16"
              />
            </motion.span>
          ))}
        </motion.span>
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 1,
          }}
        >
          <motion.h2
            variants={{
              hidden: {
                y: "-100%",
                opacity: 0.5,
              },
              visible: {
                y: 0,
                opacity: 1,
              },
            }}
          >
            Non Pay to Win
          </motion.h2>
          <br />
          <br />
          <motion.span
            variants={{
              hidden: {
                rotate: 180,
                opacity: 0,
              },
              visible: {
                rotate: 0,
                opacity: 1,
              },
            }}
          >
            We strive to make our club as accessible as possible, and we do not
            engage in such usury. We are a club, not a business. We give away
            stuff instead.
          </motion.span>
        </motion.span>
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 1,
          }}
        >
          <motion.span
            variants={{
              hidden: {
                rotate: 180,
                opacity: 0,
                translateX: "100%",
              },
              visible: {
                rotate: 0,
                opacity: 1,
                translateX: 0,
              },
            }}
            className="flex justify-center items-center"
          >
            <Image
              src="/images/giveaway-1.png"
              alt=""
              width={400}
              height={400}
              className="rounded-xl border-2 shadowed "
            />
          </motion.span>
        </motion.span>
      </div>
      <h2>We Have Worked With:</h2>
      <div className="relative flex overflow-x-hidden">
        <div className="py-12 animate-marquee whitespace-nowrap flex">
          {ORGANIZATIONS}
        </div>

        <div className="absolute top-0 py-12 animate-marquee2 whitespace-nowrap flex">
          {ORGANIZATIONS}
        </div>
      </div>
    </div>
  );
};
