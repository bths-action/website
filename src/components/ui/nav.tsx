"use client";
import Image from "next/image";
import { FC, PropsWithChildren, useEffect, useState } from "react";

const NAV_LINKS = {};

export const Navbar: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) setOpen(false);
      else setOpen(true);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  // vertical navbar
  return (
    <nav className="flex min-w-[64px] flex-col h-screen bg-white dark:bg-gray-900 p-2">
      <Image
        src="/icon.png"
        alt="BTHS Action"
        width={60}
        height={60}
        className="rounded-full"
      />
    </nav>
  );
};
