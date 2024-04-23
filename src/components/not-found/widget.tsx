import { FC } from "react";
import Image from "next/image";

export const NotFoundWidget: FC = () => {
  return (
    <div className="relative w-full flex justify-center my-20">
      <Image
        className="-z-50"
        src="/images/404.png"
        width={300}
        height={300}
        alt="Emma's Action Frog"
      />
    </div>
  );
};
