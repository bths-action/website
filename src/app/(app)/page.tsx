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
  const [joins, events, serviceHours] = await Promise.all([
    prisma.user
      .findMany({
        where: {
          email: {
            not: process.env.ADVISOR_EMAIL,
          },
        },
        select: { registeredAt: true },

        orderBy: {
          registeredAt: "asc",
        },
      })
      .then((users) => users.map((user) => user.registeredAt)), // now lets try to examine react chart
    // https://react-charts.tanstack.com/ feel free to examine the docs (cuz I have too as well)
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
        <h2>Membership</h2>
        <MemberChart joins={joins} />
      </LimitedContainer>

      <StickyDown />
      <JoinButton />
      <LimitedContainer>
        <hr className="my-8" />

        <Stats
          members={joins.length}
          serviceHours={serviceHours}
          events={events}
        />
      </LimitedContainer>
    </main>
  );
};

export default Home;
