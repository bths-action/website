"use client";
import { signIn, useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { FaFistRaised } from "react-icons/fa";
import { ColorButton } from "../ui/buttons";
import Link from "next/link";
import { motion } from "motion/react";

export const JoinButton: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
        },
      }}
      className={`${
        status == "unauthenticated" && mounted ? "sticky bottom-0" : ""
      } pointer-events-none mt-4 p-4 transition-transform duration-1000 ${
        status !== "loading" && mounted ? "scale-100" : "scale-0"
      }`}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 1,
      }}
    >
      <span
        className={`${
          status == "unauthenticated" && mounted ? "animate-bounce" : ""
        }`}
      >
        {status !== "authenticated" && (
          <ColorButton
            id="join-button"
            color="default"
            className="shadowed"
            innerClass="p-4 text-xl text-white pointer-events-auto"
            disabled={status !== "unauthenticated"}
            onClick={() => {
              signIn("auth0");
            }}
          >
            <FaFistRaised className="inline w-6 h-6 mr-2" />{" "}
            {status === "loading"
              ? "Loading Invite..."
              : status === "unauthenticated"
              ? "Take Action."
              : "Welcome to the Family!"}
          </ColorButton>
        )}
      </span>

      {status === "authenticated" && (
        <div className="pointer-events-auto">
          Check out our{" "}
          <Link href="/events" className="default">
            events!
          </Link>{" "}
          Welcome!
        </div>
      )}
    </motion.div>
  );
};
