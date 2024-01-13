"use client";
import { GetExecsOutput } from "@/app/api/trpc/client";
import { FC } from "react";
import { motion } from "framer-motion";
import { POSITIONS_MAP } from "@/utils/constants";
import Image from "next/image";
import { MarkDownView } from "../ui/md-view";
import { isAlumni } from "@/utils/helpers";
import { TransparentButton } from "../ui/buttons";
import { BiMailSend } from "react-icons/bi";

type Exec = GetExecsOutput[number];

export const ExecCard: FC<{
  exec: Exec;
  index: number;
}> = ({ exec, index }) => {
  const alumni = isAlumni(exec.user.gradYear);
  return (
    <motion.div
      animate={{
        y: 0,
      }}
      whileHover={{
        y: -10,
      }}
      className="h-full"
    >
      <motion.div
        className="bg-gray-400 bg-opacity-20 m-1 rounded-lg overflow-hidden h-full"
        initial={{
          opacity: 0,
          y: 100,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: "spring",
          delay: 0.2 * index,
          bounce: 0.5,
          duration: 0.6,
        }}
      >
        <div className="h-14 overflow-visible z-20 bg-default -mb-1 flex justify-center items-center text-black relative">
          {alumni ? (
            "Alumni Executive"
          ) : (
            <TransparentButton
              className="p-2 absolute top-1 right-1 rounded-full dark:text-black border-4 dark:border-black "
              onClick={() => {
                open(`mailto:${exec.email}`);
              }}
            >
              <BiMailSend className="inline w-8 h-8" />
            </TransparentButton>
          )}
        </div>
        <div
          className="flex flex-col flex-wrap py-1 relative justify-center items-center w-full"
          style={{
            background: "linear-gradient(0deg, #75757500 50%, #19b1a0 0%)",
          }}
        >
          <div className="rounded-full overflow-hidden relative w-[140px] h-[140px]">
            <Image
              src={
                exec.selfieURL ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png?20220226140232"
              }
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="m-2 pt-5">
          <h6>
            {exec.user.preferredName}{" "}
            {exec.user.name == exec.user.preferredName || (
              <>({exec.user.name})</>
            )}
          </h6>
          <p className="text-lg">{POSITIONS_MAP[exec.position]}</p>
          <p className="text-lg">
            Pronouns: {exec.user.pronouns.toLowerCase()} | Class of{" "}
            {exec.user.gradYear}
          </p>
          <div className="flex justify-center text-5xl">
            “{" "}
            <div className="transform origin-top scale-90 h-36 overflow-auto">
              <MarkDownView>{exec.description}</MarkDownView>
            </div>{" "}
            ”
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
