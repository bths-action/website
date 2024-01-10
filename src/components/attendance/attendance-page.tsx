"use client";

import { FC, ReactNode } from "react";
import { LimitedContainer } from "../ui/container";
import { useSession } from "next-auth/react";
import { trpc } from "@/app/api/trpc/client";
import { Loading } from "../ui/loading";
import { useAccount } from "@/providers/account";
import { RequestError } from "../ui/error";

type Status = "loading" | "unauthorized" | "success" | "error";
type NodeMap = {
  [key in Status]: ReactNode;
};

export const AttendancePage: FC<{
  id: string;
}> = ({ id }) => {
  const { status } = useSession();
  const account = useAccount();
  const attendance = trpc.getAttendees.useQuery({
    id,
  });

  const fetchStatus: Status =
    attendance.status === "loading" ||
    account.status === "loading" ||
    status === "loading"
      ? "loading"
      : status == "unauthenticated" ||
        account.data == null ||
        account.data.position == "MEMBER"
      ? "unauthorized"
      : attendance.status === "success"
      ? "success"
      : "error";

  const heading: NodeMap = {
    loading: "Loading",
    unauthorized: "Unauthorized",
    success: attendance.data?.name,
    error: "Error",
  };

  const body: NodeMap = {
    loading: (
      <>
        <Loading
          loadingType="bar"
          spinnerProps={{
            width: "80%",
            height: "10px",
          }}
        >
          Loading Attendance List...
        </Loading>
      </>
    ),
    unauthorized: (
      <>
        <h5>You are unauthorized to view this page.</h5>
      </>
    ),
    success: <></>,
    error: (
      <>
        {attendance.status === "error" && (
          <RequestError error={attendance.error} />
        )}
        {account.status === "error" && <RequestError error={account.error} />}
      </>
    ),
  };

  return (
    <main>
      <LimitedContainer>
        <h1>Event Attendance - {heading[fetchStatus]}</h1>
        <div className="w-full">{body[fetchStatus]}</div>
      </LimitedContainer>
    </main>
  );
};
