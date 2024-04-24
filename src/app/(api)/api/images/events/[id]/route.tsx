import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import removeMarkdown from "remove-markdown";
import { BsAward, BsClock } from "react-icons/bs";
import { MdLocationOn, MdOutlineAccessTime } from "react-icons/md";
import { prisma } from "@/utils/prisma";
// App router includes @vercel/og.
// No need to install it.

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const anybody = await fetch(
    "https://github.com/webfontworld/Poppins/raw/main/Poppins-Regular.ttf"
  ).then((res) => res.arrayBuffer());

  const figtree = await fetch(
    "https://fonts.bunny.net/figtree/files/figtree-latin-400-normal.woff"
  ).then((res) => res.arrayBuffer());

  const data = await prisma.event.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let text = removeMarkdown(data.description);
  text = text.length > 300 ? text.substring(0, 300).trim() + "..." : text;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "black",
          color: "white",
          fontFamily: "Figtree",
        }}
      >
        <img
          tw="rounded-full m-2"
          width="200"
          height="200"
          style={{
            border: "5px solid white",
          }}
          src="https://bthsaction.org/icon.png"
        />
        <h1
          style={{
            fontFamily: "Anybody",
          }}
          tw="text-6xl mt-4 text-center"
        >
          {data.name}
        </h1>
        <div tw="flex flex-row">
          <div tw="flex flex-col w-1/2 p-2">
            <h2 tw="text-3xl my-1 flex flex-row text-center justify-center items-center">
              <BsClock /> Total Hours: {data.maxHours}
            </h2>
            <h2 tw="text-3xl my-1 flex flex-row text-center justify-center  items-center">
              <BsAward /> Total Points: {data.maxPoints}
            </h2>

            <h2 tw="text-3xl my-1 flex flex-row flex-wrap justify-center text-center  items-center">
              <MdLocationOn /> Location: <br /> {data.address}
            </h2>
            <h2 tw="text-3xl my-1 flex flex-row flex-wrap justify-center text-center  items-center">
              <MdOutlineAccessTime /> Time: <br />
              {data.eventTime.toLocaleString("en-US", {
                timeZone: "America/New_York",
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </h2>
          </div>
          <div tw="flex text-3xl items-center p-2 w-1/2 flex-wrap justify-center text-center">
            Interested? View this on BTHS Action website!
            <img
              src={
                "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://bthsaction.org/events/" +
                data.id
              }
              tw="w-48 pt-2"
            />
          </div>
        </div>
        {data.imageURL && (
          <img
            src={data.imageURL}
            style={{
              boxShadow: "10px 10px 10px #0000007d",
            }}
            tw="rounded-xl h-full flex-1 m-4 max-w-full"
          />
        )}
      </div>
    ),
    {
      width: 1000,
      height: 1000,
      fonts: [
        {
          data: anybody,
          name: "Anybody",
        },
        {
          data: figtree,
          name: "Figtree",
        },
      ],
    }
  );
}
