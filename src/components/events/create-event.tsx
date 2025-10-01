"use client";

import { useAccount } from "@/providers/account";
import { FC, useState } from "react";
import { ColorButton } from "../ui/buttons";
import { BiPlus } from "react-icons/bi";
import { EventForm } from "../form/event-form";

export const CreateEvent: FC = () => {
  const account = useAccount();
  const [createOpen, setCreateOpen] = useState(false);
  const position = account.data?.position;

  if (position == "ADMIN" || position == "EXEC")
    return (
      <>
        <div className="sticky bottom-4 mt-2 w-full text-right pointer-events-none z-50">
          <ColorButton
            className="mr-8 w-16 h-16 rounded-full pointer-events-auto shadowed"
            color="default"
            onClick={() => setCreateOpen(true)}
          >
            <BiPlus className="w-16 h-16 fill-white" />
          </ColorButton>
        </div>
        {createOpen && <EventForm setOpen={setCreateOpen} mode="create" />}
      </>
    );
};
