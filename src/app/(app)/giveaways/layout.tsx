"use client";

import { trpc } from "@/app/(api)/api/trpc/client";
import { FC, PropsWithChildren } from "react";
import { BsTicketPerforated } from "react-icons/bs";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { data, status } = trpc.getEntryBalance.useQuery();

  return (
    <div className="relative w-full text-right -mt-12">
      <span className="z-20 sticky inline-block top-2 shadowed right-2 bg-gradient-to-r from-yellow-200 to-amber-400 text-yellow-800 p-2 rounded-lg shadowed">
        <BsTicketPerforated className="inline w-8 h-8 mr-2" /> Tickets:{" "}
        {status == "loading" ? "..." : data?.entries || 0}
      </span>
      <span className="text-center ">{children}</span>
    </div>
  );
};

export default Layout;
