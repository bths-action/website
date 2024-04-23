import { NotFoundWidget } from "@/components/not-found/widget";
import { RoundButton } from "@/components/ui/buttons";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Not Found</h1>
      <NotFoundWidget />
      <h5>Emma's Action Frog couldn't find what you were looking for.</h5>
      <RoundButton>
        <Link href="/">Return Home</Link>
      </RoundButton>
    </main>
  );
}
