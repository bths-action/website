import { LimitedContainer } from "@/components/ui/container";
import { Bylaws } from "@/mdx/bylaws";
import { FC } from "react";

export const metadata = {
  title: "Bylaws",
  description: "Club Bylaws for BTHS Action",
};

const Page: FC = () => {
  return (
    <main>
      <LimitedContainer>
        <Bylaws />
      </LimitedContainer>
    </main>
  );
};

export default Page;
