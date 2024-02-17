"use client";
import { TRPCError } from "@/app/api/trpc/client";
import { ErrorMessage } from "formik";
import { FC, Fragment, HTMLProps, PropsWithChildren } from "react";
import { BiXCircle } from "react-icons/bi";

export const RequestError: FC<
  PropsWithChildren<
    HTMLProps<HTMLDivElement> & {
      error: TRPCError;
    }
  >
> = ({ children, error, className, ...props }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-red-500 text-white rounded-lg p-1 ${
        className || ""
      }`}
      {...props}
    >
      <h5>
        <BiXCircle className="inline w-8 h-8" /> Oops! Something went wrong.
      </h5>
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

export const FormError: FC<
  HTMLProps<HTMLDivElement> & {
    name: string;
  }
> = ({ className, name, ...props }) => {
  return (
    <ErrorMessage name={name}>
      {(msg) => (
        <div
          className={` bg-red-500 rounded-lg p-1 mt-2 text-white ${
            className || ""
          }`}
          {...props}
        >
          <BiXCircle className="inline w-7 h-7 " />
          {msg}
        </div>
      )}
    </ErrorMessage>
  );
};
