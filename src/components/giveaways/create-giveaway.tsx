"use client";
import { useAccount } from "@/providers/account";
import { FC, useState } from "react";
import { ColorButton } from "../ui/buttons";
import { BiPlus } from "react-icons/bi";
import { GiveawayForm } from "../form/giveaway-form";

export const CreateGiveaway: FC = () => {
  const account = useAccount();
  const [createOpen, setCreateOpen] = useState(false);
  const position = account.data?.position;

  if (position == "ADMIN" || position == "EXEC")
    return (
      <>
        <div className="sticky bottom-4 mt-2 w-full text-right pointer-events-none">
          <ColorButton
            className="mr-8 w-16 h-16 rounded-full pointer-events-auto shadowed"
            color="default"
            onClick={() => setCreateOpen(true)}
          >
            <BiPlus className="w-16 h-16 fill-white" />
          </ColorButton>
        </div>
        {createOpen && <GiveawayForm mode="create" setOpen={setCreateOpen} />}
      </>
    );
};
