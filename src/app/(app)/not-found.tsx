import { NotFoundWidget } from "@/components/not-found/widget";
import { RoundButton } from "@/components/ui/buttons";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Not Found</h1>
      <NotFoundWidget />
      <p>
        Emma's Action Frog couldn't find what you were looking for. But he does
        have a message for you when you click on him!
      </p>
      <RoundButton>
        <Link href="/">Return Home</Link>
      </RoundButton>
    </main>
  );
}
