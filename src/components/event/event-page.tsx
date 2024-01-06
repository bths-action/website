"use client";
import { Event } from "@prisma/client";
import { FC } from "react";
import { LimitedContainer } from "../ui/container";

export const EventPage: FC<{
  event: Event;
}> = ({ event }) => {
  console.log(event);
  return <LimitedContainer>{event.description}</LimitedContainer>;
};
