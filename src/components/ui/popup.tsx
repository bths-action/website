"use client";
import { FC, MouseEvent, PropsWithChildren, ReactNode, useEffect } from "react";
import { TransparentButton } from "./buttons";
import { BiX } from "react-icons/bi";

export const PopupUI: FC<
  PropsWithChildren<{
    disabledExit?: boolean;
    setOpen: ((a: boolean) => any) | undefined;
    title?: ReactNode;
  }>
> = ({ children, setOpen, title }) => {
  function handleEsc(event: KeyboardEvent) {
    if (event.key === "Escape") {
      setOpen?.(false);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);
  return (
    <div
      className="flex fixed inset-0 z-40 flex-row justify-center items-center w-[100dvw] h-[100dvh] text-black bg-black bg-opacity-50"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          setOpen?.(false);
        }
      }}
    >
      <div className="overflow-auto max-w-5xl min-w-[100dvw] xs:min-w-0 w-[90vw] max-h-[100dvh] text-center bg-white dark:bg-zinc-900 rounded-lg border-2 border-black dark:border-white">
        <div className="flex items-center">
          <h6 className="w-full text-3xl">{title}</h6>
          <TransparentButton className="rounded-none rounded-tr-lg">
            <BiX className="w-12 h-12" />
          </TransparentButton>
        </div>
        <hr />
        <div>{children}</div>
      </div>
    </div>
  );
};
