"use client";
import { FC, useState } from "react";
import { Props } from "./event-page";
import { useAccount } from "@/providers/account";
import { trpc } from "@/app/api/trpc/client";
import { Loading } from "../ui/loading";
import { RequestError } from "../ui/error";
import { MdOutlineWarningAmber } from "react-icons/md";
import { ColorButton } from "../ui/buttons";
import { confirm } from "../ui/confirm";
import { BiLogOut } from "react-icons/bi";

export const UserAttendance: FC<Props> = ({ event }) => {
  const utils = trpc.useUtils();
  const account = useAccount();
  const space = trpc.getEventSpace.useQuery({ id: event.id });
  const attendance = trpc.getAttendance.useQuery({ id: event.id });
  const leaveEvent = trpc.leaveEvent.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <h3>Event Attendance:</h3>
      {space.status === "loading" || attendance.status === "loading" ? (
        <Loading
          loadingType="bar"
          spinnerProps={{
            width: "100%",
            height: "10px",
          }}
        >
          <h5>Loading Attendance...</h5>
        </Loading>
      ) : space.status === "error" || attendance.status === "error" ? (
        <>
          {space.error && <RequestError error={space.error} />}
          {attendance.error && <RequestError error={attendance.error} />}
        </>
      ) : attendance.data ? (
        <>
          <h5>
            <MdOutlineWarningAmber className="inline w-8 h-8" /> You must check
            in and check out with an exec to get credit for the event.
          </h5>
          You have {!attendance.data.attendedAt && "not"} attended the event and
          earned {attendance.data.earnedHours} hours and{" "}
          {attendance.data.earnedPoints} points.
          <ColorButton
            innerClass="p-2 text-xl"
            color="blue-500"
            disabled={isSubmitting}
            onClick={async () => {
              setIsSubmitting(true);
              const attendance = await leaveEvent.mutateAsync(
                { id: event.id },
                {
                  onSuccess: () => {
                    utils.getAttendance.setData(
                      {
                        id: event.id,
                      },
                      null
                    );
                  },
                  onError: (error) => {
                    confirm({
                      title: "Error Leaving Event",
                      children: (
                        <>
                          We have encountered an error while leaving the event.
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
            <BiLogOut className="inline w-8 h-8" /> Leav
            {isSubmitting ? "ing" : "e"} Event
          </ColorButton>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
