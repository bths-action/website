import { FC } from "react";
import { EventPreview } from ".";
import Link from "next/link";
import Image from "next/image";
import { BsClock, BsAward, BsTicketPerforated } from "react-icons/bs";
import { motion } from "framer-motion";

export const EventCard: FC<{
  event: EventPreview;
  index: number;
}> = ({
  event: {
    id,
    name,
    eventTime,
    finishTime,
    maxHours,
    maxPoints,
    imageURL,
    limit,
    attendees,
    closed,
    registerBefore,
  },
  index,
}) => {
  const eventStatus =
    (registerBefore ? eventTime : finishTime) < new Date()
      ? "occured"
      : limit && attendees >= limit
      ? "full"
      : closed
      ? "closed"
      : !registerBefore && eventTime.getTime() > Date.now()
      ? "upcoming"
      : "open";

  const sameDay = eventTime.toDateString() === finishTime.toDateString();
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
        className="shadowed bordered h-full bg-zinc-100/0 dark:bg-zinc-900/0 rounded-lg overflow-hidden hover:bg-zinc-900 hover:dark:bg-zinc-900 p-3 transition-opacity duration-200 ease-in-out "
      >
        <Link key={id} href={`/events/${id}`} className="text-left">
          <div className="flex flex-col items-stretch w-full font-semibold flex-wrap h-full">
            {eventStatus === "occured" ? (
              <div className="absolute bottom-0 right-0 bg-gray-500 text-white font-poppins uppercase py-0.5 px-2 rounded-tl-lg">
                Occured
              </div>
            ) : eventStatus === "full" ? (
              <div className="absolute bottom-0 right-0 bg-red-500 text-white font-poppins uppercase py-0.5 px-2 rounded-tl-lg">
                Full
              </div>
            ) : eventStatus === "closed" ? (
              <div className="absolute bottom-0 right-0 bg-red-500 text-white font-poppins uppercase py-0.5 px-2 rounded-tl-lg">
                Closed
              </div>
            ) : eventStatus === "upcoming" ? (
              <div className="absolute bottom-0 right-0 bg-yellow-500 text-white font-poppins uppercase py-0.5 px-2 rounded-tl-lg">
                Upcoming
              </div>
            ) : (
              <div className="absolute bottom-0 right-0 bg-green-500 text-white font-poppins uppercase py-0.5 px-2 rounded-tl-lg">
                Open
              </div>
            )}
            <div>
              <h5>{name}</h5>
              <span className="">
                {eventTime.toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}{" "}
                to{" "}
                {finishTime.toLocaleString([], {
                  ...(!sameDay && {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
              <br />
              {maxHours != 0 && (
                <span className="text-yellow-600 dark:text-yellow-500 mr-2">
                  <BsClock className="inline w" /> +{maxHours} Hour
                  {maxHours != 1 && "s"}
                </span>
              )}

              {maxPoints != 0 && (
                <span className="text-blue-500 mr-2">
                  <BsAward className="inline" /> +{maxPoints} Point
                  {maxPoints != 1 && "s"}
                </span>
              )}
            </div>

            {imageURL ? (
              <>
                <div className="relative mt-auto pt-2 -z-50">
                  <Image
                    src={imageURL}
                    alt=""
                    width={500}
                    height={200}
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
