"use client";
import { GetAttendeesOutput, trpc } from "@/app/api/trpc/client";
import { FC, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AttendanceItem } from "./attendance-item";
import { TransparentButton } from "../ui/buttons";
import { confirm } from "../ui/confirm";
import { RequestError } from "../ui/error";

export interface ListProps {
  attendance: GetAttendeesOutput;
  id: string;
}

export const AttendanceList: FC<ListProps> = ({ attendance, id }) => {
  const utils = trpc.useUtils();
  const forceAdd = trpc.forceJoinEvent.useMutation();
  const ref = useRef<HTMLInputElement>(null);

  const [forceAdding, setForceAdding] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
      initial="hidden"
      animate="show"
      className="overflow-x-hidden flex flex-col"
    >
      <div className="flex justify-center flex-wrap">
        <label htmlFor="email">Force Add: </label>
        <input
          ref={ref}
          type="email"
          id="email"
          name="email"
          placeholder="Email"
        />
        <TransparentButton
          className="px-2 bordered"
          onClick={async () => {
            if (!ref.current?.value) return;
            setForceAdding(true);
            await forceAdd.mutateAsync(
              { id, user: ref.current.value },
              {
                onSuccess: (data) => {
                  utils.getAttendees.setData(
                    {
                      id,
                    },
                    {
                      ...attendance,
                      attendees: [...attendance.attendees, data],
                    }
                  );

                  ref.current!.value = "";
                },
                onError: (error) => {
                  confirm({
                    title: "Error",
                    children: <RequestError error={error} />,
                  });
                },
              }
            );
            setForceAdding(false);
          }}
        >
          Force Add{forceAdding && "ing"}
        </TransparentButton>
      </div>
      {attendance.attendees.map((attendee) => (
        <AttendanceItem
          attendance={attendance}
          id={id}
          attendee={attendee}
          key={attendee.userEmail}
        />
      ))}
    </motion.div>
  );
};
