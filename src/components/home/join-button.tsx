"use client";
import { signIn, useSession } from "next-auth/react";
import { FC } from "react";
import { FaFistRaised } from "react-icons/fa";
import { ColorButton } from "../ui/buttons";
import Link from "next/link";
import { motion } from "framer-motion";

export const JoinButton: FC = () => {
  const { status } = useSession();
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
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 1,
      }}
    >
      <ColorButton
        color="default"
        className={`mt-4 shadowed  ${
          status == "unauthenticated" ? "animate-pulse" : ""
        }`}
        innerClass="p-4 text-xl text-white "
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
      {status === "authenticated" && (
        <div>
          You can check out our{" "}
          <Link href="/events" className="default">
            events
          </Link>{" "}
          and start earning. Welcome!
        </div>
      )}
    </motion.div>
  );
};
