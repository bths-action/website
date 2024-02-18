"use client";
import { FC, useState } from "react";
import { Props } from "./event-page";
import { useAccount } from "@/providers/account";
import { GetAttendanceOutput, trpc } from "@/app/api/trpc/client";
import { Loading } from "../ui/loading";
import { RequestError } from "../ui/error";
import { MdOutlineWarningAmber } from "react-icons/md";
import { ColorButton } from "../ui/buttons";
import { confirm } from "../ui/confirm";
import { BiLogIn } from "react-icons/bi";
import { signIn, useSession } from "next-auth/react";
import { FaUserMinus, FaUserPlus } from "react-icons/fa";
import { useChannel, useEvent, usePusher } from "@harelpls/use-pusher";
import { EventAttendance } from "@prisma/client";

export const UserAttendance: FC<Props> = ({ event }) => {
  const utils = trpc.useUtils();
  const account = useAccount();
  const { status } = useSession();
  const space = trpc.getEventSpace.useQuery({ id: event.id });
  function joinSpace() {
    if (space.status == "success" && space.data.limit) {
      utils.getEventSpace.setData(
        {
          id: event.id,
        },
        {
          ...space.data,
          attendees: space.data.attendees - 1,
        }
      );
    }
  }
  function leaveSpace() {
    if (space.status == "success" && space.data.limit) {
      utils.getEventSpace.setData(
        {
          id: event.id,
        },
        {
          ...space.data,
          attendees: space.data.attendees + 1,
        }
      );
    }
  }
  const attendance = trpc.getAttendance.useQuery({ id: event.id });
  const leaveEvent = trpc.leaveEvent.useMutation();
  const joinEvent = trpc.joinEvent.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pusher = usePusher();
  const channel = useChannel(`private-${event.id}`);

  const notAccepting =
    (event.finishTime ? event.finishTime : event.eventTime).valueOf() <
    Date.now();

  console.log(notAccepting, event.finishTime, event.eventTime);
  const wait = event.finishTime && event.eventTime.valueOf() > Date.now();

  useEvent(channel, "update", (data) => {
    if (attendance.status == "success" && attendance.data)
      utils.getAttendance.setData(
        {
          id: event.id,
        },
        {
          ...attendance.data,
          ...(data as GetAttendanceOutput),
        }
      );
  });

  useEvent(channel, "delete", (raw: any) => {
    const data: {
      email: string;
    } = raw;

    if (account.status == "success" && account.data?.email == data.email) {
      utils.getAttendance.setData(
        {
          id: event.id,
        },
        null
      );
    }
    leaveSpace();
  });

  useEvent(channel, "join", (raw) => {
    const data = raw as EventAttendance;
    if (account.status == "success" && account.data?.email == data.userEmail)
      utils.getAttendance.setData(
        {
          id: event.id,
        },
        data
      );

    joinSpace();
  });

  return (
    <>
      <h4>Event Attendance:</h4>
      {space.status === "loading" ||
      attendance.status === "loading" ||
      status === "loading" ||
      account.status === "loading" ? (
        <Loading
          loadingType="bar"
          spinnerProps={{
            width: "80%",
            height: "10px",
          }}
        >
          <h5>Loading Attendance...</h5>
        </Loading>
      ) : status == "unauthenticated" ||
        (account.status == "success" && account.data === null) ? (
        <>
          <h5>
            You must be logged in and registered to view and edit event
            attendance.
          </h5>
          <ColorButton
            color="default"
            className="rounded-xl shadowed"
            innerClass="p-2 text-xl text-white"
            onClick={() => signIn("auth0")}
          >
            <BiLogIn className="inline w-6 h-6 mr-1" />
            Sign In
          </ColorButton>
        </>
      ) : space.status === "error" || attendance.status === "error" ? (
        <>
          {space.error && <RequestError error={space.error} />}
          {attendance.error && <RequestError error={attendance.error} />}
        </>
      ) : attendance.data ? (
        <>
          <h5>
            <MdOutlineWarningAmber className="inline w-6 h-6 mr-1" /> You must
            check in and check out with an exec to get credit for the event.
          </h5>
          You have {!attendance.data.attendedAt && "not"} attended the event and
          earned {attendance.data.earnedHours} hours and{" "}
          {attendance.data.earnedPoints} points.
          <br />
          {!notAccepting && (
            <ColorButton
              innerClass="p-2 text-xl text-white"
              className="rounded-xl shadowed"
              color="default"
              disabled={isSubmitting}
              onClick={async () => {
                setIsSubmitting(true);
                const attendance = await leaveEvent.mutateAsync(
                  {
                    id: event.id,
                    socketId: pusher.client?.connection.socket_id,
                  },
                  {
                    onSuccess: () => {
                      utils.getAttendance.setData(
                        {
                          id: event.id,
                        },
                        null
                      );
                      leaveSpace();
                    },
                    onError: (error) => {
                      confirm({
                        title: "Error Leaving Event",
                        children: (
                          <>
                            We have encountered an error while leaving the
                            event.
                            <br />
                            <RequestError error={error} />
                          </>
                        ),
                      });
                    },
                  }
                );

                setIsSubmitting(false);
              }}
            >
              <FaUserMinus className="inline w-6 h-6 mr-1" /> Leav
              {isSubmitting ? "ing" : "e"} Event
            </ColorButton>
          )}
        </>
      ) : (
        <>
          <h5>
            <MdOutlineWarningAmber className="inline w-6 h-6 mr-1" /> To earn
            full credit, please read the instructions in the description.
          </h5>
          {space.data.limit && (
            <>
              Event Spots: {space.data.attendees}/{space.data.limit}
              <br />
            </>
          )}
          {wait ? (
            <>
              The event is not available for registration yet. Based on the
              description, you may be able to do other things.
            </>
          ) : notAccepting ? (
            <>You cannot change attendance after an event.</>
          ) : (
            <ColorButton
              innerClass="p-2 text-xl text-white"
              className="rounded-xl shadowed"
              color="default"
              disabled={isSubmitting}
              onClick={async () => {
                setIsSubmitting(true);

                joinEvent.mutate(
                  {
                    id: event.id,
                    socketId: pusher.client?.connection.socket_id,
                  },
                  {
                    onSuccess: (data) => {
                      utils.getAttendance.setData(
                        {
                          id: event.id,
                        },
                        data
                      );
                      joinSpace();
                      setIsSubmitting(false);
                    },
                    onError: (error) => {
                      setIsSubmitting(false);
                      confirm({
                        title: "Error Joining Event",
                        children: (
                          <>
                            We have encountered an error while joining the
                            event.
                            <br />
                            <RequestError error={error} />
                          </>
                        ),
                      });
                    },
                  }
                );
              }}
            >
              <FaUserPlus className="inline w-6 h-6 mr-1" /> Join
              {isSubmitting && "ing"} Event
            </ColorButton>
          )}
        </>
      )}
    </>
  );
};
