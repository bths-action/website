import { LimitedContainer } from "@/components/ui/container";
import { FC } from "react";
import { prisma } from "@/utils/prisma";
import { ExecPosition } from "@prisma/client";
import { ExecCard } from "@/components/execs/exec-card";
import { isAlumni } from "@/utils/helpers";

export const revalidate = 60;
export const metadata = {
  title: "Executives",
  description: "Check out our executives!",
};

const Page: FC = async () => {
  const data = (
    await prisma.execDetails.findMany({
      include: {
        user: {
          select: {
            name: true,
            preferredName: true,
            pronouns: true,
            gradYear: true,
          },
        },
      },
    })
  ).sort(function compareModels(a, b) {
    // if exec is old exec after july 1st, put them at the end
    const aAlumni = isAlumni(a.user.gradYear);
    const bAlumni = isAlumni(b.user.gradYear);
    if (aAlumni && !bAlumni) {
      return 1;
    } else if (!aAlumni && bAlumni) {
      return -1;
    }
    const positions: {
      [key in ExecPosition | "undefined"]: number;
    } = {
      PRESIDENT: 1,
      VICE_PRESIDENT: 2,
      SECRETARY: 3,
      TREASURER: 4,
      EVENT_COORDINATOR: 5,
      undefined: 6,
    };

    // Compare positions first
    const positionComparison =
      positions[String(a.position) as ExecPosition] -
      positions[String(b.position) as ExecPosition];

    if (positionComparison !== 0) {
      return positionComparison;
    }

    // If positions are the same, compare names
    return a.user.name.localeCompare(b.user.name);
  });

  return (
    <main>
      <LimitedContainer>
        <h1>Executives</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start auto-rows-max">
          {data.map((exec, index) => (
            <ExecCard exec={exec} key={exec.email} index={index} />
          ))}
        </div>
      </LimitedContainer>
    </main>
  );
};

export default Page;
