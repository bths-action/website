import { FC, PropsWithChildren } from "react";

export const LimitedContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className="max-w-7xl w-full mx-auto px-2">{children}</div>;
};
