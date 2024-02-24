"use client";
import { useInView } from "framer-motion";
import Image from "next/image";
import { FC, useRef } from "react";
import { IconType } from "react-icons";
import { BiLogoTailwindCss, BiLogoTypescript } from "react-icons/bi";
import { FaCloudflare, FaReact } from "react-icons/fa";
import {
  SiAuth0,
  SiDiscord,
  SiFramer,
  SiNextdotjs,
  SiPusher,
  SiTrpc,
} from "react-icons/si";

export const About: FC = () => {
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const isInViewRaw = [
    useInView(refs[0], {
      amount: 0.5,
    }),
    useInView(refs[1], { amount: 0.5 }),
    useInView(refs[2], { amount: 0.5 }),
    useInView(refs[3], { amount: 0.5 }),
  ];
  const isInViews = [
    isInViewRaw[0],
    isInViewRaw[1],
    isInViewRaw[2],
    isInViewRaw[3],
  ];

  return (
    <div className="text-xl my-4">
      <div className="text-center grid grid-cols-1 lg:grid-cols-2 items-stretch gap-y-12 gap-x-2 lg:gap-y-36 my-14">
        <span ref={refs[0]}>
          <h3
            className={`underline-animation transition-all delay-300  ${
              isInViews[0] ? "underline-animated opacity-100" : "opacity-30"
            }`}
          >
            Modern
          </h3>
          <br />
          <br />
          <span
            className={`transition-all duration-300 delay-300 ${
              isInViews[0]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            }`}
          >
            We use the latest technologies to make our club functions more
            efficent, and to make our members' lives easier.
          </span>
        </span>
        <span
          ref={refs[1]}
          className="flex w-full justify-center items-center gap-3 flex-wrap"
        >
          <span></span>
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
            <Icon
              key={i}
              style={{
                transitionDelay: `${i * 75 + 300}ms`,
                transitionDuration: "300ms",
              }}
              className={`w-16 h-16 transition-all delay-300 duration-300 ${
                isInViews[1] ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </span>
        <span ref={refs[2]}>
          <h3
            className={`underline-animation transition-all delay-300  ${
              isInViews[2] ? "underline-animated opacity-100" : "opacity-30"
            }`}
          >
            Non Pay to Win
          </h3>
          <br />
          <br />
          <span
            className={`transition-all duration-300 delay-300 ${
              isInViews[2]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            }`}
          >
            We strive to make our club as accessible as possible, and we do not
            engage in such usury. We are a club, not a business. We give away
            stuff instead.
          </span>
        </span>
        <span
          ref={refs[3]}
          className="flex delay-300 justify-center items-center"
        >
          <Image
            src="/images/giveaway-1.png"
            alt=""
            width={400}
            height={400}
            className={`rounded-xl border-2 delay-300 transition-all duration-300 shadowed ${
              isInViews[3]
                ? "opacity-100 rotate-0 translate-x-0"
                : "opacity-0 rotate-12 translate-x-full"
            }`}
          />
        </span>
      </div>

      <div></div>
      <div></div>
    </div>
  );
};
