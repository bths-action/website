import { LimitedContainer } from "@/components/ui/container";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FC } from "react";

export const metadata = {
  title: "Invalid Account",
};

const Page: FC = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return (
    <main>
      <LimitedContainer>
        <h1>Invalid Email</h1>
        You must use an NYC Schools email (@nycstudents.net or @schools.nyc.gov)
        to access this site, or an Discord account connected to such an account.
      </LimitedContainer>
    </main>
  );
};

export default Page;
