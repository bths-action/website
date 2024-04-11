"use client";
import { Giveaway } from "@prisma/client";
import Image from "next/image";
import { FC, useEffect, useRef } from "react";
import SlotCounter, { SlotCounterRef } from "react-slot-counter";

export const GiveawayBanner: FC<{
  date: Date | null;
  giveaway: Giveaway;
}> = ({ date, giveaway }) => {
  const diff = Math.round(
    date ? giveaway.endsAt.getTime() - date.getTime() : 0
  );

  const countRef = useRef<SlotCounterRef[]>([]);

  useEffect(() => {
    const handleResize = () => {
      countRef.current.forEach((el) => {
        el.refreshStyles();
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-[100dvh] flex items-center relative justify-center flex-col mb-4">
      <Image
        src={giveaway.imageURL || "/images/giveaway.jpg"}
        alt={giveaway.name}
        className="-z-40 object-cover"
        fill
      />
      <div className="inline-block bg-black bg-opacity-50 backdrop-blur-sm text-white m-2 p-2 rounded-xl">
        <h2 className="break-all">{giveaway.name}</h2>
        <h4 className="inline-block font-space-mono h-10 max-w-md">
          {date ? (
            date < giveaway.endsAt ? (
              <>
                Ends in{" "}
                <SlotCounter
                  ref={(el) => {
                    if (el) {
                      countRef.current.push(el);
                    }
                  }}
                  useMonospaceWidth
                  value={Math.floor(diff / 86400000)}
                  sequentialAnimationMode
                />
                d,{" "}
                <SlotCounter
                  ref={(el) => {
                    if (el) {
                      countRef.current.push(el);
                    }
                  }}
                  useMonospaceWidth
                  value={Math.floor((diff % 86400000) / 3600000)
                    .toString()
                    .padStart(2, "0")}
                  sequentialAnimationMode
                />
                h,{" "}
                <SlotCounter
                  ref={(el) => {
                    if (el) {
                      countRef.current.push(el);
                    }
                  }}
                  useMonospaceWidth
                  value={Math.floor((diff % 3600000) / 60000)
                    .toString()
                    .padStart(2, "0")}
                  sequentialAnimationMode
                />
                m,{" "}
                <SlotCounter
                  ref={(el) => {
                    if (el) {
                      countRef.current.push(el);
                    }
                  }}
                  useMonospaceWidth
                  value={Math.floor((diff % 60000) / 1000)
                    .toString()
                    .padStart(2, "0")}
                  sequentialAnimationMode
                />
                s!
                {/* `Ends in ${Math.floor(diff / 86400000)}d, ${Math.floor(
              (diff % 86400000) / 3600000
            )}h, ${Math.floor((diff % 3600000) / 60000)}m, ${Math.floor(
              (diff % 60000) / 1000
            )}s!` */}
              </>
            ) : (
              <>Giveaway has ended.</>
            )
          ) : (
            "Loading time..."
          )}
        </h4>
      </div>
    </div>
  );
};
