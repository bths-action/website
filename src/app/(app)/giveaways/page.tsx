import { Giveaways } from "@/components/giveaways";
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
        <h5>
          "We are a win to get paid club, not a pay to win club." - Club
          President, Justin Li, 2023
        </h5>
        <Giveaways />
      </LimitedContainer>
    </main>
  );
};

export default EventsPage;
