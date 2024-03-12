import { FC } from "react";
import { BsDiscord } from "react-icons/bs";
import { MdOutlineLink, MdOutlineLinkOff } from "react-icons/md";
import Image from "next/image";

export const ConnectedBanner: FC = () => (
  <div className="flex flex-col max-w-full w-96 h-40 relative justify-center items-center flex-nowrap">
    <Image
      src="/icon.png"
      width={128}
      height={128}
      alt=""
      className="rounded-full w-32 h-32 bordered absolute left-1"
    />

    <MdOutlineLink className="w-16 h-16 xxs:block hidden absolute left-1/2 -translate-x-1/2" />
    <span className="w-32 h-32 block rounded-full bordered bg-[#5865f2] text-white mr-0  absolute right-1 bordered">
      <BsDiscord className=" w-32 h-32 p-8  " />
    </span>
  </div>
);

export const DisconnectedBanner: FC = () => (
  <div className="flex flex-col max-w-full w-96 h-40 relative justify-center items-center flex-nowrap">
    <Image
      src="/icon.png"
      width={128}
      height={128}
      alt=""
      className="rounded-full w-32 h-32 bordered absolute left-1"
    />

    <MdOutlineLinkOff className="w-16 h-16 xxs:block hidden absolute left-1/2 -translate-x-1/2" />
    <span className="w-32 h-32 block rounded-full bordered bg-[#5865f2] text-white mr-0  absolute right-1 bordered">
      <BsDiscord className=" w-32 h-32 p-8  " />
    </span>
  </div>
);
