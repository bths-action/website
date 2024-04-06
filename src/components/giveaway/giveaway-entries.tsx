import { FC, useState } from "react";
import { Props } from "./giveaway-page";
import { trpc } from "@/app/(api)/api/trpc/client";
import { signIn, useSession } from "next-auth/react";
import { useAccount } from "@/providers/account";
import { Loading } from "../ui/loading";
import { ColorButton } from "../ui/buttons";
import { BiLogIn, BiParty } from "react-icons/bi";
import { RequestError } from "../ui/error";
import { confirm } from "../ui/confirm";

export const GiveawayEntries: FC<Props> = ({ giveaway }) => {
  const { status } = useSession();
  const account = useAccount();
  const entry = trpc.getGiveawayEntry.useQuery({ id: giveaway.id });
  const joinGiveaway = trpc.enterGiveaway.useMutation();
  const leaveGiveaway = trpc.leaveGiveaway.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = trpc.useUtils();

  return (
    <div>
      <h4>Giveaway Entries:</h4>
      {entry.status === "loading" ||
      status === "loading" ||
      account.status === "loading" ? (
        <Loading
          loadingType="bar"
          spinnerProps={{
            width: "80%",
            height: "10px",
          }}
        >
          <h5>Loading Giveaway Entries...</h5>
        </Loading>
      ) : status == "unauthenticated" ||
        (account.status == "success" && account.data === null) ? (
        <>
          <h5>
            You must be logged in and registered to view and edit giveaway
            entries.
          </h5>
          <ColorButton
            color="default"
            className="rounded-xl shadowed"
            innerClass="p-2 text-xl text-white"
            onClick={() => signIn("auth0")}
          >
            <BiLogIn className="inline w-6 h-6 mr-1" />
            Sign In
          </ColorButton>
        </>
      ) : entry.error ? (
        <RequestError error={entry.error} />
      ) : !entry.data ? (
        <>
          <h5>You have not joined the giveaway.</h5>
          {giveaway.endsAt > new Date() ? (
            <ColorButton
              color="default"
              className="rounded-xl shadowed"
              innerClass="p-2 text-xl text-white"
              onClick={() => {
                setIsSubmitting(true);
                joinGiveaway.mutate(
                  { id: giveaway.id },
                  {
                    onSettled: (data) => {
                      setIsSubmitting(false);
                      utils.getGiveawayEntry.setData(
                        {
                          id: giveaway.id,
                        },
                        data
                      );
                    },
                    onError: (error) => {
                      confirm({
                        title: "Error Joining Giveaway",
                        children: (
                          <>
                            We have encountered an error while joining the
                            giveaway.
                            <br />
                            <RequestError error={error} />
                          </>
                        ),
                      });
                    },
                  }
                );
              }}
            >
              <BiParty className="inline w-6 h-6 mr-1" /> Join
              {isSubmitting && "ing"} Giveaway
            </ColorButton>
          ) : (
            <>The giveaway has ended.</>
          )}
        </>
      ) : (
        <>
          <h5>You have joined the giveaway.</h5>
          {giveaway.endsAt > new Date() ? (
            <ColorButton
              color="default"
              className="rounded-xl shadowed"
              innerClass="p-2 text-xl text-white"
              onClick={() => {
                setIsSubmitting(true);
                leaveGiveaway.mutate(
                  { id: giveaway.id },
                  {
                    onSettled: () => {
                      setIsSubmitting(false);
                      utils.getGiveawayEntry.setData(
                        {
                          id: giveaway.id,
                        },
                        null
                      );
                    },
                    onError: (error) => {
                      confirm({
                        title: "Error Leaving Giveaway",
                        children: (
                          <>
                            We have encountered an error while leaving the
                            giveaway.
                            <br />
                            <RequestError error={error} />
                          </>
                        ),
                      });
                    },
                  }
                );
              }}
            >
              <BiParty className="inline w-6 h-6 mr-1" /> Leav
              {isSubmitting ? "ing" : "e"} Giveaway
            </ColorButton>
          ) : (
            <>The giveaway has ended.</>
          )}
        </>
      )}
    </div>
  );
};
