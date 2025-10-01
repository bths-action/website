import { EventPage } from "@/components/event/event-page";
import { prisma } from "@/utils/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FC } from "react";
import removeMarkdown from "remove-markdown";

export const dynamicParams = true;
export const revalidate = 15;

export type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;

  const { id } = params;

  const event = await prisma.event.findUnique({
    where: { id },
    select: { name: true, description: true, imageURL: true },
  });

  if (!event) {
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
      title: "Nonexistent Event",
      description: "You may have attached a bad link.",
    };
  }

  const description = removeMarkdown(event.description);

  const metadata: Metadata = {
    creator: "BTHS Action",
    generator: "BTHS Action",
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon-180.png",
      shortcut: "/icon.png",
    },
    manifest: "/manifest.json",
    title: `Event: ${event.name}`,
    description:
      description.length > 500
        ? description.substring(0, 500).trim() + "..."
        : description,
    openGraph: {
      siteName: "BTHS Action",

      images: {
        url: event.imageURL || "https://bthsaction.org/icon.png",
      },
    },
    twitter: {
      card: event.imageURL ? "summary_large_image" : "summary",
    },
  };

  return metadata;
}

export async function generateStaticParams() {
  const events = await prisma.event.findMany({
    select: { id: true },
  });

  return events.map((event) => ({ id: event.id }));
}

function fetchEvent(id: string) {
  return prisma.event.findUnique({
    where: { id },
  });
}

const Page: FC<Params> = async (props) => {
  const params = await props.params;

  const { id } = params;

  const event = await fetchEvent(id);
  if (!event) {
    notFound();
  }

  return (
    <main>
      <EventPage event={event} />
    </main>
  );
};

export default Page;
