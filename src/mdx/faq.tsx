"use client";

import FAQContent from "@/mdx/faq.mdx";
import { FC } from "react";

export const FAQ: FC = () => {
  return (
    <div className="w-full text-left">
      <FAQContent />
    </div>
  );
};
