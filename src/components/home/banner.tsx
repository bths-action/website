"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

export const Banner: FC = () => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 750);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="relative w-full min-h-[570px] h-[95dvh] rounded-xl mb-20">
      <div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center banner z-20">
        <motion.span
          className="inline-block bg-black bg-opacity-50 rounded-3xl p-6"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className={`text-white inline mb-2 underline-animation after:duration-500 after:h-3 ${
              animated ? "underline-animated" : ""
            }`}
          >
            BTHS Action
          </motion.h1>
        </motion.span>
      </div>

      <Image
        src="/images/banner.jpg"
        alt=""
        fill
        className="object-cover brightness-75"
      />
    </div>
  );
};
