"use client";
import { FC, ReactNode } from "react";
import {
  HTMLMotionProps,
  Target,
  TargetAndTransition,
  motion,
} from "framer-motion";

export interface MotionButtonProps
  extends Omit<HTMLMotionProps<"button">, "initial" | "whileHover"> {
  initial?: Target;
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
}
//use html button props and pass on
export const TransparentButton: FC<MotionButtonProps> = (props) => {
  return (
    <motion.button
      {...props}
      className={`rounded-full dark:text-white text-black ${
        props.className || ""
      }`}
      initial={{
        backgroundColor: "rgba(128,128,128,0)",
        ...props.initial,
      }}
      whileHover={{
        backgroundColor: "rgba(128,128,128,0.4)",
        ...props.whileHover,
      }}
      whileTap={{
        scale: 0.9,
        backgroundColor: "rgba(128,128,128,0.8)",
        ...props.whileTap,
      }}
    />
  );
};

export const RoundButton: FC<MotionButtonProps> = (props) => {
  return (
    <TransparentButton
      {...props}
      className={`px-2 rounded-full bordered ${props.className || ""}`}
    />
  );
};

export const ColorButton: FC<
  MotionButtonProps & {
    color: string;
    darkColor?: string;
    children?: ReactNode;
    innerClass?: string;
  }
> = ({ children, innerClass, color, className, darkColor, ...props }) => {
  if (!darkColor) darkColor = color;
  return (
    <TransparentButton
      {...props}
      whileHover={{
        scale: 1.1,
      }}
      className={`overflow-hidden ${className || ""}`}
    >
      <div
        className={`w-full h-full flex justify-center items-center  bg-${color} dark:bg-${darkColor} ${
          innerClass || ""
        }`}
      >
        {children}
      </div>
    </TransparentButton>
  );
};
