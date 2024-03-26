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
      className={`${
        status == "unauthenticated" ? "sticky bottom-4" : ""
      } pointer-events-none mt-4 transition-transform duration-1000 ${
        status !== "loading" ? "scale-100" : "scale-0"
      }`}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 1,
      }}
    >
      <span
        className={`bg-white dark:bg-black rounded-full inline-block ${
          status == "unauthenticated" ? "animate-bounce" : ""
        }`}
      >
        <ColorButton
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
      </span>

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
