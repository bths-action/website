import { FC, HTMLProps, PropsWithChildren } from "react";

export const LimitedContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className="max-w-7xl w-full mx-auto px-2">{children}</div>;
};

export const FormQuestion: FC<
  PropsWithChildren<
    HTMLProps<HTMLDivElement> & {
      errored?: boolean;
    }
  >
> = ({ children, className, errored, ...props }) => {
  return (
    <div
      className={`inline-block p-1 my-1 rounded-lg max-w-full ${
        errored ? "border-red-500 border-2 bg-opacity-20 bg-red-500 " : ""
      } ${className ? className : ""}`}
      {...props}
    >
      {children}
    </div>
  );
};
