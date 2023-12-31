"use client";
import { TRPCError } from "@/app/api/trpc/client";
import { FC, Fragment, HTMLProps, PropsWithChildren } from "react";

interface Props extends PropsWithChildren<HTMLProps<HTMLDivElement>> {
  error: TRPCError;
}

export const Error: FC<Props> = ({ children, error, className, ...props }) => {
  return (
    <div
      className={
        "flex flex-col items-center justify-center bg-red-500 text-white rounded-lg p-1" +
        (className || "")
      }
    >
      <h5>Oops! Something went wrong.</h5>
      {children}
      <code className="w-full">
        Code: {error.data?.code || "Unknown"}
        <br />
        Message: {error.message}
        {error.data?.stack && (
          <>
            <br />
            Stack:{" "}
            {error.data.stack.split("\n").map((line, idx) => (
              <Fragment key={idx}>
                {line}
                <br />
              </Fragment>
            ))}
          </>
        )}
      </code>
    </div>
  );
};
