import { FC } from "react";
import { Banner } from "@/components/home/banner";
import { LimitedContainer } from "@/components/ui/container";
import { Stats } from "@/components/home/stats";
import { prisma } from "@/utils/prisma";
import { JoinButton } from "@/components/home/join-button";
import { About } from "@/components/home/about";
import { StickyDown } from "@/components/home/sticky-down";

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
    <main className="pt-0 relative">
      <Banner />
      <LimitedContainer>
        <br />
        <About />
      </LimitedContainer>
      <StickyDown />
      <JoinButton />
      <LimitedContainer>
        <hr className="my-8" />

        <Stats members={members} serviceHours={serviceHours} events={events} />
      </LimitedContainer>
    </main>
  );
};

export default Home;
