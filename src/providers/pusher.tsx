"use client";

import Pusher from "pusher-js";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type PusherChannel = ReturnType<Pusher["subscribe"]>;

const PusherClientContext = createContext<Pusher | null>(null);

export const PusherProvider: FC<
  PropsWithChildren<{
    clientKey: string;
    cluster: string;
    authEndpoint: string;
  }>
> = ({ children, clientKey, cluster, authEndpoint }) => {
  const pusher = useMemo(
    () =>
      new Pusher(clientKey, {
        cluster,
        authEndpoint,
      }),
    [authEndpoint, clientKey, cluster]
  );

  return (
    <PusherClientContext.Provider value={pusher}>
      {children}
    </PusherClientContext.Provider>
  );
};

export const usePusher = () => {
  const pusher = useContext(PusherClientContext);

  if (!pusher) {
    throw new Error("usePusher must be used inside PusherProvider.");
  }

  return { client: pusher };
};

export const useChannel = (name: string) => {
  const pusher = useContext(PusherClientContext);

  if (!pusher) {
    throw new Error("useChannel must be used inside PusherProvider.");
  }

  const [channel, setChannel] = useState<PusherChannel | null>(null);

  useEffect(() => {
    const nextChannel = pusher.subscribe(name);
    setChannel(nextChannel);

    return () => {
      pusher.unsubscribe(name);
    };
  }, [name, pusher]);

  return channel;
};

export const useEvent = <T = unknown>(
  channel: PusherChannel | null,
  event: string,
  callback: (data: T) => void
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!channel) return;

    const handler = (data: unknown) => callbackRef.current(data as T);

    channel.bind(event, handler);

    return () => {
      channel.unbind(event, handler);
    };
  }, [channel, event]);
};
