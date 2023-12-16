"use client";
import { FC } from "react";
import { motion } from "framer-motion";

export const NotFoundWidget: FC = () => {
  // use framer to generate something like a infinite scrolling ticker
  return (
    <div className="flex flex-col items-center w-full">
      <motion.h1
        className="text-9xl text-center my-40"
        animate={{
          originY: 1,
          // a set of rotate x and y and z that is random but repeats ideally 20 array size
          rotateX: [
            0,
            ...Array.from({ length: 30 }, () => Math.random() * 360),
            0,
          ],
          rotateY: [
            0,
            ...Array.from({ length: 30 }, () => Math.random() * 360),
            0,
          ],
          rotateZ: [
            0,
            ...Array.from({ length: 30 }, () => Math.random() * 360),
            0,
          ],
          x: [
            0,
            ...Array.from({ length: 30 }, () => Math.random() * 100 - 50),
            0,
          ],
          y: [
            0,
            ...Array.from({ length: 30 }, () => Math.random() * 100 - 50),
            0,
          ],
          scale: [
            1,
            ...Array.from({ length: 30 }, () => Math.random() + 0.5),
            1,
          ],
          color: [
            "#ff0000",
            ...Array.from(
              { length: 30 },
              () => "#" + Math.floor(Math.random() * 16777215).toString(16)
            ),
            "#ff0000",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        404
      </motion.h1>
    </div>
  );
};
