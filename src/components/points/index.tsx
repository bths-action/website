"use client";
import { trpc } from "@/app/(api)/api/trpc/client";
import { useAccount } from "@/providers/account";
import { NodeMap, Status } from "@/utils/constants";
import { signIn, useSession } from "next-auth/react";
import { FC } from "react";
import { RequestError } from "../ui/error";
import { Loading } from "../ui/loading";
import { ColorButton } from "../ui/buttons";
import { BiLogIn } from "react-icons/bi";
import { PointsStats } from "./stats";

export const Points: FC = () => {
  const account = useAccount();
  const data = trpc.getStats.useQuery();
  const { status } = useSession();

  const loadingStatus: Status =
    account.status === "error" || data.status === "error"
      ? status === "authenticated"
        ? "error"
        : status === "unauthenticated"
        ? "unauthorized"
        : "loading"
      : account.status === "loading" || data.status === "loading"
      ? "loading"
      : "success";

  const body: NodeMap<Status> = {
    error: (
      <>
        <h3>Error</h3>
        There was an error loading your points. <br />
        {data.isError && <RequestError error={data.error} />}
        {account.isError && <RequestError error={account.error} />}
      </>
    ),
    loading: (
      <>
        <Loading
          loadingType="bar"
          spinnerProps={{
            width: "80%",
            height: "10px",
          }}
        >
          Loading your points & hours...
        </Loading>
      </>
    ),
    unauthorized: (
      <>
        <h3>Unauthorized</h3>
        You must be logged in to view your points & hours.
        <br />
        <ColorButton
          color="default"
          innerClass="p-2 text-xl text-white rounded-xl"
          onClick={() => signIn("auth0")}
        >
          <BiLogIn className="inline w-6 h-6 mr-1" />
          Sign In
        </ColorButton>
      </>
    ),
    success: (
      <>
        {account.data && data.data && (
          <PointsStats account={account.data} data={data.data} />
        )}
      </>
    ),
  };

  return <div>{body[loadingStatus]}</div>;
};
