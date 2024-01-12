import { LimitedContainer } from "@/components/ui/container";
import { FC } from "react";
import { prisma } from "@/utils/prisma";

export const revalidate = 60;
export const metadata = {
  title: "Executives",
  description: "Check out our executives!",
};

const Page: FC = () => {
  const data = prisma.execDetails.findMany({
    include: {
      user: {
        select: {
          name: true,
          preferredName: true,
          pronouns: true,
          gradYear: true,
        },
      },
    },
  });

  return (
    <main>
      <LimitedContainer>
        <h1>Executives</h1>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores,
        id. Tenetur, veritatis quas accusantium culpa corporis sit delectus unde
        eos harum nam vel pariatur recusandae necessitatibus aliquam! Soluta, ea
        aperiam.
      </LimitedContainer>
    </main>
  );
};

export default Page;
