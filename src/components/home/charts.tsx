"use client";
import { PRIMARY_COLOR } from "@/utils/constants";
import { useTheme } from "next-themes";
import { FC, useEffect, useMemo, useState } from "react";
import { AxisOptions, Chart } from "react-charts";

type DailyMembers = {
  date: Date;
  members: number;
};
// complete

interface Props {
  joins: Date[];
}

export const MemberChart: FC<Props> = ({ joins }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // btw we need the useEffect so that theme doesnt glitch cuz undef and stuff
  // but if we compare resolvedTheme directly it causes hydration issues
  const { resolvedTheme } = useTheme();
  const primaryAxis = useMemo(
    (): AxisOptions<DailyMembers> => ({
      getValue: (datum) => datum.date,
      hardMin: joins[0],
      hardMax: new Date(),
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<DailyMembers>[] => [
      {
        getValue: (datum) => datum.members,
      },
    ],
    []
  );

  // btw since each member increments one, we can use map index to get the number of members
  const data = [
    {
      label: "Members",
      data: [
        ...joins.map((date, index) => {
          date.setMilliseconds(0);
          return {
            date,
            members: index + 1,
          };
        }),
        {
          date: new Date(),
          members: joins.length,
        },
      ],
    },
  ];

  if (!mounted) return null;

  return (
    <div className="w-full h-[50dvh] my-4">
      <Chart
        options={{
          data,

          primaryAxis,
          primaryCursor: {
            showLabel: false,
          },
          secondaryCursor: {
            showLabel: false,
          },

          secondaryAxes,
          dark: resolvedTheme === "dark",
          showDebugAxes: false,
          defaultColors: [PRIMARY_COLOR],
          tooltip: {
            align: "auto",
            render: ({ focusedDatum }) => {
              return (
                <div className="bg-white dark:bg-zinc-900 shadowed rounded-lg bordered">
                  <p className="font-poppins font-bold p-2">
                    {focusedDatum?.originalDatum.date.toLocaleString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour12: true,
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                  </p>
                  <hr />
                  <p className="p-2">
                    <p className="h-3.5 w-3.5 rounded-full bg-default inline-block" />{" "}
                    {focusedDatum?.originalDatum.members} Members
                  </p>
                </div>
              );
            },
          },
          getDatumStyle: () => ({}),
        }}
      />
    </div>
  );
};
