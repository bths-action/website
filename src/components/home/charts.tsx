"use client";
import { PRIMARY_COLOR } from "@/utils/constants";
import { useInView } from "motion/react";
import { useTheme } from "next-themes";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { AxisOptions, Chart } from "react-charts";

type DailyMembers = {
  date: Date;
  members: number;
};

interface Props {
  leaves: Date[];
  joins: Date[];
}

function calcMembers(joins: Date[], leaves: Date[]) {
  const dataPoints: DailyMembers[] = [];
  let i = 0;
  let j = 0;
  let members = 0;
  while (i < joins.length && j < leaves.length) {
    if (joins[i] < leaves[j]) {
      members++;
      dataPoints.push({ date: joins[i], members });
      i++;
    } else {
      members--;
      dataPoints.push({ date: leaves[j], members });
      j++;
    }
  }
  while (i < joins.length) {
    members++;
    dataPoints.push({ date: joins[i], members });
    i++;
  }
  while (j < leaves.length) {
    members--;
    dataPoints.push({ date: leaves[j], members });
    j++;
  }

  // NEW: Extend the line to "now" so it doesn't stop at the last event
  const now = new Date();
  if (dataPoints.length > 0) {
    const lastDate = dataPoints[dataPoints.length - 1].date;
    // Only add if the last event wasn't exactly now (to avoid duplicate points)
    if (now.getTime() > lastDate.getTime()) {
      dataPoints.push({ date: now, members });
    }
  }

  return dataPoints;
}

export const MemberChart: FC<Props> = ({ joins, leaves }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 1,
  });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { resolvedTheme } = useTheme();
  
  const primaryAxis = useMemo(
    (): AxisOptions<DailyMembers> => ({
      getValue: (datum) => datum.date,
      hardMin: joins[0],
      // REMOVED: hardMax: new Date(), 
      // (Letting it auto-scale to the data is safer now that we inject "now" into the data)
    }),
    [joins]
  );

  const dataPoints = useMemo(() => calcMembers(joins, leaves), [joins, leaves]);

  const secondaryAxes = useMemo(
    (): AxisOptions<DailyMembers>[] => [
      {
        getValue: (datum) => datum.members,
      },
    ],
    []
  );

  return (
    <div className="w-full h-[50dvh] my-10 z-10" ref={ref}>
      {mounted && (
        <Chart
          options={{
            data: [
              {
                label: "Members",
                // UPDATED: Just use dataPoints directly, no manual spread needed
                data: dataPoints,
              },
            ],

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
            getSeriesStyle: () => ({
              strokeDashoffset: isInView ? 0 : "160%",
              transition: "stroke-dashoffset 5s ease-in-out",
              strokeDasharray: "160%",
            }),

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
                      <span className="h-3.5 w-3.5 rounded-full bg-default inline-block" />{" "}
                      {focusedDatum?.originalDatum.members} Members
                    </p>
                  </div>
                );
              },
            },
          }}
        />
      )}
    </div>
  );
};