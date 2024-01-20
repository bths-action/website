"use client";
import { GetSpreadsheetOutput } from "@/app/api/trpc/client";
import { FC } from "react";
import { ColorButton } from "../ui/buttons";
import { MdOutlineBackup } from "react-icons/md";

export const BackupButton: FC<{
  data: GetSpreadsheetOutput;
}> = ({ data }) => {
  return (
    <ColorButton
      color="default"
      innerClass="p-2 text-white"
      onClick={async () => {
        // download as csv
        let string =
          "Given Credits,Email,Total,Name,Grad Year,Prefect,Misc Points,Referral Points," +
          data.events.map((event) => event.name).join(",") +
          "\n";

        data.users.forEach((user) => {
          const total =
            user.miscPoints +
            user.refCount * 5 +
            Object.values(user.events).reduce((acc, event) => acc + event, 0);
          string += `${user.givenCredits},${user.email},${total},${user.name},${
            user.gradYear
          },${user.prefect},${user.miscPoints},${user.refCount * 5}`;
          data.events.forEach((event) => {
            string += `,${user.events[event.id] || 0}`;
          });
          string += "\n";
        });

        console.log(string);

        const blob = new Blob([string], {
          type: "text/csv",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);
        a.href = url;
        a.download = "credits-backup.csv";
        a.click();
        URL.revokeObjectURL(url);
      }}
    >
      <MdOutlineBackup className="mr-1 w-6 h-6" /> Backup Current Sheet
    </ColorButton>
  );
};
