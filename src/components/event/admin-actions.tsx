"use client";
import { trpc } from "@/app/api/trpc/client";
import { useAccount } from "@/providers/account";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { FaRegEdit, FaUserCheck, FaRegTrashAlt } from "react-icons/fa";
import { EventForm } from "../form/event-form";
import { ColorButton } from "../ui/buttons";
import { RequestError } from "../ui/error";
import { confirm } from "../ui/confirm";
import { PropsWrite } from "./event-page";

export const AdminActions: FC<PropsWrite> = ({ event, setEvent }) => {
  const account = useAccount();
  const position = account.data?.position;
  if (!(position == "ADMIN" || position == "EXEC")) return null;
  const [formOpen, setFormOpen] = useState(false);
  const deleteEvent = trpc.deleteEvent.useMutation();
  const router = useRouter();

  return (
    <>
      {formOpen && (
        <EventForm
          setOpen={setFormOpen}
          mode="edit"
          event={event}
          setEvent={setEvent}
        />
      )}
      <ColorButton
        color="default"
        innerClass="text-white text-xl p-2 "
        className="rounded-xl shadowed"
        onClick={() => setFormOpen(true)}
      >
        <FaRegEdit className="inline mr-1 w-6 h-6" />
        Edit Event
      </ColorButton>
      <ColorButton color="default" className="rounded-xl shadowed">
        <Link
          href={`/events/${event.id}/attendance`}
          className="text-white p-2 text-xl"
        >
          <FaUserCheck className="inline mr-1 w-6 h-6" />
          Event Attendance
        </Link>
      </ColorButton>
      <ColorButton
        color="red-500"
        innerClass="text-white text-xl p-2"
        className="rounded-xl shadowed"
        onClick={async () => {
          if (
            await confirm({
              title: "Event Deletion",
              children: "Are you sure you want to delete this event?",
            })
          ) {
            await deleteEvent.mutateAsync(
              {
                id: event.id,
              },
              {
                onSuccess: () => {
                  router.push("/events");
                },
                onError: (err) => {
                  confirm({
                    title: "Error Deleting Event",
                    children: <RequestError error={err} />,
                  });
                },
              }
            );
          }
        }}
      >
        <FaRegTrashAlt className="inline mr-1 w-6 h-6" />
        Delete Event
      </ColorButton>
    </>
  );
};
