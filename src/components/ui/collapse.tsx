"use client";

import { FC, PropsWithChildren } from "react";
import { HTMLMotionProps, Variants, motion } from "motion/react";

export const Collapse: FC<
  PropsWithChildren<
    Omit<HTMLMotionProps<"div">, "animate" | "initial"> & {
      collapsed: boolean;
      initial?: Variants;
      animate?: Variants;
    }
  >
> = ({ children, collapsed, className, initial, animate, ...props }) => {
  return (
    <motion.div
      initial={{ height: collapsed ? 0 : "auto", ...initial }}
      animate={{ height: collapsed ? 0 : "auto", ...animate }}
      className={`overflow-hidden ease-in-out duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
