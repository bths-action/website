"use client";
import { FC } from "react";
import { ColorButton } from "../ui/buttons";
import { FaArrowDown } from "react-icons/fa";

export const StickyDown: FC = () => {
  return (
    <ColorButton
      className="w-12 h-12 disabled:cursor-auto rounded-full pointer-events-auto shadowed sticky bottom-4"
      color="default"
    >
      <FaArrowDown className="w-6 h-6 text-white" />
    </ColorButton>
  );
};
