import { FC } from "react";
import { Params } from "../page";
import { AttendancePage } from "@/components/attendance/attendance-page";
import { LimitedContainer } from "@/components/ui/container";

export const dynamicParams = true;

export const metadata = {
  title: "Event Attendance",
  description: "Event attendance for BTHS Action. (EXEC ONLY)",
};

const Page: FC<Params> = ({ params: { id } }) => {
  return (
    <main>
      <LimitedContainer>
        <AttendancePage id={id} />
      </LimitedContainer>
    </main>
  );
};

export default Page;
