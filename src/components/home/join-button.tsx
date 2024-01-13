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
          x: "100%",
        },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            delay: 0.5,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
      }}
    >
      <ColorButton
        color="default"
        className="mt-8"
        innerClass="p-2 text-4xl text-white"
        disabled={status !== "unauthenticated"}
        onClick={() => {
          signIn("auth0");
        }}
      >
        <FaFistRaised className="inline w-8 h-8 mr-1" />{" "}
        {status === "loading"
          ? "Loading Invite..."
          : status === "unauthenticated"
          ? "Join Now!"
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
