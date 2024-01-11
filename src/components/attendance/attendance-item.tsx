"use client";
import { ColorButton } from "../ui/buttons";
import { FaUserCheck, FaUserSlash } from "react-icons/fa";
import { confirm } from "../ui/confirm";
import { RequestError } from "../ui/error";
import { GetAttendeesOutput, trpc } from "@/app/api/trpc/client";
import { motion } from "framer-motion";
import { FC, useEffect, useRef, useState } from "react";
import { ListProps } from "./attendance-list";
import { usePusher } from "@harelpls/use-pusher";

interface ItemProps extends ListProps {
  attendee: GetAttendeesOutput["attendees"][number];
}

export const AttendanceItem: FC<ItemProps> = ({ attendee, attendance, id }) => {
  const utils = trpc.useUtils();
  const pusher = usePusher();
  const socketId = pusher.client?.connection?.socket_id;
  const [checking, setChecking] = useState(false);
  const editAttendance = trpc.editAttendance.useMutation();
  const Icon = attendee.attendedAt ? FaUserSlash : FaUserCheck;
  const pointsRef = useRef<HTMLInputElement>(null);
  const hoursRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (pointsRef.current && hoursRef.current) {
      pointsRef.current.valueAsNumber = attendee.earnedPoints;
      hoursRef.current.valueAsNumber = attendee.earnedHours;
    }
  }, [attendee]);
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: "100%" },
        show: { opacity: 1, x: "0" },
      }}
      className="p-2 bg-slate-200 m-2 dark:bg-zinc-800 rounded-lg"
    >
      {attendee.user.preferredName} ({attendee.user.name}) -{" "}
      {attendee.userEmail}
      <br />
      {attendee.attendedAt && (
        <div className="my-2">
          <label htmlFor="hours">Hours: </label>
          <input
            ref={hoursRef}
            type="number"
            name="hours"
            id="hours"
            className="bg-slate-100 dark:bg-zinc-900"
            onBlur={async (e) => {
              const value = e.target.valueAsNumber || 0;

              await editAttendance.mutateAsync(
                {
                  id,
                  user: attendee.userEmail,
                  earnedHours: value,
                  socketId,
                },
                {
                  onSuccess: (data) => {
                    const attendees = attendance.attendees.map(
                      (attendee, index) => {
                        if (attendee.userEmail === data.userEmail)
                          return {
                            user: attendance.attendees[index].user,
                            ...data,
                          };

                        return attendee;
                      }
                    );
                    utils.getAttendees.setData(
                      {
                        id,
                      },
                      {
                        ...attendance,
                        attendees,
                      }
                    );
                  },
                  onError: (error) => {
                    hoursRef.current!.valueAsNumber = attendee.earnedHours;
                    confirm({
                      title: "Error",
                      children: <RequestError error={error} />,
                    });
                  },
                }
              );
            }}
          />

          <label htmlFor="points">Points: </label>
          <input
            ref={pointsRef}
            type="number"
            name="points"
            id="points"
            className="bg-slate-100 dark:bg-zinc-900"
            onBlur={async (e) => {
              const value = e.target.valueAsNumber || 0;

              await editAttendance.mutateAsync(
                {
                  id,
                  user: attendee.userEmail,
                  earnedPoints: value,
                  socketId,
                },
                {
                  onSuccess: (data) => {
                    const attendees = attendance.attendees.map(
                      (attendee, index) => {
                        if (attendee.userEmail === data.userEmail)
                          return {
                            user: attendance.attendees[index].user,
                            ...data,
                          };

                        return attendee;
                      }
                    );
                    utils.getAttendees.setData(
                      {
                        id,
                      },
                      {
                        ...attendance,
                        attendees,
                      }
                    );
                  },
                  onError: (error) => {
                    pointsRef.current!.valueAsNumber = attendee.earnedPoints;
                    confirm({
                      title: "Error",
                      children: <RequestError error={error} />,
                    });
                  },
                }
              );
            }}
          />
        </div>
      )}
      {attendee.attendedAt && (
        <span className="mr-2">
          Marked present at{" "}
          {new Date(attendee.attendedAt).toLocaleString([], {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      )}
      <ColorButton
        innerClass={`p-2 text-white ${
          attendee.attendedAt
            ? "bg-red-500 dark:bg-red-500"
            : "bg-green-500 dark:bg-green-500"
        }`}
        color="none"
        onClick={async () => {
          setChecking(true);
          await editAttendance.mutateAsync(
            {
              id,
              user: attendee.userEmail,
              attendedAt: attendee.attendedAt ? null : new Date(),
              ...(attendee.attendedAt
                ? {
                    earnedHours: 0,
                    earnedPoints: 0,
                  }
                : {}),
              socketId,
            },
            {
              onSuccess: (data) => {
                const attendees = attendance.attendees.map(
                  (attendee, index) => {
                    if (attendee.userEmail === data.userEmail)
                      return {
                        user: attendance.attendees[index].user,
                        ...data,
                      };

                    return attendee;
                  }
                );
                utils.getAttendees.setData(
                  {
                    id,
                  },
                  {
                    ...attendance,
                    attendees,
                  }
                );
              },
              onError: (error) => {
                confirm({
                  title: "Error",
                  children: <RequestError error={error} />,
                });
              },
            }
          );
          setChecking(false);
        }}
      >
        <Icon className="mr-1" /> {attendee.attendedAt ? "Remov" : "Check"}
        {checking ? "ing" : attendee.attendedAt ? "e" : ""}{" "}
        {attendee.attendedAt && "Check"} In
      </ColorButton>
    </motion.div>
  );
};