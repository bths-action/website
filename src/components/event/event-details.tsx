"use client";
import Link from "next/link";
import { Props } from "./event-page";
import { FC } from "react";
import { BiLinkExternal } from "react-icons/bi";
import { BsClock, BsAward, BsTicketPerforated } from "react-icons/bs";
import { FaRegEnvelope } from "react-icons/fa";
import { MarkDownView } from "../ui/md-view";
import Image from "next/image";

export const EventDetails: FC<Props> = ({ event }) => {
  const sameDay =
    event.eventTime.toDateString() === event.finishTime.toDateString();
  return (
    <div>
      {event.imageURL && (
        <div className="relative mt-auto pb-2">
          <Image
            src={event.imageURL}
            alt=""
            width={500}
            height={500}
            className="max-h-64 shadowed w-auto h-auto mx-auto rounded-lg"
          />
        </div>
      )}
      <h4>Service Letters:</h4>
      {event.serviceLetters ? (
        <Link href={event.serviceLetters} target="_blank" className="default">
          <FaRegEnvelope className="inline" /> Service Letters
        </Link>
      ) : (
        "Service letters are not available for this event."
      )}
      <h4>Rewards: </h4>
      {event.maxHours != 0 && (
        <div className="text-yellow-600 dark:text-yellow-500">
          <BsClock className="inline" /> Total Hours : {event.maxHours}
        </div>
      )}
      {event.maxPoints != 0 && (
        <div className="text-blue-500">
          <BsAward className="inline" /> Total Points : {event.maxPoints}
        </div>
      )}
      <h4>Event Time:</h4>
      {event.eventTime.toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}{" "}
      to{" "}
      {event.finishTime.toLocaleString([], {
        ...(!sameDay && {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        hour: "numeric",
        minute: "2-digit",
      })}
      <h4>Location:</h4>
      <Link
        className="default"
        href={encodeURI(
          `https://www.google.com/maps/dir/?api=1&destination=${event.address}&travelmode=transit`
        )}
        target="_blank"
      >
        {event.address} <BiLinkExternal className="inline" />
      </Link>
      <iframe
        src={encodeURI(
          `https://maps.google.com/maps?q=${event.address}&t=&z=13&ie=UTF8&iwloc=&output=embed`
        )}
        className="w-full h-60 rounded-xl shadowed"
      ></iframe>
    </div>
  );
};

export const EventDescription: FC<Props> = ({ event }) => {
  return (
    <>
      <h4>Event Details: </h4>
      <div className="min-h-[200px] max-h-[400px] m-2 bordered bg-gray-100 dark:bg-zinc-900 shadowed overflow-auto break-words p-2 rounded-md">
        <MarkDownView>{event.description}</MarkDownView>
      </div>
    </>
  );
};
