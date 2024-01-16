"use client";

import { FC } from "react";
import { useSession } from "next-auth/react";
import {
  EditAttendanceOutput,
  JoinEventOutput,
  trpc,
} from "@/app/api/trpc/client";
import { Loading } from "../ui/loading";
import { useAccount } from "@/providers/account";
import { RequestError } from "../ui/error";
import { AttendanceList } from "./attendance-list";
import { useChannel, useEvent } from "@harelpls/use-pusher";
import { NodeMap, Status } from "@/utils/constants";

export const AttendancePage: FC<{
  id: string;
}> = ({ id }) => {
  const utils = trpc.useUtils();
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

  const heading: NodeMap<Status> = {
    loading: "Loading",
    unauthorized: "Unauthorized",
    success: attendance.data?.name,
    error: "Error",
  };

  const channel = useChannel(`private-${id}`);
  useEvent(channel, "update", (rawData: any) => {
    if (attendance.status !== "success") return;
    const data: EditAttendanceOutput = rawData;
    data.registeredAt = data.registeredAt && new Date(data.registeredAt);
    data.attendedAt = data.attendedAt && new Date(data.attendedAt);
    utils.getAttendees.setData(
      {
        id,
      },
      {
        ...attendance.data,
        attendees: attendance.data.attendees.map((attendee) => {
          if (attendee.userEmail == data.userEmail) {
            return {
              ...attendee,
              ...data,
            };
          }
          return attendee;
        }),
      }
    );
  });

  useEvent(channel, "delete", (raw: any) => {
    if (attendance.status !== "success") return;
    const data: {
      email: string;
    } = raw;
    utils.getAttendees.setData(
      {
        id,
      },
      {
        ...attendance.data,
        attendees: attendance.data.attendees.filter(
          (attendee) => attendee.userEmail != data.email
        ),
      }
    );
  });

  useEvent(channel, "join", (raw: any) => {
    if (attendance.status !== "success") return;
    const data: JoinEventOutput = raw;
    data.registeredAt = data.registeredAt && new Date(data.registeredAt);
    data.attendedAt = data.attendedAt && new Date(data.attendedAt);
    utils.getAttendees.setData(
      {
        id,
      },
      {
        ...attendance.data,
        attendees: [...attendance.data.attendees, data],
      }
    );
  });

  const body: NodeMap<Status> = {
    loading: (
      <>
        <Loading
          loadingType="bar"
          spinnerProps={{
            height: 10,
            width: 800,
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
    success: (
      <>
        {attendance.data && fetchStatus == "success" && (
          <AttendanceList attendance={attendance.data} id={id} />
        )}
      </>
    ),
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
    <>
      <h1>Event Attendance - {heading[fetchStatus]}</h1>
      <div className="w-full">{body[fetchStatus]}</div>
    </>
  );
};
