"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FC, PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { TransparentButton, MotionButtonProps, ColorButton } from "./buttons";
import WidgetBot from "@widgetbot/react-embed";
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
  MdChatBubbleOutline,
  MdContentCopy,
  MdEventAvailable,
  MdHomeFilled,
  MdOutlineBalance,
  MdOutlineWbSunny,
} from "react-icons/md";
import {
  BiAward,
  BiLogOut,
  BiMailSend,
  BiPhotoAlbum,
  BiSearch,
  BiSpreadsheet,
  BiXCircle,
  BiTrash,
} from "react-icons/bi";
import { signIn, signOut, useSession } from "next-auth/react";
import { BsDiscord, BsGift, BsQuestionCircle } from "react-icons/bs";
import { UserForm } from "../form/user-form";
import { useAccount } from "@/providers/account";
import { ExecForm } from "../form/exec-form";
import { twMerge } from "tailwind-merge";
import { EmailQueryForm } from "../form/email-query-form";
import { DISCORD_INVITE_LINK } from "@/utils/constants";
import { PopupUI } from "./popup";
import { TRPCError, trpc } from "@/app/(api)/api/trpc/client";
import { confirm } from "./confirm";
import { RequestError } from "./error";

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
  giveaways: {
    href: "/giveaways",
    icon: BsGift,
    text: "Giveaways",
  },
  gallery: {
    href: "/gallery",
    icon: BiPhotoAlbum,
    text: "Gallery",
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
    text: "Reward Breakdown",
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
      <span className={`ml-1.5 ${hideSmall ? "lg:inline hidden" : ""}`}>
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
  const [connecting, setConnecting] = useState(false);
  const disconnectDiscord = trpc.disconnectDiscord.useMutation();
  const deleteAccount = trpc.deleteAccount.useMutation();
  const utils = trpc.useUtils();
  const { status: accountStatus, data: accountData } = useAccount();
  const notDone = status == "loading" || accountStatus == "loading";

  useEffect(() => {
    if (sideId != "profile") return;
    setSideContent(
      <>
        <NavButton icon={FaUserEdit} onClick={() => setFormOpen(true)}>
          Edit Profile
        </NavButton>
        {accountStatus == "success" && accountData?.position == "EXEC" && (
          <NavButton icon={FaUserEdit} onClick={() => setExecOpen(true)}>
            Edit Exec Profile
          </NavButton>
        )}

        <NavButton
          disabled={connecting}
          className="relative"
          icon={BsDiscord}
          onClick={async () => {
            setConnecting(true);
            if (accountData?.discordID) {
              disconnectDiscord.mutate(undefined, {
                onSuccess: () => {
                  utils.getForm.setData(undefined, {
                    ...accountData,
                    discordID: "",
                  });
                },
                onSettled: () => {
                  setConnecting(false);
                },
                onError: (e) => {
                  confirm({
                    title: "Error Disconnecting",
                    children: (
                      <>
                        An error occurred while disconnecting Discord.
                        <br />
                        <RequestError error={e as TRPCError} />
                      </>
                    ),
                  });
                },
              });
            } else {
              const win = open(
                `${window.location.origin}/api/connections/discord/`,
                "Discord Connection",
                "width=800,height=800"
              );
              if (!win) {
                confirm({
                  title: "Error Connecting",
                  children: (
                    <>
                      An error occurred while connecting Discord.
                      <br />
                      Please ensure that popups are enabled for this site.
                    </>
                  ),
                });
                return;
              }
              const timer = setInterval(() => {
                if (win.closed) {
                  clearInterval(timer);
                  setConnecting(false);
                  utils.getForm.refetch();
                }
              }, 500);
            }
          }}
        >
          {accountData?.discordID ? "Disc" : "C"}onnect
          {connecting && "ing"} Discord
          {!accountData?.discordID && (
            <span className=" absolute right-6 top-2">
              <div className=" w-4 h-4 absolute bg-yellow-500 rounded-full animate-ping" />
              <div className=" w-4 h-4 absolute bg-yellow-500 rounded-full" />
            </span>
          )}
        </NavButton>
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
            <span>
              (MUST DO)
              <span className=" absolute right-6 top-2">
                <div className=" w-4 h-4 absolute bg-yellow-500 rounded-full animate-ping" />
                <div className=" w-4 h-4 absolute bg-yellow-500 rounded-full" />
              </span>
            </span>
          )}
        </NavButton>

        {accountStatus == "success" && accountData?.position == "EXEC" && (
          <>
            <NavButton icon={BiSearch} onClick={() => setQueryOpen(true)}>
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
          className="w-full rounded-none py-2"
          innerClass=" p-2 text-white"
          onClick={() => {
            confirm({
              title: "Confirm Deletion",
              children: (
                <>
                  Please enter your email to confirm deletion.
                  <input
                    type="email"
                    className="w-full border-2 border-black"
                    placeholder="Email"
                  />
                </>
              ),
            }).then((result) => {
              if (!result) return;
              setConnecting(true);
              if (accountData?.email) {
                deleteAccount.mutate(undefined, {
                  onSuccess: () => {
                    utils.getForm.setData(undefined, {
                      ...accountData,
                      discordID: "",
                      name: "",
                      email: "",
                      eventAlerts: false,
                      didOsis: false,
                    });
                    signOut();
                  },
                  onSettled: () => {
                    setConnecting(false);
                  },
                  onError: (e) => {
                    confirm({
                      title: "Error Deleting Account",
                      children: (
                        <>
                          An error occurred while deleting your account.
                          <br />
                          <RequestError error={e as TRPCError} />
                        </>
                      ),
                    });
                  },
                });
              }
            });
          }}
        >
          <BiTrash className="inline w-6 h-6 mr-1 " /> DELETE ACCOUNT
        </ColorButton>
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
  }, [accountData, sideId, connecting]);
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
        className="relative rounded-full md:my-2 h-10 w-10 mx-6"
        onClick={() => {
          if (status == "unauthenticated") signIn("auth0");
          else {
            setSideId(sideId == "profile" ? "" : "profile");
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
        {accountStatus == "success" &&
          (accountData?.didOsis == false || accountData?.discordID == null) && (
            <span className=" absolute right-2 top-0">
              <div className=" w-4 h-4 absolute bg-yellow-500 rounded-full animate-ping" />
              <div className=" w-4 h-4 absolute bg-yellow-500 rounded-full" />
            </span>
          )}
      </TransparentButton>
    </>
  );
};

const Socials: FC<{
  setChatOpen: (open: boolean) => void;
}> = ({ setChatOpen }) => {
  return (
    <>
      <TransparentButton
        className="p-1.5"
        onClick={() => open(DISCORD_INVITE_LINK)}
      >
        <FaDiscord className="w-7 h-7" />
      </TransparentButton>
      <TransparentButton
        className="p-1.5"
        onClick={() => open("https://instagram.com/bths.action")}
      >
        <FaInstagram className="w-7 h-7" />
      </TransparentButton>
      <TransparentButton
        className="p-1.5"
        onClick={() => open("mailto:bthsaction@gmail.com")}
      >
        <BiMailSend className="w-7 h-7" />
      </TransparentButton>
      <TransparentButton className="p-1.5" onClick={() => setChatOpen(true)}>
        <MdChatBubbleOutline className="w-7 h-7" />
      </TransparentButton>
    </>
  );
};

export const Navbar: FC<PropsWithChildren> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [sideContent, setSideContent] = useState<ReactNode>();
  const [sideId, setSideId] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const socials = <Socials setChatOpen={setChatOpen} />;

  // vertical navbar
  return (
    <>
      {chatOpen && (
        <PopupUI setOpen={setChatOpen} title="Guest Chat">
          <WidgetBot
            server="1124144876112584727"
            channel="1200510746962956338"
            className="w-full h-full"
            onAPI={(api) => {
              let loggedIn = false;
              api.on("signIn", async (u) => {
                await new Promise((r) => setTimeout(r, 5000));
                if (loggedIn) return;
                loggedIn = true;
                api.emit("sendMessage", {
                  channel: "1200510746962956338",
                  message: `_**${u.username}**_ has joined the <:robux:1182796686687473785> chat! Say hi! 🎉`,
                });
              });
            }}
          />
        </PopupUI>
      )}
      <nav className="flex items-center justify-around md:justify-start md:flex-col bg-zinc-100 dark:bg-zinc-900 md:h-[100dvh] w-screen md:w-20 lg:w-60 bottom-0 py-1 md:relative absolute flex-row z-30 border-r-0 md:border-r-2 border-t-2 md:border-t-0 ">
        <Link
          href="/"
          style={{
            background: `radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)`,
          }}
          className="hidden md:inline-block my-3 rounded-full p-2 relative"
        >
          <Image
            src="/icon.png"
            alt="BTHS Action"
            width={40}
            height={40}
            className=" w-12 h-12 rounded-full"
          />
          <div className="inline-block absolute bottom-0.5 -translate-x-1/2 left-1/2 translate-y-1/2 font-poppins bold px-0.5 bg-default text-white text-sm rounded-b-lg">
            100
          </div>
        </Link>
        <div className="overflow-y-auto w-full flex-1">
          <div className="flex-row md:flex-col flex items-center justify-around md:justify-start">
            {Object.entries(NAV_LINKS).map(
              ([location, { href, icon, text }]) => (
                <NavButton
                  key={href}
                  icon={icon}
                  href={href}
                  hideSmall
                  className="lg:text-left "
                  onClick={() => {
                    setSideId("");
                  }}
                >
                  {text}
                </NavButton>
              )
            )}

            <NavButton
              icon={FaRegIdCard}
              href="/executives"
              className="hidden md:block lg:text-left "
              hideSmall
              onClick={() => {
                setSideId("");
              }}
            >
              Execs
            </NavButton>
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
                    <NavButton
                      icon={FaRegIdCard}
                      href="/executives"
                      className="block md:hidden"
                      onClick={() => {
                        setSideId("");
                      }}
                    >
                      Execs
                    </NavButton>

                    <div className="flex lg:hidden gap-1 justify-center">
                      {socials}
                    </div>
                  </>
                );
              }}
            >
              Resources
            </NavButton>
            <ThemeButton mounted={mounted} />
            <div className="hidden lg:flex gap-2 w-full text-left lg:justify-center">
              {socials}
            </div>
          </div>
        </div>
        <span className="text-xs tracking-tight p-1 hidden lg:block text-center">
          We are transparent and community driven. Find or contribute to our
          source code on{" "}
          <Link
            href="https://github.com/bths-action/website"
            className="default"
            target="_blank"
          >
            Github
          </Link>
          .
        </span>
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
          } bg-gray-50 z-50 md:border-0 md:border-r-2 border-t-2  dark:bg-zinc-900 bg-opacity-90 dark:bg-opacity-90 md:translate-x-full  right-0 top-0 translate-x-0 -translate-y-full md:translate-y-0 transition-[height,width] duration-300 ease-in-out md:overflow-hidden`}
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
          className="z-20 w-[100dvw] h-[100dvh] fixed left-0 top-0 bg-black bg-opacity-50"
          onClick={() => {
            setSideId("");
          }}
        ></div>
      )}
    </>
  );
};
