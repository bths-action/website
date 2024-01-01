"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { TransparentButton, TransparentButtonProps } from "./buttons";
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
import { BiPhotoAlbum, BiSpreadsheet, BiXCircle } from "react-icons/bi";
import { signIn, useSession } from "next-auth/react";
import { BsQuestionCircle } from "react-icons/bs";

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

const NavButton: FC<
  PropsWithChildren<
    {
      href?: string;
      icon?: IconType;
      hideSmall?: boolean;
    } & TransparentButtonProps
  >
> = ({
  href,
  icon: Icon,
  children,
  onClick,
  hideSmall,
  className,
  ...props
}) => {
  const icon = Icon ? <Icon className="h-full inline w-7" /> : null;
  const content = (
    <>
      {icon}
      <span className={`ml-1 ${hideSmall ? "lg:inline hidden" : ""}`}>
        {children}
      </span>
    </>
  );

  return (
    <TransparentButton
      onClick={onClick}
      className={
        "rounded-full md:px-4 py-2 md:rounded-none w-full lg:text-left " +
        (className || "")
      }
      {...props}
    >
      {href ? (
        <Link href={href} className="inline">
          {content}
        </Link>
      ) : (
        content
      )}
    </TransparentButton>
  );
};

const ThemeButton: FC<{
  mounted: boolean;
}> = ({ mounted }) => {
  const { setTheme, resolvedTheme } = useTheme();

  //change to navbutton
  return (
    <NavButton
      onClick={() => {
        if (mounted) setTheme(resolvedTheme == "dark" ? "light" : "dark");
      }}
      className=""
    >
      <FaRegMoon className="-ml-1 h-full w-7 hidden dark:inline" />
      <MdOutlineWbSunny className="-ml-1 h-full w-7 inline dark:hidden" />
      <span className="ml-1 lg:inline hidden">Toggle Theme</span>
    </NavButton>
  );
};

const ProfileButton: FC<{
  sideId: string;
  setSideId: (id: string) => void;
  setSideContent: (content: ReactNode) => void;
}> = ({ setSideContent, setSideId, sideId }) => {
  const { data, status } = useSession();
  return (
    <TransparentButton
      whileHover={{
        scale: 1.1,
      }}
      disabled={status == "loading"}
      className="rounded-full md:my-2 h-10 w-10 mx-2"
      onClick={() => {
        if (status == "unauthenticated") signIn("auth0");
        else {
          setSideId(sideId == "profile" ? "" : "profile");
          setSideContent(<></>);
        }
      }}
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

export const Navbar: FC<PropsWithChildren> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [sideContent, setSideContent] = useState<ReactNode>();
  const [sideId, setSideId] = useState("");
  useEffect(() => {
    setMounted(true);
  }, []);

  // vertical navbar
  return (
    <nav className="flex items-center justify-around md:justify-start md:flex-col md:h-[100dvh] w-screen md:w-20 lg:w-60 bottom-0 bg-gray-100 dark:bg-gray-900 py-2 md:relative absolute flex-row z-30 border-r-0 md:border-r-2 border-t-2 md:border-t-0 ">
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
        {Object.entries(NAV_LINKS).map(([location, { href, icon, text }]) => (
          <NavButton
            key={href}
            icon={icon}
            href={href}
            hideSmall
            onClick={() => {
              setSideId("");
            }}
          >
            {text}
          </NavButton>
        ))}
        <NavButton
          icon={MdContentCopy}
          hideSmall
          onClick={() => {
            setSideId(sideId == "resources" ? "" : "resources");
            setSideContent(
              <>
                {Object.entries(RESOURCE_LINKS).map(
                  ([location, { href, icon, text }]) => (
                    <NavButton
                      key={href}
                      icon={icon}
                      href={href}
                      onClick={() => {
                        setSideId("");
                      }}
                    >
                      {text}
                    </NavButton>
                  )
                )}
              </>
            );
          }}
        >
          Resources
        </NavButton>
        <ThemeButton mounted={mounted} />
      </div>
      <ProfileButton
        setSideContent={setSideContent}
        setSideId={setSideId}
        sideId={sideId}
      />
      <div
        className={`absolute md:h-[100dvh]  ${
          sideId
            ? "h-60 w-[100dvw]  md:w-60 overflow-y-auto"
            : "h-0 w-0 overflow-y-hidden"
        }  bg-gray-100 md:border-0 md:border-r-2 border-t-2  dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 md:translate-x-full  right-0 top-0 translate-x-0 -translate-y-full md:translate-y-0 transition-[height,width] duration-300 ease-in-out md:overflow-hidden`}
      >
        <div className="md:w-60 w-full">
          <NavButton
            icon={BiXCircle}
            className="border-b-2 rounded-none"
            onClick={() => {
              setSideId("");
            }}
          >
            Close
          </NavButton>
          {sideContent}
        </div>
      </div>
    </nav>
  );
};
