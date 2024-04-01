import { FC } from "react";
import { Metadata } from "next";
import { prisma } from "@/utils/prisma";
import removeMarkdown from "remove-markdown";
import { notFound } from "next/navigation";
import { GiveawayPage } from "@/components/giveaway/giveaway-page";

export const dynamicParams = true;
export const revalidate = 15;

export type Params = {
  params: { id: string };
};

export async function generateMetadata({
  params: { id },
}: Params): Promise<Metadata> {
  const giveaway = await prisma.giveaway.findUnique({
    where: { id },
    select: { name: true, description: true, imageURL: true },
  });

  if (!giveaway) {
    return {
      creator: "BTHS Action",
      generator: "BTHS Action",
      icons: {
        icon: "/icon.png",
        apple: "/apple-icon-180.png",
        shortcut: "/icon.png",
      },
      manifest: "/manifest.json",

      openGraph: {
        siteName: "BTHS Action",
        images: "https://bthsaction.org/icon.png",
      },
      title: "Nonexistent Giveaway",
      description: "You may have attached a bad link.",
    };
  }

  const description = removeMarkdown(giveaway.description);

  const metadata: Metadata = {
    creator: "BTHS Action",
    generator: "BTHS Action",
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon-180.png",
      shortcut: "/icon.png",
    },
    manifest: "/manifest.json",
    title: `Giveaway: ${giveaway.name}`,
    description:
      description.length > 500
        ? description.substring(0, 500).trim() + "..."
        : description,
    openGraph: {
      siteName: "BTHS Action",

      images: {
        url: giveaway.imageURL || "https://bthsaction.org/icon.png",
      },
    },
    twitter: {
      card: giveaway.imageURL ? "summary_large_image" : "summary",
    },
  };

  return metadata;
}

export async function generateStaticParams() {
  const giveaways = await prisma.giveaway.findMany({
    select: { id: true },
  });

  return giveaways.map((giveaways) => ({ id: giveaways.id }));
}

function fetchGiveaway(id: string) {
  return prisma.giveaway.findUnique({
    where: { id },
  });
}

const EventsPage: FC<Params> = async ({ params: { id } }) => {
  const giveaway = await fetchGiveaway(id);
  if (!giveaway) {
    notFound();
  }
  return <GiveawayPage giveaway={giveaway} />;
};

export default EventsPage;
