"use client";
import { trpc } from "@/app/(api)/api/trpc/client";
import { useAccount } from "@/providers/account";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { FaRegEdit, FaRegTrashAlt, FaTrophy } from "react-icons/fa";
import { ColorButton } from "../ui/buttons";
import { RequestError } from "../ui/error";
import { confirm } from "../ui/confirm";
import { PropsWrite } from "./giveaway-page";
import { GiveawayForm } from "../form/giveaway-form";

export const AdminActions: FC<PropsWrite> = ({ giveaway, setGiveaway }) => {
  const account = useAccount();
  const position = account.data?.position;
  if (!(position == "ADMIN" || position == "EXEC")) return null;
  const [formOpen, setFormOpen] = useState(false);
  const deleteGiveaway = trpc.deleteGiveaway.useMutation();
  const endGiveaway = trpc.endGiveaway.useMutation();
  const router = useRouter();
  const [deletingGiveaway, setDeletingGiveaway] = useState(false);
  const [endingGiveaway, setEndingGiveaway] = useState(false);

  return (
    <>
      {!giveaway.ended && (
        <>
          {formOpen && (
            <GiveawayForm
              setOpen={setFormOpen}
              mode="edit"
              giveaway={giveaway}
              setGiveaway={setGiveaway}
            />
          )}
          <ColorButton
            color="default"
            innerClass="text-white text-xl p-2 "
            className="rounded-xl shadowed"
            onClick={() => setFormOpen(true)}
          >
            <FaRegEdit className="inline mr-1 w-6 h-6" />
            Edit Giveaway
          </ColorButton>
        </>
      )}
      <ColorButton
        color="red-500"
        innerClass="text-white text-xl p-2"
        className="rounded-xl shadowed"
        disabled={deletingGiveaway}
        onClick={async () => {
          if (
            await confirm({
              title: "Giveaway Deletion",
              children:
                "Are you sure you want to delete this giveaway? This is to delete the giveaway, not end it.",
            })
          ) {
            setDeletingGiveaway(true);
            await deleteGiveaway.mutateAsync(
              {
                id: giveaway.id,
              },
              {
                onSuccess: () => {
                  router.push("/giveaways");
                },
                onError: (err) => {
                  confirm({
                    title: "Error Deleting Giveaway",
                    children: <RequestError error={err} />,
                  });
                },
                onSettled: () => {
                  setDeletingGiveaway(false);
                },
              }
            );
          }
        }}
      >
        <FaRegTrashAlt className="inline mr-1 w-6 h-6" />
        Delet{deletingGiveaway ? "ing" : "e"} Giveaway
      </ColorButton>
      {!giveaway.ended && (
        <ColorButton
          color="red-500"
          innerClass="text-white text-xl p-2"
          className="rounded-xl shadowed"
          onClick={async () => {
            if (
              await confirm({
                title: "Giveaway End",
                children:
                  "Are you sure you want to end this giveaway? This cannot be undone.",
              })
            ) {
              // end giveaway fetch request
              setEndingGiveaway(true);

              await endGiveaway.mutateAsync(
                {
                  id: giveaway.id,
                },
                {
                  onSuccess: (data) => {
                    setGiveaway({
                      ...giveaway,
                      ended: true,
                      endsAt: data.endsAt,
                    });
                  },
                  onError: (err) => {
                    confirm({
                      title: "Error Ending Giveaway",
                      children: <RequestError error={err} />,
                    });
                  },
                  onSettled: () => {
                    setEndingGiveaway(false);
                  },
                }
              );
            }
          }}
        >
          <FaTrophy className="inline mr-1 w-6 h-6" />
          End Giveaway
        </ColorButton>
      )}
    </>
  );
};
