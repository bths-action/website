"use client";
import { FC, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const NotFoundWidget: FC = () => {
  const ref = useRef<HTMLAudioElement>(null);
  const [paused, setPaused] = useState(true);
  // use framer to generate something like a infinite scrolling ticker
  return (
    <div className="relative w-full flex justify-center my-40">
      <audio ref={ref} src="/sounds/rickroll.mp3" loop controls={false} />
      <button
        onClick={() => {
          ref.current?.play();
          setPaused(false);
        }}
      >
        <Image
          className="-z-50"
          src="/images/404.png"
          width={300}
          height={300}
          alt="Emma's Action Frog"
        />
      </button>

      {!paused && (
        <motion.h1
          className="absolute text-9xl text-center "
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
      )}
    </div>
  );
};
