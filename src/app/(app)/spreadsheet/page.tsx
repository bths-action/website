import { FC } from "react";
import { LimitedContainer } from "@/components/ui/container";
import { Spreadsheet } from "@/components/spreadsheet";

export const metadata = {
  title: "Club Spreadsheet",
  description: "Credit Manager for BTHS Action. (EXEC ONLY)",
};

const Page: FC = () => {
  return (
    <main>
      <LimitedContainer>
        <Spreadsheet />
      </LimitedContainer>
    </main>
  );
};

export default Page;
