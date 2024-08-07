import { LimitedContainer } from "@/components/ui/container";
import { FC } from "react";

export const metadata = {
  title: "Gallery",
  description:
    "Gallery page for BTHS Action. We have a lot of cool pictures and memories to share!",
};

const Page: FC = () => {
  return (
    <main>
      <LimitedContainer>
        <h1>Gallery</h1>
        <div className="relative w-full h-0 pt-[56.25%] pb-0 mt-6 mb-4 overflow-hidden rounded-lg shadowed">
          <iframe
            loading="lazy"
            allowTransparency
            className="absolute w-full h-full top-0 left-0 border-none p-0 m-0"
            src="https://www.canva.com/design/DAGB-rSHQmc/_kOncHPgLCvEYUx03gZRUg/view?embed"
            allowFullScreen
            allow="fullscreen"
          ></iframe>
        </div>
      </LimitedContainer>
    </main>
  );
};

export default Page;
