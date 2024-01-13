"use client";
import { Event } from "@prisma/client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { AdminActions } from "./admin-actions";
import { EventDetails, EventDescription } from "./event-details";
import { UserAttendance } from "./user-attendance";
import { LimitedContainer } from "../ui/container";

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
  return (
    <>
      <h1 className="break-all px-2">{event.name}</h1>
      <LimitedContainer>
        <AdminActions event={event} setEvent={setEvent} />
        <div className="w-full flex flex-wrap mt-5">
          <div className="w-full md:w-1/2 p-2">
            <EventDetails event={event} />
          </div>
          <div className="w-full md:w-1/2 p-2">
            <EventDescription event={event} />
            <UserAttendance event={event} />
          </div>
        </div>
      </LimitedContainer>
    </>
  );
};
