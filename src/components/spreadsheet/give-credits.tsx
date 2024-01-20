"use client";
import { GetSpreadsheetOutput, trpc, TRPCError } from "@/app/api/trpc/client";
import { FC, RefObject, useState } from "react";
import { ColorButton } from "../ui/buttons";
import { MAX_CREDITS } from "@/utils/constants";
import { BsAward } from "react-icons/bs";
import { confirm } from "../ui/confirm";
import { RequestError } from "../ui/error";

export const GiveCreditsButton: FC<{
  data: GetSpreadsheetOutput;
  inputRef: RefObject<Record<string, HTMLInputElement>>;
}> = ({ data, inputRef }) => {
  const utils = trpc.useUtils();
  const [progress, setProgress] = useState<number | null>(null);
  const editCredits = trpc.editCredits.useMutation();

  return (
    <ColorButton
      color="default"
      innerClass="p-2 text-white"
      onClick={async () => {
        setProgress(0);
        // download as csv
        let string =
          "CREDITS TO BE SUBMITTED,Past Credits,Email,Total,Name,Grad Year,Prefect,Misc Points,Referral Points," +
          data.events.map((event) => event.name).join(",") +
          "\n";

        if (
          !(await confirm({
            title: "Backup Notice",
            children:
              "Did you backup the credits in case the network fails? If not, press cancel and do so now.",
          }))
        ) {
          setProgress(null);
          return;
        }

        const credits =
          parseInt(
            prompt(
              "How many credits max do you want to give?",
              MAX_CREDITS.toString()
            ) || ""
          ) || MAX_CREDITS;

        for (const user of data.users) {
          const total =
            user.miscPoints +
            user.refCount * 5 +
            Object.values(user.events).reduce((acc, event) => acc + event, 0);
          const awarded =
            user.position === "EXEC"
              ? credits
              : user.didOsis
              ? Math.max(
                  Math.min(credits, Math.ceil(total / 25 - user.givenCredits)),
                  0
                )
              : 0;
          if (awarded !== 0) {
            try {
              await editCredits.mutateAsync({
                email: user.email,
                credits: awarded + user.givenCredits,
              });
              if (inputRef.current?.[user.email])
                inputRef.current[user.email].valueAsNumber =
                  awarded + user.givenCredits;
            } catch (e) {
              confirm({
                title: "Error",
                children: (
                  <>
                    There was an error giving credits. Please use the backup to
                    restore everything back to its original state.
                    <br />
                    {e && <RequestError error={e as TRPCError} />}
                  </>
                ),
              });
              setProgress(null);
              return;
            }
          }
          setProgress((prev) => (prev || 0) + 1);
          string += `${awarded},${user.givenCredits},${user.email},${total},${
            user.name
          },${user.gradYear},${user.prefect},${user.miscPoints},${
            user.refCount * 5
          }`;
          data.events.forEach((event) => {
            string += `,${user.events[event.id] || 0}`;
          });
          string += "\n";
        }

        console.log(string);

        const blob = new Blob([string], {
          type: "text/csv",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);
        a.href = url;
        a.download = "awarded-credits.csv";
        a.click();
        URL.revokeObjectURL(url);
        setProgress(null);
      }}
      disabled={progress !== null}
    >
      <BsAward className="inline w-6 h-6 mr-1" /> Giv
      {progress !== null ? "ing" : "e"} Credits{" "}
      {progress !== null && `(${progress}/${data.users.length})`}
    </ColorButton>
  );
};
