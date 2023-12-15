"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FC } from "react";

export const Banner: FC = () => {
  return (
    <div className="relative w-full min-h-[570px] h-[90vh] rounded-xl -mt-20 mb-20">
      <div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center banner z-20">
        <motion.h1
          className="mt-6 text-white mx-auto inline-block rounded-full bg-black bg-opacity-50 p-5"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          BTHS Action
          <motion.div
            className="h-2 bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.h1>
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
