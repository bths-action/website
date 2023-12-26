import { FC } from "react";
import { EventPreview } from "./events";
import Link from "next/link";
import Image from "next/image";
import { BsClock, BsAward } from "react-icons/bs";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { BiAlarm } from "react-icons/bi";

export const EventCard: FC<{
  event: EventPreview;
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
}) => {
  return (
    // transition background only
    <div className="w-full bg-gray-500 dark:bg-zinc-900 bg-opacity-10 rounded-lg hover:opacity-80 dark:hover:opacity-60 p-3 transition-opacity duration-200 ease-in-out ">
      <Link key={id} href={`/events/${id}`} className="text-left ">
        <div className="flex flex-col items-stretch w-full md:flex-row">
          <div className={`w-full ${imageURL ? "md:w-1/2" : ""}`}>
            <h3>{name}</h3>
            {(finishTime || eventTime).getTime() < Date.now()
              ? "Occured"
              : "Starts"}{" "}
            {finishTime ? "from" : "on"}{" "}
            {eventTime.toLocaleString([], {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
            {finishTime &&
              " to " +
                finishTime.toLocaleString([], {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
            <br />
            <BsClock className="inline" /> Total Hours : {maxHours}
            <br />
            <BsAward className="inline" /> Total Points : {maxPoints}
            <br />
            {(finishTime || eventTime).getTime() < Date.now() ||
            (limit && attendees >= limit) ? (
              <span className="dark:text-red-300 text-red-600">
                <FiXCircle className="inline" /> Event is no longer accepting
                registration
              </span>
            ) : finishTime && eventTime.getTime() > Date.now() ? (
              <span className="dark:text-yellow-300 text-yellow-600">
                <BiAlarm className="inline" /> Event is not yet available for
                registration.
              </span>
            ) : (
              <span className="dark:text-green-300 text-green-600">
                <FiCheckCircle className="inline" /> Event is available for
                registration
              </span>
            )}
          </div>
          {imageURL && (
            <>
              <div className="hidden relative w-1/2 md:block">
                <Image
                  src={imageURL}
                  fill
                  alt=""
                  className="object-contain pl-2"
                />
              </div>
              <div className="relative mt-2 w-full md:hidden">
                <Image
                  src={imageURL}
                  alt=""
                  width={1000}
                  height={1000}
                  className=""
                />
              </div>
            </>
          )}
        </div>
      </Link>
    </div>
  );
};
