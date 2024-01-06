"use client";
import BylawsContent from "@/mdx/bylaws.mdx";
import { FC } from "react";

export const Bylaws: FC = () => {
  return (
    <div className="w-full text-left">
      <BylawsContent />
    </div>
  );
};
