"use client";
import { GetAttendeesOutput, TRPCError, trpc } from "@/app/api/trpc/client";
import { FC, useState } from "react";
import { motion } from "framer-motion";
import { AttendanceItem } from "./attendance-item";
import { ColorButton, TransparentButton } from "../ui/buttons";
import { confirm } from "../ui/confirm";
import { RequestError } from "../ui/error";
import { MdOutlinePeople } from "react-icons/md";
import { BsDatabaseDown } from "react-icons/bs";
import { Field, Form, Formik } from "formik";
import { z } from "zod";

export interface ListProps {
  attendance: GetAttendeesOutput;
  id: string;
}

export const AttendanceList: FC<ListProps> = ({ attendance, id }) => {
  const utils = trpc.useUtils();
  const forceAdd = trpc.forceJoinEvent.useMutation();
  const editAttendance = trpc.editAttendance.useMutation();

  const [batchEdit, setBatchEdit] = useState<number | null>(null);

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
      className="overflow-x-visible flex flex-col"
    >
      <div className="p-2 flex flex-wrap gap-3 justify-center">
        <ColorButton
          color="default"
          className="shadowed rounded-xl"
          innerClass="p-2 text-xl text-white"
          onClick={async () => {
            if (batchEdit !== null) return;
            let oldData = {
              ...attendance,
              attendees: attendance.attendees.map((attendee) => ({
                ...attendee,
              })),
            };
            for (const attendee of attendance.attendees) {
              setBatchEdit(attendance.attendees.indexOf(attendee) + 1);
              if (
                !attendee.attendedAt ||
                attendee.earnedHours !== 0 ||
                attendee.earnedPoints !== 0
              )
                continue;
              try {
                const data = await editAttendance.mutateAsync({
                  id,
                  user: attendee.userEmail,
                  earnedHours: attendance.maxHours,
                  earnedPoints: attendance.maxPoints,
                  earnedEntries: attendance.maxGiveawayEntries,
                });

                oldData = {
                  ...oldData,
                  attendees: oldData.attendees.map((attendee) =>
                    attendee.userEmail === data.userEmail
                      ? { ...attendee, ...data }
                      : attendee
                  ),
                };

                console.log(oldData);

                utils.getAttendees.setData(
                  {
                    id,
                  },
                  {
                    ...oldData,
                  }
                );
              } catch (error) {
                confirm({
                  title: `Failed to Edit ${attendee.userEmail} (${attendee.user.name})`,
                  children: <RequestError error={error as TRPCError} />,
                });
              }
            }
            setBatchEdit(null);
          }}
          disabled={batchEdit !== null}
        >
          <MdOutlinePeople className="w-6 h-6 mr-1" /> Batch
          {batchEdit !== null && "ing"} Points & Hours{" "}
          {batchEdit !== null &&
            `(${batchEdit}/${attendance.attendees.length})`}
        </ColorButton>
        <ColorButton
          color="default"
          className="shadowed rounded-xl"
          innerClass="p-2 text-xl text-white"
          onClick={async () => {
            if (
              !(await confirm({
                title: "Export Data",
                children: "Are you sure?",
              }))
            )
              return;
            let string = "";
            string += "Email,Name,Attended At,Earned Hours,Earned Points\n";
            for (const attendee of attendance.attendees) {
              string += `${attendee.userEmail},${attendee.user.name},${attendee.attendedAt},${attendee.earnedHours},${attendee.earnedPoints}\n`;
            }

            const blob = new Blob([string], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "attendance.csv";
            a.click();
          }}
        >
          <BsDatabaseDown className="w-6 h-6 mr-1" /> Export
        </ColorButton>
      </div>
      <div className="flex justify-center flex-wrap">
        <Formik
          initialValues={{
            email: "",
          }}
          validate={(data) => {
            try {
              if (z.string().email().min(1).parse(data.email)) return {};
            } catch (error) {
              return { email: "Invalid email" };
            }
          }}
          onSubmit={async (values) => {
            try {
              await forceAdd.mutateAsync(
                { id, user: values.email },
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
                  },
                  onError: (error) => {
                    if (error.data?.code === "NOT_FOUND")
                      confirm({
                        title: "User Not Found",
                        children:
                          "The user you are trying to add does not exist. Please make sure the email is correct.",
                      });
                    else
                      confirm({
                        title: "Error",
                        children: <RequestError error={error} />,
                      });
                  },
                }
              );
            } catch (error) {}
          }}
        >
          {({ isValid, isSubmitting }) => (
            <Form>
              <label htmlFor="email">Force Add: </label>
              <Field type="email" id="email" name="email" placeholder="Email" />
              <TransparentButton
                disabled={Boolean(!isValid || isSubmitting)}
                type="submit"
                className="px-2 bordered"
              >
                Force Add{isSubmitting && "ing"}
              </TransparentButton>
            </Form>
          )}
        </Formik>
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
