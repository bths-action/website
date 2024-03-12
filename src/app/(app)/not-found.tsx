import { NotFoundWidget } from "@/components/not-found/widget";
import { RoundButton } from "@/components/ui/buttons";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Not Found</h1>
      <NotFoundWidget />
      <p>Damn, you made the 404 go bonkers.</p>
      <RoundButton>
        <Link href="/">Better Return Home</Link>
      </RoundButton>
    </main>
  );
}
