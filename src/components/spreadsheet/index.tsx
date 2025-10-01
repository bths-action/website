"use client";
import { trpc } from "@/app/(api)/api/trpc/client";
import { useAccount } from "@/providers/account";
import {
  MAX_REFERRALS,
  NodeMap,
  REFERRAL_POINTS,
  Status,
} from "@/utils/constants";
import { useSession } from "next-auth/react";
import { FC, useRef } from "react";
import { Loading } from "../ui/loading";
import { RequestError } from "../ui/error";
import { MdWarning } from "react-icons/md";
import { FaRegIdCard } from "react-icons/fa";
import { confirm } from "../ui/confirm";
import { BackupButton } from "./backup";
import { GiveCreditsButton } from "./give-credits";

export const Spreadsheet: FC = () => {
  const utils = trpc.useUtils();
  const editCredits = trpc.editCredits.useMutation();
  const { status } = useSession();
  const account = useAccount();
  const query = trpc.getSpreadsheet.useQuery();

  const fetchStatus: Status =
    query.status === "pending" ||
    account.status === "pending" ||
    status === "loading"
      ? "loading"
      : status == "unauthenticated" ||
        account.data == null ||
        account.data.position == "MEMBER"
      ? "unauthorized"
      : query.status === "success"
      ? "success"
      : "error";

  const heading: NodeMap<Status> = {
    loading: "Loading",
    unauthorized: "Unauthorized",
    success: "Credits Spreadsheet Manager",
    error: "Error",
  };

  const inputRef = useRef<Record<string, HTMLInputElement>>({});

  const body: NodeMap<Status> = {
    loading: (
      <>
        <Loading
          loadingType="bar"
          spinnerProps={{
            height: 10,
            width: 800,
          }}
        >
          Loading Credits List...
        </Loading>
      </>
    ),
    unauthorized: (
      <>
        <h5>You are unauthorized to view this page.</h5>
      </>
    ),
    success: (
      <div className="overflow-auto">
        {query.data && fetchStatus == "success" && (
          <>
            <h6>
              Executives, always back up a spare spreadsheet in the event the
              code fails.
            </h6>
            <div className="flex gap-2 justify-center">
              <BackupButton data={query.data} />
              <GiveCreditsButton data={query.data} inputRef={inputRef} />
            </div>{" "}
            <FaRegIdCard className="inline-block ml-4 mr-2" /> indicates that
            the user is an executive, therefore able to recieve in full every
            time.
            <table className="max-w-fit m-auto block overflow-auto h-[80dvh]">
              <thead className="sticky top-0 dark:bg-zinc-800 bg-gray-200 text-sm">
                <tr>
                  <th>Given Credits</th>
                  <th>Email</th>
                  <th>Total</th>
                  <th>Name</th>
                  <th>Grad Year</th>
                  <th>Prefect</th>
                  <th>Misc Points</th>
                  <th>Referral Points</th>
                  {query.data.events.map((event) => {
                    return <th key={event.id}>{event.name}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {query.data.users.map((user) => {
                  const total =
                    user.miscPoints +
                    user.refCount * REFERRAL_POINTS +
                    Object.values(user.events).reduce(
                      (acc, event) => acc + event,
                      0
                    );
                  return (
                    <tr
                      key={user.email}
                      className="hover:bg-gray-100 hover:dark:bg-zinc-900 border-t-2 "
                    >
                      <td className="px-4 whitespace-nowrap py-1">
                        <input
                          className="w-16"
                          defaultValue={user.givenCredits}
                          type="number"
                          ref={(ref) => {
                            inputRef.current[user.email] = ref!;
                          }}
                          onBlur={async () => {
                            const oldCredits = user.givenCredits;
                            if (
                              inputRef.current[user.email].valueAsNumber !==
                                oldCredits &&
                              (await confirm({
                                title: "Confirm",
                                children: `(DO NOT DO THIS IF YOU ARE GIVING CREDITS EVERY SEMESTER. This is only for if the system made some mistake or something, which should not happen.) Are you sure you want to set ${
                                  user.name
                                }'s credits to ${
                                  inputRef.current[user.email].valueAsNumber
                                }? `,
                              }))
                            ) {
                              editCredits.mutate(
                                {
                                  email: user.email,
                                  credits:
                                    inputRef.current[user.email]
                                      .valueAsNumber || 0,
                                },
                                {
                                  onSuccess: () => {
                                    utils.getSpreadsheet.setData(undefined, {
                                      ...query.data,
                                      users: query.data.users.map((u) => {
                                        if (u.email == user.email) {
                                          u.givenCredits =
                                            inputRef.current[user.email]
                                              .valueAsNumber || 0;
                                        }
                                        return u;
                                      }),
                                    });
                                  },
                                  onError: () => {
                                    inputRef.current[user.email].valueAsNumber =
                                      oldCredits;
                                  },
                                }
                              );
                            } else {
                              inputRef.current[user.email].valueAsNumber =
                                oldCredits;
                            }
                          }}
                        />
                      </td>
                      <td className="px-4 whitespace-nowrap">
                        {user.position == "EXEC" && (
                          <FaRegIdCard className="inline-block mr-2" />
                        )}
                        {user.email}
                      </td>
                      <td className="px-16">{total}</td>
                      <td className="px-4  whitespace-nowrap">{user.name}</td>
                      <td className="px-4">{user.gradYear}</td>
                      <td className="px-4">{user.prefect}</td>
                      <td className="px-8">{user.miscPoints}</td>
                      <td className="px-8">
                        {Math.min(user.refCount, MAX_REFERRALS) *
                          REFERRAL_POINTS}
                      </td>
                      {query.data.events.map((event) => {
                        return (
                          <td key={event.id} className="px-24">
                            {user.events[event.id] || 0}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    ),
    error: (
      <>
        {query.status === "error" && <RequestError error={query.error} />}
        {account.status === "error" && <RequestError error={account.error} />}
      </>
    ),
  };

  return (
    <div>
      <h1 className="break-all">{heading[fetchStatus]}</h1>
      {body[fetchStatus]}
    </div>
  );
};
