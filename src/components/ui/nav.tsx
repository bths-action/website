"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { TransparentButton } from "./buttons";
import { FaRegIdCard, FaRegMoon } from "react-icons/fa";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  MdContentCopy,
  MdEventAvailable,
  MdHomeFilled,
  MdOutlineBalance,
  MdOutlineWbSunny,
} from "react-icons/md";
import { BiPhotoAlbum, BiSpreadsheet } from "react-icons/bi";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BsQuestionCircle } from "react-icons/bs";

const ThemeButton: FC<{
  mounted: boolean;
}> = ({ mounted }) => {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <TransparentButton
      onClick={() => {
        if (mounted) setTheme(resolvedTheme == "dark" ? "light" : "dark");
      }}
      className="rounded-full px-0.5 md:px-4 py-2 w-full md:rounded-none lg:text-left"
    >
      <FaRegMoon className=" h-full w-7 hidden dark:inline" />
      <MdOutlineWbSunny className=" h-full w-7 inline dark:hidden" />
      <span className="ml-1 lg:inline hidden">Toggle Theme</span>
    </TransparentButton>
  );
};

const ProfileButton: FC = () => {
  const { data } = useSession();
  return (
    <TransparentButton
      whileHover={{
        scale: 1.1,
      }}
      className="rounded-full md:my-2 h-10 w-10 mx-2"
      onClick={() => signIn("auth0")}
    >
      <img
        src={
          data?.user?.image ||
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png?20220226140232"
        }
        className="rounded-full min-w-10 min-h-10 bg-black bordered"
      />
    </TransparentButton>
  );
};

type Links = {
  [key: string]: {
    href: string;
    icon: IconType;
    text: string;
  };
};

const NAV_LINKS: Links = {
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
};

const RESOURCE_LINKS: Links = {
  faq: {
    href: "/faq",
    icon: BsQuestionCircle,
    text: "FAQ",
  },
  points: {
    href: "/points",
    icon: BiSpreadsheet,
    text: "Points & Hours",
  },
  bylaws: {
    href: "/bylaws",
    icon: MdOutlineBalance,
    text: "Bylaws",
  },
};

export const Navbar: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sideContent, setSideContent] = useState<ReactNode>();
  const [sideOpen, setSideOpen] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // vertical navbar
  return (
    <nav className="flex items-center justify-around md:justify-start md:flex-col md:h-[100dvh] w-screen md:w-20 lg:w-60 bottom-0 bg-gray-100 dark:bg-gray-900 py-2 md:relative absolute flex-row z-30">
      <Link href="/" className="hidden md:inline-block">
        <Image
          src="/icon.png"
          alt="BTHS Action"
          width={40}
          height={40}
          className="rounded-full w-12 h-12"
        />
      </Link>
      <div className="flex items-center justify-around md:justify-start w-full md:flex-col md:h-[calc(100dvh-60px)] md:overflow-auto flex-1">
        {Object.entries(NAV_LINKS).map(
          ([location, { href, icon: Icon, text }]) => (
            <TransparentButton
              key={href}
              id={location}
              className="rounded-full md:px-4 py-2 md:rounded-none w-full lg:text-left"
            >
              <Link href={href} className="inline">
                <Icon className="h-full inline w-7" />
                <span className="ml-1 lg:inline hidden">{text}</span>
              </Link>
            </TransparentButton>
          )
        )}
        <TransparentButton
          onClick={() => {
            setSideContent(
              <>
                {Object.entries(RESOURCE_LINKS).map(
                  ([location, { href, icon: Icon, text }]) => (
                    <TransparentButton
                      key={href}
                      id={location}
                      className="px-4 py-2 rounded-none w-full lg:text-left"
                    >
                      <Link href={href} className="inline">
                        <Icon className="h-full inline w-7" />
                        <span className="ml-1">{text}</span>
                      </Link>
                    </TransparentButton>
                  )
                )}
              </>
            );
            setSideOpen(!sideOpen);
          }}
          className="rounded-full md:px-4 py-2 md:rounded-none w-full lg:text-left"
        >
          <MdContentCopy className="h-full inline w-7" />
          <span className="ml-1 lg:inline hidden">Resources</span>
        </TransparentButton>
        <ThemeButton mounted={mounted} />
      </div>
      <ProfileButton />
      <motion.div
        className={`absolute md:h-[100dvh] ${sideOpen ? "h-60" : "h-0"} ${
          sideOpen ? "md:w-60" : "md:w-0"
        } w-[100dvw] bg-gray-100 dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 md:translate-x-full right-0 top-0 translate-x-0 -translate-y-full md:translate-y-0 transition-[height,width] duration-300 ease-in-out md:overflow-hidden ${
          sideOpen ? "overflow-y-scroll" : "overflow-y-hidden"
        }`}
      >
        <div className="md:w-60 w-full">{sideContent}</div>
      </motion.div>
    </nav>
  );
};
