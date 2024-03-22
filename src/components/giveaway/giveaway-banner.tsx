"use client";
import { Giveaway } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";
import SlotCounter from "react-slot-counter";

export const GiveawayBanner: FC<{
  date: Date | null;
  giveaway: Giveaway;
}> = ({ date, giveaway }) => {
  const diff = Math.round(
    date ? giveaway.endsAt.getTime() - date.getTime() : 0
  );

  return (
    <div className="w-full h-[100dvh] flex items-center relative justify-center flex-col">
      <h2 className="break-all">{giveaway.name}</h2>
      <Image
        src={giveaway.imageURL || "https://picsum.photos/800/600"}
        alt={giveaway.name}
        className="-z-40"
        layout="fill"
        objectFit="cover"
      />
      <h4 className="font-space-mono h-10">
        {date ? (
          <>
            Ends in{" "}
            <SlotCounter
              useMonospaceWidth
              value={Math.floor(diff / 86400000)}
              sequentialAnimationMode
            />
            d,{" "}
            <SlotCounter
              useMonospaceWidth
              value={Math.floor((diff % 86400000) / 3600000)
                .toString()
                .padStart(2, "0")}
              sequentialAnimationMode
            />
            h,{" "}
            <SlotCounter
              useMonospaceWidth
              value={Math.floor((diff % 3600000) / 60000)
                .toString()
                .padStart(2, "0")}
              sequentialAnimationMode
            />
            m,{" "}
            <SlotCounter
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
          "Loading time..."
        )}
      </h4>
    </div>
  );
};
