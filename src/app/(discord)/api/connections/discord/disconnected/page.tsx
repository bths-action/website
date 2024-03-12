"use client";
import { DisconnectedBanner } from "@/components/discord";
import { FC, useEffect, useState } from "react";

const Success: FC = () => {
  const [timeLeft, setTimeLeft] = useState(3);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!window.opener) location.assign("/");
    else setShow(true);
    const timeout = setTimeout(() => {
      if (timeLeft === 0) {
        window.close();
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [timeLeft]);
  if (!show) return null;
  return (
    <>
      <DisconnectedBanner />
      <main>
        <h1>Successfully Disconnected your Account</h1>
        <p>
          You have successfully disconnected your account from discord. This
          window will close in {timeLeft} seconds. (Or you can close the window
          LOL)
        </p>
      </main>
    </>
  );
};

export default Success;
