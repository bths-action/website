import { ComponentPropsWithoutRef, HTMLProps, PropsWithChildren } from "react";
import {
  BarLoader,
  BeatLoader,
  BounceLoader,
  CircleLoader,
} from "react-spinners";

const LOADING_BARS = {
  bar: BarLoader,
  beat: BeatLoader,
  bounce: BounceLoader,
  circle: CircleLoader,
} as const;

type LoadingType = keyof typeof LOADING_BARS;
interface LoadingProps<T extends LoadingType>
  extends PropsWithChildren<HTMLProps<HTMLDivElement>> {
  loadingType: T;
  spinnerProps?: ComponentPropsWithoutRef<(typeof LOADING_BARS)[T]>;
}

export function Loading<T extends LoadingType>({
  children,
  className,
  loadingType,
  spinnerProps,
  ...props
}: LoadingProps<T>) {
  const Spinner = LOADING_BARS[loadingType];
  return (
    <div {...props} className={"w-full " + (className || "")}>
      {children}
      <br />
      <Spinner
        {...(spinnerProps as any)}
        className={"mx-auto max-w-full" + (spinnerProps?.className || "")}
        color={spinnerProps?.color || "#3b82f6"}
      />
    </div>
  );
}
