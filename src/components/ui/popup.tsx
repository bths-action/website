"use client";
import { FC, MouseEvent, PropsWithChildren, ReactNode, useEffect } from "react";
import { TransparentButton } from "./buttons";
import { BiX } from "react-icons/bi";

export const PopupUI: FC<
  PropsWithChildren<{
    disabledExit?: boolean;
    setOpen: ((a: boolean) => any) | undefined;
    title?: ReactNode;
    size?: "large" | "small";
  }>
> = ({ children, setOpen, title, disabledExit, size = "large" }) => {
  function handleEsc(event: KeyboardEvent) {
    if (event.key === "Escape" && !disabledExit) {
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
      className="flex fixed inset-0 z-40 flex-row justify-center items-center w-[100dvw] h-[100dvh] bg-black bg-opacity-50"
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          !disabledExit && setOpen?.(false);
        }
      }}
    >
      <div
        className={`flex flex-col max-w-[95vw] max-h-[95dvh] xs:min-w-0 ${
          size == "large" ? "w-[95vw] h-[95dvh]" : ""
        } text-center bg-white dark:bg-zinc-900 rounded-lg border-2 border-black dark:border-white`}
      >
        <div className="w-full flex items-center flex-row">
          <h6 className="mx-auto px-2 text-2xl overflow-auto whitespace-nowrap">
            {title}
          </h6>
          {!disabledExit && (
            <TransparentButton
              className="rounded-none rounded-tr-lg"
              onClick={setOpen?.bind(null, false)}
            >
              <BiX className="w-12 h-12" />
            </TransparentButton>
          )}
        </div>
        <hr />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};
