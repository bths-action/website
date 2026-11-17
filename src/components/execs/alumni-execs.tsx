"use client";
import { GetExecsOutput } from "@/app/(api)/api/trpc/client";
import { FC, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { Collapse } from "../ui/collapse";
import { TransparentButton } from "../ui/buttons";
import { ExecCard } from "./exec-card";

type Exec = GetExecsOutput[number];

export const AlumniExecs: FC<{ execs: Exec[] }> = ({ execs }) => {
  const [open, setOpen] = useState(false);

  if (execs.length === 0) return null;

  return (
    <section className="mt-8">
      <TransparentButton
        className="flex items-center gap-2 w-full p-2 border-t-2 border-b-2"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <BiChevronDown
          className={`w-6 h-6 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
        <span className="text-2xl">Alumni Execs ({execs.length})</span>
      </TransparentButton>
      <Collapse collapsed={!open}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start auto-rows-max pt-4">
          {execs.map((exec, index) => (
            <ExecCard exec={exec} key={exec.email} index={index} />
          ))}
        </div>
      </Collapse>
    </section>
  );
};
