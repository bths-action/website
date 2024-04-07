"use client";
import { FC, useEffect, useState } from "react";
import { ColorButton } from "../ui/buttons";
import { FaArrowDown } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/account";

export const StickyDown: FC = () => {
  const { status } = useSession();
  const account = useAccount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (account.status == "loading" || status == "loading") return;
    setMounted(true);
  }, [account, status]);
  return (
    <ColorButton
      className={`w-12 h-12 disabled:cursor-auto rounded-full shadowed transition-all duration-1000 ${
        status == "authenticated" && mounted
          ? "sticky bottom-4 pointer-events-auto"
          : "opacity-0 pointer-events-none bottom-1/3"
      }`}
      color="default"
      onClick={() => {
        document
          .getElementById("join-button")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }}
    >
      <FaArrowDown className="w-6 h-6 bottom-0 text-white" />
    </ColorButton>
  );
};
