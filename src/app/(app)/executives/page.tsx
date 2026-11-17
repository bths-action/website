import { LimitedContainer } from "@/components/ui/container";
import { FC } from "react";
import { prisma } from "@/utils/prisma";
import { ExecPosition } from "@prisma/client";
import { ExecCard } from "@/components/execs/exec-card";
import { AlumniExecs } from "@/components/execs/alumni-execs";
import { isAlumni } from "@/utils/helpers";

export const revalidate = 60;
export const metadata = {
  title: "Executives",
  description: "Check out our executives!",
};

const Page: FC = async () => {
  // Execs are created without exec details, so fill in any missing rows before
  // querying. This also covers members promoted outside the manage members UI.
  const missing = await prisma.user.findMany({
    where: { position: "EXEC", execDetails: { is: null } },
    select: { email: true },
  });

  if (missing.length > 0) {
    await prisma.execDetails.createMany({
      data: missing.map(({ email }) => ({ email })),
      skipDuplicates: true,
    });
  }

  const data = (
    await prisma.execDetails.findMany({
      where: { user: { position: "EXEC" } },
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
      [key in ExecPosition]: number;
    } = {
      PRESIDENT: 1,
      VICE_PRESIDENT: 2,
      SECRETARY: 3,
      TREASURER: 4,
      EVENT_COORDINATOR: 5,
    };

    const positionRank = (position: ExecPosition | null) =>
      position ? positions[position] : 6;

    // Compare positions first
    const positionComparison =
      positionRank(a.position) - positionRank(b.position);

    if (positionComparison !== 0) {
      return positionComparison;
    }

    // If positions are the same, compare names
    return (a.user.name ?? "").localeCompare(b.user.name ?? "");
  });

  const currentExecs = data.filter((exec) => !isAlumni(exec.user.gradYear));
  const alumniExecs = data.filter((exec) => isAlumni(exec.user.gradYear));

  return (
    <main>
      <LimitedContainer>
        <h1>Executives</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start auto-rows-max">
          {currentExecs.map((exec, index) => (
            <ExecCard exec={exec} key={exec.email} index={index} />
          ))}
        </div>
        {currentExecs.length === 0 && (
          <p>No current executives are listed yet.</p>
        )}
        <AlumniExecs execs={alumniExecs} />
      </LimitedContainer>
    </main>
  );
};

export default Page;
