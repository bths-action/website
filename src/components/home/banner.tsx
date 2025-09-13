"use client";
import { useAccount } from "@/providers/account";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

export const Banner: FC = () => {
  const [mounted, setMounted] = useState(false);
  const [animated, setAnimated] = useState(false);
  const account = useAccount();
  const { status } = useSession();
  useEffect(() => {
    if (account.status == "loading" || status == "loading") return;
    setMounted(true);
    const timer = setTimeout(() => setAnimated(true), 750);
    return () => clearTimeout(timer);
  }, [account, status]);
  return (
    <div className="relative w-full h-dvh rounded-xl mb-4">
      <div className="absolute w-full top-1/2 -translate-y-1/2 text-center banner z-10">
        <span
          className={`inline-block backdrop-blur-sm bg-black/50 rounded-3xl p-6 transition-all duration-1000 ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"
          } `}
        >
          <h1
            className={`text-white mb-2 underline-animation after:duration-500 after:h-3 ${
              animated ? "underline-animated " : ""
            }`}
          >
            BTHS Action
          </h1>
        </span>
      </div>

      <Image
        src="/images/banner.jpg"
        alt=""
        fill
        className="object-cover brightness-75"
      />
    </div>
  );
};
