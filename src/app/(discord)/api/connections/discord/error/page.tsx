import { FC } from "react";
import { Figtree, Space_Mono, Poppins } from "next/font/google";
import "@/app/globals.css";
import { ConnectedBanner } from "@/components/discord";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const poppins = Poppins({
  weight: ["300", "500", "400", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const AuthError: FC<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}> = async (props) => {
  const searchParams = await props.searchParams;
  return (
    <>
      <ConnectedBanner />
      <main>
        <h1>Discord Auth Error</h1>
        Yikes! Something went wrong.
        <p>
          Error Code:{" "}
          {searchParams.error
            ? searchParams.error
            : JSON.stringify(searchParams)}
        </p>
      </main>
    </>
  );
};

export default AuthError;
