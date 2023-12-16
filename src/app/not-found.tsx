import { NotFoundWidget } from "@/components/not-found/widget";
import { TransparentButton } from "@/components/ui/buttons";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="pt-3">
      <h2>Not Found</h2>
      <NotFoundWidget />
      <p>Damn, you made the 404 go bonkers.</p>
      <TransparentButton className="border-2 border-black dark:border-white">
        <Link href="/" className="p-5">
          Better Return Home
        </Link>
      </TransparentButton>
    </main>
  );
}
