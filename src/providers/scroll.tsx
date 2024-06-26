"use client";
import {
  FC,
  PropsWithChildren,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";

type ScrollRef = RefObject<HTMLDivElement>;
const ScrollContext = createContext<ScrollRef>({} as any);

export const ScrollRefProvider: FC<PropsWithChildren> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log(scrollRef.current);
  }, [scrollRef]);
  return (
    <div
      ref={scrollRef}
      className="h-[calc(100dvh-56px)] md:h-[100dvh]  relative overflow-auto w-full break-words"
      id="content"
    >
      <ScrollContext.Provider value={scrollRef}>
        {children}
      </ScrollContext.Provider>
    </div>
  );
};

export const useScrollRef = () => {
  return useContext(ScrollContext);
};
