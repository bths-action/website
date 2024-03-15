import { LimitedContainer } from "@/components/ui/container";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FC } from "react";

export const metadata = {
  title: "Invalid Discord Login",
};

const Page: FC = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return (
    <main>
      <LimitedContainer>
        <h1>Invalid Discord Login</h1>
        You must use a Discord account connected to an existing account.
      </LimitedContainer>
    </main>
  );
};

export default Page;
