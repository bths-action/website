"use client";
import { FC, PropsWithChildren, ReactNode, useState } from "react";
import {
  HTMLMotionProps,
  Target,
  TargetAndTransition,
  motion,
} from "framer-motion";
import { twMerge } from "tailwind-merge";
import { MdContentCopy } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { IconType } from "react-icons";

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
      className={twMerge(
        "rounded-full bg-gray-400/0 dark:text-white text-black hover:enabled:bg-gray-400/20 active:enabled:bg-gray-400/40 active:enabled:scale-90 disabled:cursor-not-allowed transition-all duration-200 ease-in-out",
        props.className || ""
      )}
      initial={{
        ...props.initial,
      }}
      whileHover={{
        ...props.whileHover,
      }}
      whileTap={{
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
      className={`overflow-hidden hover:enabled:scale-110 ${className || ""}`}
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

export const CopyButton: FC<
  PropsWithChildren<
    MotionButtonProps & {
      text: string;
    }
  >
> = ({ text, children, className, ...props }) => {
  const [copied, setCopied] = useState(false);
  const [currentTimeout, setCurrentTimeout] = useState<number | null>(null);

  const Clipboard: IconType = copied ? FaCheck : MdContentCopy;

  return (
    <ColorButton
      {...props}
      color="default"
      className={"text-white " + (className || "")}
      innerClass="p-2 text-white"
      onClick={async () => {
        setCopied(true);
        navigator.clipboard.writeText(text);
        if (currentTimeout) clearTimeout(currentTimeout);
        setCurrentTimeout(
          setTimeout(
            () => {
              setCopied(false);
            },
            2000,
            ""
          )
        );
      }}
    >
      <Clipboard className="w-6 h-6" />
      {children}
    </ColorButton>
  );
};
