"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { TransparentButton } from "./buttons";
import { FaRegMoon, FaRegSun } from "react-icons/fa";

const NAV_LINKS = {};

export const Navbar: FC<PropsWithChildren> = ({ children }) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
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
    <nav className="flex items-center md:flex-col md:h-[100dvh] w-screen md:w-16 bottom-0 bg-gray-100 dark:bg-gray-900 py-2 md:relative absolute flex-row">
      <Image
        src="/icon.png"
        alt="BTHS Action"
        width={60}
        height={60}
        className="rounded-full w-12 h-12"
      />

      <TransparentButton
        onClick={() => {
          if (mounted) setTheme(resolvedTheme == "dark" ? "light" : "dark");
        }}
        className="p-3 w-12 h-12 flex items-center justify-center border-[3px] border-black dark:border-white my-2"
      >
        <FaRegMoon className="w-full h-full hidden dark:inline" />
        <FaRegSun className="w-full h-full inline dark:hidden" />
      </TransparentButton>
    </nav>
  );
};
