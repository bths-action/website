"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { TransparentButton } from "./buttons";
import { FaRegIdCard, FaRegMoon } from "react-icons/fa";
import Link from "next/link";
import { Locations } from "@/providers/location";
import { IconType } from "react-icons";
import {
  MdContentCopy,
  MdEventAvailable,
  MdHomeFilled,
  MdOutlineWbSunny,
} from "react-icons/md";
import { BiPhotoAlbum } from "react-icons/bi";
import { useSession } from "next-auth/react";

const ThemeButton: FC<{
  mounted: boolean;
}> = ({ mounted }) => {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <TransparentButton
      onClick={() => {
        if (mounted) setTheme(resolvedTheme == "dark" ? "light" : "dark");
      }}
      className="p-1.5 w-10 lg:w-auto h-10 flex items-center justify-center lg:justify-between my-2"
    >
      <FaRegMoon className=" h-full w-6 hidden dark:inline" />
      <MdOutlineWbSunny className=" h-full inline dark:hidden" />
      <span className="ml-1 lg:inline hidden">Toggle Theme</span>
    </TransparentButton>
  );
};

const NAV_LINKS: {
  [key in Locations]: {
    href: string;
    icon: IconType;
    text: string;
  };
} = {
  home: {
    href: "/",
    icon: MdHomeFilled,
    text: "Home",
  },
  events: {
    href: "/events",
    icon: MdEventAvailable,
    text: "Events",
  },
  gallery: {
    href: "/gallery",
    icon: BiPhotoAlbum,
    text: "Gallery",
  },
  executives: {
    href: "/executives",
    icon: FaRegIdCard,
    text: "Executives",
  },
  resources: {
    href: "/resources",
    icon: MdContentCopy,
    text: "Resources",
  },
};

export const Navbar: FC<PropsWithChildren> = ({ children }) => {
  const { data } = useSession();
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
    <nav className="flex items-center justify-around md:justify-start md:flex-col md:h-[100dvh] w-screen md:w-20 lg:w-60 bottom-0 bg-gray-100 dark:bg-gray-900 py-2 md:relative absolute flex-row z-30 b">
      <Link href="/" className="hidden md:inline-block">
        <Image
          src="/icon.png"
          alt="BTHS Action"
          width={40}
          height={40}
          className="rounded-full w-12 h-12"
        />
      </Link>
      <div className="flex items-center justify-around md:justify-start md:flex-col md:h-[calc(100dvh-60px)] md:overflow-auto flex-1">
        {Object.entries(NAV_LINKS).map(
          ([location, { href, icon: Icon, text }]) => (
            <TransparentButton
              key={href}
              id={location}
              className="rounded-full p-1 my-2"
            >
              <Link href={href} className="inline">
                <Icon className="h-full inline w-6" />
                <span className="ml-1 lg:inline hidden">{text}</span>
              </Link>
            </TransparentButton>
          )
        )}
        <ThemeButton mounted={mounted} />
      </div>
      <TransparentButton
        whileHover={{
          scale: 1.1,
        }}
        className="rounded-full md:my-2 h-10 w-10 mx-3"
      >
        <img
          src={
            data?.user?.image ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png?20220226140232"
          }
          className="rounded-full min-w-10 min-h-10 bg-black border-2 dark:border-white border-black "
        />
      </TransparentButton>
    </nav>
  );
};
