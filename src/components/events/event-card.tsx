import { FC } from "react";
import { EventPreview } from ".";
import Link from "next/link";
import Image from "next/image";
import { BsClock, BsAward } from "react-icons/bs";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { BiAlarm } from "react-icons/bi";
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
  },
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
            y: 0,
            transition: {
              delay: index * 0.15,
            },
          },
          hidden: { y: "100%" },
        }}
        className="bordered h-full bg-zinc-100 dark:bg-zinc-900 bg-opacity-0 dark:bg-opacity-0 rounded-lg hover:bg-opacity-100 hover:dark:bg-opacity-100 p-3 transition-opacity duration-200 ease-in-out "
      >
        <Link key={id} href={`/events/${id}`} className="text-left ">
          <div className="flex flex-col items-stretch w-full font-semibold">
            <div>
              <h5>{name}</h5>
              <span className="">
                {(finishTime || eventTime).getTime() < Date.now()
                  ? "Occured"
                  : "Starts"}{" "}
                {finishTime ? "from" : "on"}{" "}
                {eventTime.toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
                {finishTime &&
                  " - " +
                    finishTime.toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
              </span>
              <br />
              {maxHours != 0 && (
                <span className="text-yellow-600 dark:text-yellow-500 mr-2">
                  <BsClock className="inline" /> +{maxHours} Hours
                </span>
              )}

              {maxPoints != 0 && (
                <span className="text-blue-500">
                  <BsAward className="inline" /> +{maxPoints} Points
                </span>
              )}
              <br />
              {(finishTime || eventTime).getTime() < Date.now() ||
              (limit && attendees >= limit) ? (
                <span className="dark:text-red-300 text-red-600  font-normal">
                  <FiXCircle className="inline" /> Event is no longer accepting
                  registration
                </span>
              ) : finishTime && eventTime.getTime() > Date.now() ? (
                <span className="dark:text-yellow-300 text-yellow-600  font-normal">
                  <BiAlarm className="inline" /> Event is not yet available for
                  registration.
                </span>
              ) : (
                <span className="dark:text-green-300 text-green-600 font-normal">
                  <FiCheckCircle className="inline" /> Event is available for
                  registration
                </span>
              )}
            </div>
            {imageURL && (
              <>
                <div className="relative mt-2 ">
                  <Image
                    src={imageURL}
                    alt=""
                    width={500}
                    height={500}
                    className="max-h-44 w-full object-contain rounded-lg"
                  />
                </div>
              </>
            )}
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
};
