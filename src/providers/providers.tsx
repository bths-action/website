"use client";

import {
  PusherProvider as $PusherProvider,
  type PusherProviderProps,
} from "@harelpls/use-pusher";
import { SessionProvider } from "next-auth/react";
import { FC, PropsWithChildren } from "react";
import { MDXProvider } from "@mdx-js/react";
import { MDXComponents } from "mdx/types";
import { AppProgressBar as NextNProgress } from "next-nprogress-bar";
import { ThemeProvider } from "next-themes";

const PusherProvider = $PusherProvider as FC<
  PropsWithChildren<PusherProviderProps>
>;

const components: MDXComponents = {
  a: (props) => (
    <a
      target={props?.href?.startsWith("/") ? "_self" : "_blank"}
      href={props?.href?.startsWith("#") ? undefined! : props.href!}
      onClick={(e) => {
        if (!props?.href?.startsWith("#")) return;
        e.preventDefault();
        document.getElementById(props.href!.slice(1))?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }}
    >
      {props.children}
    </a>
  ),
  hr: () => <hr className="border-white my-2" />,
};

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <PusherProvider
      clientKey={process.env.NEXT_PUBLIC_PUSHER_KEY!}
      cluster={process.env.NEXT_PUBLIC_PUSHER_CLUSTER!}
    >
      <ThemeProvider attribute="class" storageKey="theme" defaultTheme="light">
        <MDXProvider components={components}>
          <SessionProvider>{children}</SessionProvider>
        </MDXProvider>
      </ThemeProvider>
    </PusherProvider>
  );
};

export const LoadingBar = () => (
  <NextNProgress options={{}} color="lightblue" height="5px" />
);
