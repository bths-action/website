"use client";
import { trpc } from "@/app/(api)/api/trpc/client";
import { useAccount } from "@/providers/account";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
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
  const router = useRouter();

  return (
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
      <ColorButton
        color="red-500"
        innerClass="text-white text-xl p-2"
        className="rounded-xl shadowed"
        onClick={async () => {
          if (
            await confirm({
              title: "Giveaway Deletion",
              children:
                "Are you sure you want to delete this giveaway? This is to delete the giveaway, not end it.",
            })
          ) {
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
              }
            );
          }
        }}
      >
        <FaRegTrashAlt className="inline mr-1 w-6 h-6" />
        Delete Giveaway
      </ColorButton>
    </>
  );
};
