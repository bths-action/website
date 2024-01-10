import { FC } from "react";
import { Params } from "../page";
import { AttendancePage } from "@/components/attendance/attendance-page";

export const dynamicParams = true;

export const metadata = {
  title: "Event Attendance",
  description: "Event attendance for BTHS Action. (EXEC ONLY)",
};

const Page: FC<Params> = ({ params: { id } }) => {
  return <AttendancePage id={id} />;
};

export default Page;
