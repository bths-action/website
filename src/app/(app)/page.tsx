import { FC } from "react";
import { Banner } from "@/components/home/banner";
import { LimitedContainer } from "@/components/ui/container";
import { Stats } from "@/components/home/stats";
import { prisma } from "@/utils/prisma";
import { JoinButton } from "@/components/home/join-button";
import { About } from "@/components/home/about";
import { StickyDown } from "@/components/home/sticky-down";
import { MemberChart } from "@/components/home/charts";

export const revalidate = 600;

const Home: FC = async () => {
  const [credits, joins, events, serviceHours, leaves] = await Promise.all([
    prisma.user
      .findMany({
        select: { givenCredits: true },
      })
      .then((users) => users.reduce((sum, user) => sum + user.givenCredits, 0)),
    prisma.user
      .findMany({
        select: { registeredAt: true },
        orderBy: {
          registeredAt: "asc",
        },
      })
      .then((users) => users.map((user) => user.registeredAt)),
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
    prisma.deletedUsers.findMany({
      select: {
        registeredAt: true,
        leftAt: true,
      },
      orderBy: {
        leftAt: "asc",
      },
    }),
  ]);

  return (
    <main className="pt-0 relative">
      <Banner />
      <LimitedContainer>
        <br />
        <About />
        <h2>Membership</h2>
        <MemberChart
          joins={[
            ...joins,
            ...leaves.map(({ registeredAt }) => registeredAt),
          ].sort((a, b) => a.getTime() - b.getTime())}
          leaves={leaves.map(({ leftAt }) => leftAt)}
        />
      </LimitedContainer>

      <StickyDown />
      <JoinButton />
      <LimitedContainer>
        <hr className="my-8" />

        <Stats
          members={joins.length}
          credits={credits}
          serviceHours={serviceHours}
          events={events}
        />
      </LimitedContainer>
    </main>
  );
};

export default Home;