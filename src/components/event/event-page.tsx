"use client";
import { Event } from "@prisma/client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { LimitedContainer } from "../ui/container";
import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";
import { BsClock, BsAward } from "react-icons/bs";
import {
  FaRegEdit,
  FaRegEnvelope,
  FaRegTrashAlt,
  FaUserCheck,
} from "react-icons/fa";
import Image from "next/image";
import { MarkDownView } from "../ui/md-view";
import { useAccount } from "@/providers/account";
import { ColorButton } from "../ui/buttons";
import { EventForm } from "../form/event-form";
import { trpc } from "@/app/api/trpc/client";
import { useRouter } from "next/navigation";
import { confirm } from "../ui/confirm";
import { RequestError } from "../ui/error";

interface Props {
  event: Event;
}

interface PropsWrite extends Props {
  setEvent: Dispatch<SetStateAction<Event>>;
}

const AdminActions: FC<PropsWrite> = ({ event, setEvent }) => {
  const account = useAccount();
  const position = account.data?.position;
  if (!(position == "ADMIN" || position == "EXEC")) return null;
  const [formOpen, setFormOpen] = useState(false);
  const deleteEvent = trpc.deleteEvent.useMutation();
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {formOpen && (
        <EventForm
          setOpen={setFormOpen}
          mode="edit"
          event={event}
          setEvent={setEvent}
        />
      )}
      <ColorButton
        color="blue-500"
        innerClass="text-white text-xl p-2"
        className="rounded-xl"
        onClick={() => setFormOpen(true)}
      >
        <FaRegEdit className="inline mr-1 w-6 h-6" />
        Edit Event
      </ColorButton>
      <ColorButton color="blue-500" className="rounded-xl">
        <Link
          href={`/events/${event.id}/attendance`}
          className="text-white p-2 text-xl"
        >
          <FaUserCheck className="inline mr-1 w-6 h-6" />
          Event Attendance
        </Link>
      </ColorButton>
      <ColorButton
        color="red-500"
        innerClass="text-white text-xl p-2"
        className="rounded-xl"
        onClick={async () => {
          if (
            await confirm({
              title: "Event Deletion",
              children: "Are you sure you want to delete this event?",
            })
          ) {
            await deleteEvent.mutateAsync(
              {
                id: event.id,
              },
              {
                onSuccess: () => {
                  router.push("/events");
                },
                onError: (err) => {
                  confirm({
                    title: "Error",
                    children: <RequestError error={err} />,
                  });
                },
              }
            );
          }
        }}
      >
        <FaRegTrashAlt className="inline mr-1 w-6 h-6" />
        Delete Event
      </ColorButton>
    </div>
  );
};

const EventDetails: FC<Props> = ({ event }) => {
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
        <Link href={event.serviceLetters} target="_blank">
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
      <h3>
        Event Time:{" "}
        {event.eventTime.toLocaleString("en-US", {
          timeZone: "America/New_York",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </h3>
      <h3>
        Location:
        <br />
        <Link
          className="text-2xl default"
          href={encodeURI(
            `https://www.google.com/maps/dir/?api=1&destination=${event.address}&travelmode=transit`
          )}
          target="_blank"
        >
          {event.address} <BiLinkExternal className="inline" />
        </Link>
      </h3>
      <iframe
        src={encodeURI(
          `https://maps.google.com/maps?q=${event.address}&t=&z=13&ie=UTF8&iwloc=&output=embed`
        )}
        className="w-full border-none h-60 rounded-xl"
      ></iframe>
    </>
  );
};

const EventDescription: FC<Props> = ({ event }) => {
  return (
    <>
      <h3>Event Description: </h3>
      <div className="min-h-[200px] mx-2 bg-gray-500 bg-opacity-20 overflow-auto break-words p-2 rounded-md">
        <MarkDownView>{event.description}</MarkDownView>
      </div>
    </>
  );
};

export const EventPage: FC<{
  event: Event;
}> = ({ event: defaultEvent }) => {
  const [event, setEvent] = useState<Event>(defaultEvent);
  return (
    <LimitedContainer>
      <h1>{event.name}</h1>
      <AdminActions event={event} setEvent={setEvent} />
      <div className="w-full flex flex-wrap mt-5">
        <div className="w-full md:w-1/2 p-2">
          <EventDetails event={event} />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <EventDescription event={event} />
        </div>
      </div>
    </LimitedContainer>
  );
};
