import { LimitedContainer } from "@/components/ui/container";
import { FC } from "react";

const AuthError: FC<{
  searchParams: { [key: string]: string | string[] | undefined };
}> = ({ searchParams }) => {
  return (
    <main>
      <LimitedContainer>
        <h1>Discord Auth Error</h1>
        Yikes! Something went wrong.
        <p>
          {searchParams.error
            ? searchParams.error
            : JSON.stringify(searchParams)}
        </p>
      </LimitedContainer>
    </main>
  );
};

export default AuthError;
