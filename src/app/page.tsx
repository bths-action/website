import { FC } from "react";
import { Banner } from "@/components/home/banner";
import { LimitedContainer } from "@/components/ui/container";
import { Stats } from "@/components/home/stats";
import { prisma } from "@/utils/prisma";
import { JoinButton } from "@/components/home/join-button";

export const revalidate = 600;

const Home: FC = async () => {
  // -1 to exclude advisor
  const [members, events, serviceHours] = await Promise.all([
    prisma.user.count().then((e) => e - 1),
    prisma.event.count(),
    prisma.eventAttendance
      .findMany({
        where: {
          earnedHours: {
            gt: 0,
          },
        },
        select: {
          earnedHours: true,
        },
      })
      .then((e) => e.reduce((a, b) => a + b.earnedHours, 0)),
  ]);

  return (
    <main className="pt-0">
      <Banner />
      <LimitedContainer>
        <p className="text-2xl">
          Welcome to Action! Our goal is to revolutionize and redefine the
          volunteer sector of Brooklyn Tech. In this world of inflation and
          economic troubles, we pursue a modern, equal, worker-oriented, and
          diverse club without the wallet and the inequalities.
          <br />
          Money is NOT the solution to everything. We, the workers, are the
          solution.
        </p>

        <br />
        <JoinButton />
        <hr className="my-8" />
        <Stats members={members} serviceHours={serviceHours} events={events} />
      </LimitedContainer>
    </main>
  );
};

export default Home;
