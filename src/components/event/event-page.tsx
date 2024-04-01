"use client";
import { Event } from "@prisma/client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { AdminActions } from "./admin-actions";
import { EventDetails, EventDescription } from "./event-details";
import { UserAttendance } from "./user-attendance";
import { LimitedContainer } from "../ui/container";
import { ColorButton, TransparentButton } from "../ui/buttons";
import { FaRegShareSquare } from "react-icons/fa";
import { confirm } from "../ui/confirm";

export interface Props {
  event: Event;
}

export interface PropsWrite extends Props {
  setEvent: Dispatch<SetStateAction<Event>>;
}

export const EventPage: FC<{
  event: Event;
}> = ({ event: defaultEvent }) => {
  const [event, setEvent] = useState<Event>(defaultEvent);
  const [copying, setCopying] = useState(false);
  return (
    <>
      <h1 className="break-all px-2">{event.name}</h1>
      <LimitedContainer>
        <div className="flex flex-wrap gap-3 justify-center">
          <ColorButton
            color="default"
            innerClass="text-white text-xl p-2"
            className="rounded-xl shadowed"
            onClick={() => {
              confirm({
                title: "Share Event",
                children: (
                  <>
                    Copy the image/share if your device supports. (Image may
                    take a bit to load)
                    <img
                      src={`/api/images/events/${event.id}/`}
                      className="max-h-[60dvh] mx-auto rounded-lg my-2"
                    />
                    <TransparentButton
                      onClick={async () => {
                        setCopying(true);
                        await navigator.clipboard
                          .writeText(
                            `https://bthsaction.org/events/${event.id}`
                          )
                          .catch(() => {
                            confirm({
                              title: "Error",
                              children:
                                "Error copying link to clipboard. Your browser may not support this.",
                            });
                          });
                        setCopying(false);
                      }}
                      className="rounded-full px-2 bordered"
                    >
                      Copy{copying && "ing"} Link
                    </TransparentButton>
                  </>
                ),
              });
            }}
          >
            <FaRegShareSquare className="inline mr-1 w-6 h-6" />
            Share Event
          </ColorButton>
          <AdminActions event={event} setEvent={setEvent} />
        </div>
        <div className="w-full grid grid-cols-1 gap-2 md:grid-cols-2 mt-5">
          <EventDetails event={event} />

          <div>
            <EventDescription event={event} />
            <UserAttendance event={event} />
          </div>
        </div>
      </LimitedContainer>
    </>
  );
};
