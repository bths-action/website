import { FC } from "react";
import {
  HTMLMotionProps,
  Target,
  TargetAndTransition,
  motion,
} from "framer-motion";

interface TransparentButtonProps
  extends Omit<HTMLMotionProps<"button">, "initial" | "whileHover"> {
  initial?: Target;
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
}
//use html button props and pass on
export const TransparentButton: FC<TransparentButtonProps> = (props) => {
  return (
    <motion.button
      {...props}
      className={
        "rounded-full dark:text-white text-black " + (props.className || "")
      }
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
