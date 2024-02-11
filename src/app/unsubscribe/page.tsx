import { FC } from "react";
import { LimitedContainer } from "@/components/ui/container";
import { Unsubscribe } from "@/components/unsubscribe";

export const metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from event alerts.",
};

const Page: FC = () => {
  return (
    <main>
      <h1>Unsubscribe</h1>
      <LimitedContainer>
        <Unsubscribe />
      </LimitedContainer>
    </main>
  );
};

export default Page;
