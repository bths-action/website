import { LimitedContainer } from "@/components/ui/container";
import { FAQ } from "@/mdx/faq";
import { FC } from "react";

export const metadata = {
  title: "FAQ",
  description: "FAQ for BTHS Action",
};

const Page: FC = () => {
  return (
    <main>
      <LimitedContainer>
        <FAQ />
      </LimitedContainer>
    </main>
  );
};

export default Page;
