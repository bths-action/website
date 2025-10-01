"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";
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

const Title: FC<PropsWithChildren> = ({ children }) => (
  <motion.h2
    className="mb-10"
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
    {children}
  </motion.h2>
);

const Description: FC<PropsWithChildren> = ({ children }) => (
  <motion.span
    variants={{
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
      },
    }}
  >
    {children}
  </motion.span>
);

const AboutGroup: FC<PropsWithChildren> = ({ children }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    className="relative min-h-[50dvh] flex justify-center items-center flex-col"
    viewport={{
      once: true,
      amount: 1,
    }}
  >
    {children}
  </motion.div>
);

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
  {
    name: "Metroquest",
    logo: "/logos/metroquest.jpg",
    url: "https://discord.gg/gyMcdvgFUN",
  },
].map((e) => (
  <Link
    href={e.url}
    target="_blank"
    className="w-48 h-48 mx-8 rounded-full hover:scale-110 transition-all duration-300"
    key={e.url}
  >
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
    <div className="text-lg my-4">
      <motion.h2
        initial={{
          opacity: 0,

          y: "-100%",
        }}
        whileInView={{
          opacity: 1,

          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.5,

          ease: "easeInOut",
        }}
        className="my-14"
      >
        ABOUT US:
      </motion.h2>
      <div className="text-center grid grid-cols-1 lg:grid-cols-2 items-stretch mb-40 gap-x-2 my-14">
        <AboutGroup>
          <Title>What is Action?</Title>

          <Description>
            Action is a volunteer club at Brooklyn Technical High School focused
            on making a positive difference in the community while creating a
            positive memories and friendships. We provide volunteer
            opportunities and events to our members so they can gain club
            credits and service hours while benefiting communities in need.
          </Description>
        </AboutGroup>

        <AboutGroup>
          <Title>Community</Title>
          <Description>
            Aside from providing volunteer opportunities, we aim to build a
            community were everyone feels welcome. We hope to create a
            environment for students to make friend and positive memories.
          </Description>
        </AboutGroup>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
        }}
      >
        <h2>
          {"We Have Worked With:".split(" ").map((e, i) => (
            <motion.span
              className="font-poppins pr-2"
              key={i}
              variants={{
                hidden: {
                  opacity: 0,
                  x: "200%",
                  scale: 0,
                },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                },
              }}
              transition={{
                duration: 1,
                delay: 0.5 + i * 0.3,
                type: "spring",
                bounce: 0.25,
              }}
            >
              {e}
            </motion.span>
          ))}
        </h2>
        <div className="relative flex overflow-x-hidden">
          <div className="py-12 animate-marquee whitespace-nowrap flex">
            {ORGANIZATIONS}
          </div>

          <div className="absolute top-0 py-12 animate-marquee2 whitespace-nowrap flex">
            {ORGANIZATIONS}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
