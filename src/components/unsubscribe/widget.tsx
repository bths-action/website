"use client";
import { FC, useEffect, useState } from "react";
import { TransparentButton } from "../ui/buttons";
import { trpc, TRPCError } from "@/app/api/trpc/client";
import { confirm } from "../ui/confirm";
import { RequestError } from "../ui/error";
import Link from "next/link";

export const UnsubscribeWidget: FC = () => {
  const [subscribed, setSubscribed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const editSubscription = trpc.editSubscription.useMutation();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [subscribed]);

  return (
    <div>
      {subscribed ? (
        <h5>Do you want to unsubscribe?</h5>
      ) : (
        <div>
          You have successfully unsubscribed from event alerts. Would you like
          to subscribe again?
        </div>
      )}

      <TransparentButton
        type="button"
        className="px-2 bordered"
        disabled={timeLeft > 0 || loading}
        onClick={async () => {
          setLoading(true);
          try {
            const data = await editSubscription.mutateAsync({
              subscribed: !subscribed,
            });
            await confirm({
              title: "Success",
              children: (
                <div>
                  You have{" "}
                  {subscribed ? "unsubscribed from " : "subscribed to "}
                  event alerts.
                </div>
              ),
            });
            setSubscribed(data.eventAlerts);
          } catch (e) {
            confirm({
              title: "Error",
              children: <RequestError error={e as TRPCError} />,
            });
          } finally {
            setLoading(false);
          }
        }}
      >
        {timeLeft > 0 ? (
          `Confirm in ${timeLeft}`
        ) : (
          <>
            {subscribed ? "Uns" : "S"}ubscrib{loading ? "ing" : "e"}
          </>
        )}
      </TransparentButton>
      <br />

      <TransparentButton className="bordered mt-2">
        <Link href="/" className="px-2">
          {" "}
          Return Home
        </Link>
      </TransparentButton>
    </div>
  );
};
