import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { GiveawayPreview } from ".";
import { FaTrophy } from "react-icons/fa6";
import { MdLeaderboard } from "react-icons/md";
import { GIVEAWAY_TYPE_MAP } from "@/utils/constants";

export const GiveawayCard: FC<{
  giveaway: GiveawayPreview;
  index: number;
}> = ({
  giveaway: { id, name, endsAt, maxWinners, type, imageURL },
  index,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -10,
      }}
    >
      <motion.div
        custom={index}
        variants={{
          visible: {
            x: 0,
            transition: {
              delay: index * 0.15,
            },
            opacity: 1,
          },
          hidden: { x: "100dvw", opacity: 0 },
        }}
        className="shadowed bordered h-full bg-zinc-100 dark:bg-zinc-900 bg-opacity-0 dark:bg-opacity-0 rounded-lg overflow-hidden hover:bg-opacity-100 hover:dark:bg-opacity-100 p-3 transition-opacity duration-200 ease-in-out "
      >
        <Link key={id} href={`/giveaways/${id}`} className="text-left">
          <div className="flex flex-col items-stretch w-full font-semibold flex-wrap h-full">
            {endsAt.getTime() < Date.now() ? (
              <div className="absolute bottom-0 right-0 bg-gray-500 text-white font-poppins uppercase py-0.5 px-2 rounded-tl-lg">
                Ended
              </div>
            ) : (
              <div className="absolute bottom-0 right-0 bg-green-500 text-white font-poppins uppercase py-0.5 px-2 rounded-tl-lg">
                Open
              </div>
            )}
            <div>
              <h5>{name}</h5>
              <span className="">
                Ends on{" "}
                {new Date(endsAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
              <br />

              <span className="text-yellow-600 dark:text-yellow-500 mr-2">
                <FaTrophy className="inline w" /> {maxWinners} Winner
                {maxWinners != 1 && "s"}
              </span>

              <span className="text-blue-500 mr-2">
                <MdLeaderboard className="inline" /> Order:{" "}
                {GIVEAWAY_TYPE_MAP[type]}
              </span>
            </div>

            {imageURL ? (
              <>
                <div className="relative mt-auto pt-2 -z-50">
                  <Image
                    src={imageURL}
                    alt=""
                    width={500}
                    height={500}
                    className="max-h-44 w-auto h-auto mx-auto rounded-lg"
                  />
                </div>
              </>
            ) : (
              <br className="h-8" />
            )}
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
};
