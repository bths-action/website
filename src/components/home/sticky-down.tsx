"use client";
import { FC } from "react";
import { ColorButton } from "../ui/buttons";
import { FaArrowDown } from "react-icons/fa";
import { useSession } from "next-auth/react";

export const StickyDown: FC = () => {
  const { status } = useSession();
  return (
    <ColorButton
      className={`w-12 h-12 disabled:cursor-auto rounded-full shadowed transition-all duration-1000 ${
        status == "authenticated"
          ? "sticky bottom-4 pointer-events-auto"
          : "opacity-0 pointer-events-none bottom-0"
      }`}
      color="default"
    >
      <FaArrowDown className="w-6 h-6 bottom-0 text-white" />
    </ColorButton>
  );
};
