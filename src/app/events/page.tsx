import { Events } from "@/components/events";
import { LimitedContainer } from "@/components/ui/container";
import { FC } from "react";

export const metadata = {
  title: "Events",
  description: "Check out some of BTHS Action's events!",
};

const EventsPage: FC = () => {
  return (
    <main>
      <LimitedContainer>
        <h1>Events</h1>
        <Events />
      </LimitedContainer>
    </main>
  );
};

export default EventsPage;
