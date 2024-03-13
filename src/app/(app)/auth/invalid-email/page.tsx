import { LimitedContainer } from "@/components/ui/container";
import { FC } from "react";

export const metadata = {
  title: "Invalid Account",
};

const Page: FC = () => {
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
