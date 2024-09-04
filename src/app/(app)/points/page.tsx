import { FC } from "react";
import { Metadata } from "next";
import { LimitedContainer } from "@/components/ui/container";
import { Points } from "@/components/points/";

export const metadata: Metadata = {
  title: "Points & Hours",
  description:
    "View your club activity, points, and hours! All calculated automatically, free of hassle.",
};

const Page: FC = () => {
  return (
    <main>
      <LimitedContainer>
        <h1>Breakdown: Points, Hours, Entries</h1>
        <Points />
      </LimitedContainer>
    </main>
  );
};

export default Page;
