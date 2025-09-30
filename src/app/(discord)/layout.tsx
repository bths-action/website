import { Figtree, Space_Mono, Poppins } from "next/font/google";
import "@/app/globals.css";
import { AppProviders } from "@/providers/providers";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${figtree.variable} ${poppins.variable} ${spaceMono.variable} bg-white font-anybody dark:bg-black`}
      >
        <AppProviders>
          <div
            className="h-dvh overflow-auto w-dvw break-words flex items-center justify-center flex-col"
            id="content"
          >
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
