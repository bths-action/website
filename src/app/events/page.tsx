import { Events } from "@/components/events/events";
import { FC } from "react";

export const metadata = {
  title: "Events",
  description: "Check out some of BTHS Action's events!",
};

const EventsPage: FC = () => {
  return (
    <main>
      <h1>Events</h1>

      <Events />
    </main>
  );
};

export default EventsPage;
