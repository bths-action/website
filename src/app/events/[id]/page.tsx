import { EventPage } from "@/components/event/event-page";
import { prisma } from "@/utils/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FC } from "react";
import removeMarkdown from "remove-markdown";

export const dynamicParams = true;
export const revalidate = 15;

type Params = {
  params: { id: string };
};

export async function generateMetadata({
  params: { id },
}: Params): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { id },
    select: { name: true, description: true, imageURL: true },
  });

  if (!event) {
    return {
      title: "Nonexistent Event",
      description: "You may have attached a bad link.",
    };
  }

  const description = removeMarkdown(event.description);

  const metadata: Metadata = {
    title: event.name,
    description:
      description.length > 500
        ? description.substring(0, 500).trim() + "..."
        : description,
    openGraph: {
      ...(event.imageURL
        ? {
            images: {
              url: event.imageURL,
            },
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
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

const Page: FC<Params> = async ({ params: { id } }) => {
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
