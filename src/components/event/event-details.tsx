"use client";
import Link from "next/link";
import { Props } from "./event-page";
import { FC } from "react";
import { BiLinkExternal } from "react-icons/bi";
import { BsClock, BsAward } from "react-icons/bs";
import { FaRegEnvelope } from "react-icons/fa";
import { MarkDownView } from "../ui/md-view";
import Image from "next/image";

export const EventDetails: FC<Props> = ({ event }) => {
  return (
    <>
      {event.imageURL && (
        <Image
          src={event.imageURL}
          alt={event.name}
          width={1000}
          height={1000}
          className="w-full rounded-lg mb-5"
        />
      )}
      <h3>Service Letters:</h3>
      {event.serviceLetters ? (
        <Link href={event.serviceLetters} target="_blank" className="default">
          <FaRegEnvelope className="inline" /> Service Letters
        </Link>
      ) : (
        "Service letters are not available for this event."
      )}
      <h3>Rewards: </h3>
      <BsClock className="inline" /> Total Hours : {event.maxHours}
      <br />
      <BsAward className="inline" /> Total Points : {event.maxPoints}
      <br />
      <h3>Event Time:</h3>
      {event.eventTime.toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}
      <h3>Location:</h3>
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
        className="w-full border-none h-60 rounded-xl"
      ></iframe>
    </>
  );
};

export const EventDescription: FC<Props> = ({ event }) => {
  return (
    <>
      <h3>Event Description: </h3>
      <div className="min-h-[200px] m-2 bg-gray-500 bg-opacity-20 overflow-auto break-words p-2 rounded-md">
        <MarkDownView>{event.description}</MarkDownView>
      </div>
    </>
  );
};
