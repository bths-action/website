"use client";
import { useAccount } from "@/providers/account";
import { NodeMap, Status } from "@/utils/constants";
import { signIn, useSession } from "next-auth/react";
import { FC } from "react";
import { Loading } from "../ui/loading";
import { BiLogIn } from "react-icons/bi";
import { ColorButton } from "../ui/buttons";
import { RequestError } from "../ui/error";
import { UnsubscribeWidget } from "./widget";

export const Unsubscribe: FC = () => {
  const { status } = useSession();
  const account = useAccount();

  const fetchStatus: Status =
    status === "loading" || account.status === "loading"
      ? "loading"
      : status == "unauthenticated" || account.data == null
      ? "unauthorized"
      : account.status === "success"
      ? "success"
      : "error";

  const bodyMap: NodeMap<Status> = {
    loading: (
      <Loading
        loadingType="bar"
        spinnerProps={{
          height: 10,
          width: 800,
        }}
      >
        Loading...
      </Loading>
    ),
    unauthorized: (
      <>
        <h5>You need to be a registered club member to access this page.</h5>
        <ColorButton
          color="default"
          innerClass="p-2 text-xl text-white rounded-xl"
          onClick={() => signIn("auth0")}
        >
          {fetchStatus == "unauthorized" && status === "unauthenticated" ? (
            <>
              <BiLogIn className="inline w-6 h-6 mr-1" />
              Sign In
            </>
          ) : (
            <>Please complete the club form.</>
          )}
        </ColorButton>
      </>
    ),
    error: (
      <>
        An error occured.
        <br />
        {account.error && <RequestError error={account.error} />}
      </>
    ),
    success: (
      <>
        <UnsubscribeWidget />
      </>
    ),
  };

  return <>{bodyMap[fetchStatus]}</>;
};
