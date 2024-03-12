"use client";
import { ConnectedBanner } from "@/components/discord";
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
      <ConnectedBanner />
      <main>
        <h1>Discord Auth Success</h1>
        <p>
          Authentication success! Window will close in {timeLeft} seconds. (Or
          you can close the window LOL)
        </p>
      </main>
    </>
  );
};

export default Success;
