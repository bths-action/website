"use client";

import { FC, PropsWithChildren } from "react";
import { motion } from "framer-motion";

export const Collapse: FC<
  PropsWithChildren<{
    collapsed: boolean;
  }>
> = ({ children, collapsed }) => {
  return (
    <motion.div
      initial={{ height: collapsed ? 0 : "auto" }}
      animate={{ height: collapsed ? 0 : "auto" }}
      className={`overflow-hidden
         
      } ease-in-out duration-200`}
    >
      {children}
    </motion.div>
  );
};
