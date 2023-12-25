import { FC, PropsWithChildren } from "react";
import { IconType } from "react-icons";

export const Card: FC<
  PropsWithChildren<{
    icon: IconType;
  }>
> = ({ children, icon: Icon }) => {
  return <div></div>;
};
