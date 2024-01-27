"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { TransparentButton, MotionButtonProps, ColorButton } from "./buttons";
import {
  FaClipboard,
  FaClipboardCheck,
  FaDiscord,
  FaInstagram,
  FaRegIdCard,
  FaRegMoon,
  FaUserEdit,
} from "react-icons/fa";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  MdContentCopy,
  MdEventAvailable,
  MdHomeFilled,
  MdOutlineBalance,
  MdOutlineWbSunny,
  MdWarning,
} from "react-icons/md";
import {
  BiAward,
  BiLogOut,
  BiMailSend,
  BiPhotoAlbum,
  BiSearch,
  BiSpreadsheet,
  BiXCircle,
} from "react-icons/bi";
import { signIn, signOut, useSession } from "next-auth/react";
import { BsQuestionCircle } from "react-icons/bs";
import { UserForm } from "../form/user-form";
import { useAccount } from "@/providers/account";
import { ExecForm } from "../form/exec-form";
import { twMerge } from "tailwind-merge";
import { EmailQueryForm } from "../form/email-query-form";
import { DISCORD_INVITE_LINK } from "@/utils/constants";

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
    } & MotionButtonProps
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
  const icon = Icon ? <Icon className="h-full inline w-6" /> : null;
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
      className={twMerge(
        "rounded-full md:rounded-none w-full overflow-hidden",
        className || "",
        href ? "" : "md:px-4 py-2"
      )}
      {...props}
    >
      {href ? (
        <Link
          href={href}
          className={`w-full h-full block ${href ? "md:px-4 py-2" : ""}`}
        >
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
      className="lg:text-left"
    >
      <FaRegMoon className="-ml-1 h-full w-6 hidden dark:inline" />
      <MdOutlineWbSunny className="-ml-1 h-full w-6 inline dark:hidden" />
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
  const [formOpen, setFormOpen] = useState(false);
  const [execOpen, setExecOpen] = useState(false);
  const [queryOpen, setQueryOpen] = useState(false);
  const { status: accountStatus, data: accountData } = useAccount();
  const notDone = status == "loading" || accountStatus == "loading";
  return (
    <>
      {formOpen && <UserForm setOpen={setFormOpen} mode="edit" />}
      {accountStatus == "success" &&
        accountData?.position == "EXEC" &&
        execOpen && (
          <ExecForm
            setOpen={setExecOpen}
            mode={accountData?.execDetails ? "edit" : "create"}
          />
        )}
      {accountStatus == "success" &&
        accountData?.position == "EXEC" &&
        queryOpen && <EmailQueryForm setOpen={setQueryOpen} />}
      <TransparentButton
        whileHover={{
          scale: 1.1,
        }}
        disabled={notDone}
        className="relative rounded-full md:my-2 h-10 w-10 mx-2"
        onClick={() => {
          if (status == "unauthenticated") signIn("auth0");
          else {
            setSideId(sideId == "profile" ? "" : "profile");
            setSideContent(
              <>
                <NavButton icon={FaUserEdit} onClick={() => setFormOpen(true)}>
                  Edit Profile
                </NavButton>
                {accountStatus == "success" &&
                  accountData?.position == "EXEC" && (
                    <NavButton
                      icon={FaUserEdit}
                      onClick={() => setExecOpen(true)}
                    >
                      Edit Exec Profile
                    </NavButton>
                  )}

                {
                  <NavButton
                    disabled={accountData?.didOsis}
                    icon={accountData?.didOsis ? FaClipboardCheck : FaClipboard}
                    className="relative"
                    onClick={() => {
                      open(
                        "https://docs.google.com/forms/d/e/1FAIpQLSd7yl28S0IVjgkKO2q-OUEwMxu963KK79HJd0Tqnoc-gl_xeQ/viewform?usp=sf_link"
                      );
                    }}
                  >
                    OSIS Form{" "}
                    {accountData?.didOsis ? (
                      "(Completed)"
                    ) : (
                      <>
                        (MUST DO)
                        <MdWarning className="inline w-6 h-6 text-red-500" />
                      </>
                    )}
                  </NavButton>
                }
                {accountStatus == "success" &&
                  accountData?.position == "EXEC" && (
                    <>
                      <NavButton
                        icon={BiSearch}
                        onClick={() => setQueryOpen(true)}
                      >
                        Query Emails
                      </NavButton>
                      <NavButton
                        icon={BiAward}
                        href="/spreadsheet"
                        onClick={() => {
                          setSideId("");
                        }}
                      >
                        Credits Spreadsheet
                      </NavButton>
                    </>
                  )}
                <ColorButton
                  color="red-500"
                  className="w-full rounded-none"
                  innerClass=" p-2 text-white"
                  onClick={() => signOut()}
                >
                  <BiLogOut className="inline w-6 h-6 mr-1 " /> Logout
                </ColorButton>
              </>
            );
          }
        }}
      >
        <img
          src={
            notDone
              ? "https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif"
              : data?.user?.image ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png?20220226140232"
          }
          className="rounded-full min-w-8 min-h-8 bg-black bordered"
        />
        {accountStatus == "success" && accountData?.didOsis == false && (
          <MdWarning className="absolute right-0 top-0 w-8 h-8 text-red-500 translate-x-1/2 -translate-y-1/2" />
        )}
      </TransparentButton>
    </>
  );
};

const socials = (
  <>
    <TransparentButton
      className="p-2"
      onClick={() => open(DISCORD_INVITE_LINK)}
    >
      <FaDiscord className="w-8 h-8" />
    </TransparentButton>
    <TransparentButton
      className="p-2"
      onClick={() => open("https://instagram.com/bths.action")}
    >
      <FaInstagram className="w-8 h-8" />
    </TransparentButton>
    <TransparentButton
      className="p-2"
      onClick={() => open("mailto:bthsaction@gmail.com")}
    >
      <BiMailSend className="w-8 h-8" />
    </TransparentButton>
  </>
);

export const Navbar: FC<PropsWithChildren> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [sideContent, setSideContent] = useState<ReactNode>();
  const [sideId, setSideId] = useState("");
  useEffect(() => {
    setMounted(true);
  }, []);

  // vertical navbar
  return (
    <>
      <nav className="flex items-center justify-around md:justify-start md:flex-col bg-gray-100 dark:bg-zinc-900 md:h-[100dvh] w-screen md:w-20 lg:w-60 bottom-0 py-2 md:relative absolute flex-row z-30 border-r-0 md:border-r-2 border-t-2 md:border-t-0 ">
        <Link href="/" className="hidden md:inline-block">
          <Image
            src="/icon.png"
            alt="BTHS Action"
            width={40}
            height={40}
            className="rounded-full w-12 h-12"
          />
        </Link>
        <div className="flex items-center justify-around md:justify-start w-full md:flex-col md:h-[calc(100dvh-60px)] md:overflow-x-hidden flex-1">
          {Object.entries(NAV_LINKS).map(([location, { href, icon, text }]) => (
            <NavButton
              key={href}
              icon={icon}
              href={href}
              hideSmall
              className="lg:text-left"
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
            className="lg:text-left"
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

                  <div className="flex lg:hidden gap-2 justify-center">
                    {socials}
                  </div>
                </>
              );
            }}
          >
            Resources
          </NavButton>
          <ThemeButton mounted={mounted} />
          <div className="hidden lg:flex gap-2 text-left lg:justify-start">
            {socials}
          </div>
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
          } bg-gray-50  md:border-0 md:border-r-2 border-t-2  dark:bg-zinc-900 bg-opacity-90 dark:bg-opacity-90 md:translate-x-full  right-0 top-0 translate-x-0 -translate-y-full md:translate-y-0 transition-[height,width] duration-300 ease-in-out md:overflow-hidden`}
        >
          <div className="md:w-60 w-full ">
            <NavButton
              icon={BiXCircle}
              className="border-b-2 rounded-none text-center"
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
      {sideId && (
        <div
          className="z-[29] w-[100dvw] h-[100dvh] fixed left-0 top-0 bg-black bg-opacity-50"
          onClick={() => {
            setSideId("");
          }}
        ></div>
      )}
    </>
  );
};
