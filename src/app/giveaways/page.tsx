import { LimitedContainer } from "@/components/ui/container";
import { FC } from "react";

export const metadata = {
  title: "Giveaways",
  description:
    "Check out some of BTHS Action's giveaways! Members can increase their chances of winning by participating in events.",
};

const EventsPage: FC = () => {
  return (
    <main>
      <LimitedContainer>
        <h1>Giveaways</h1>
      </LimitedContainer>
    </main>
  );
};

export default EventsPage;
