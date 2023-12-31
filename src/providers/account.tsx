"use client";
import { trpc } from "@/app/api/trpc/client";
import { FC, PropsWithChildren, createContext, useContext } from "react";

type AccountQuery = ReturnType<typeof trpc.getForm.useQuery>;

interface Account {
  account: AccountQuery;
}

const AccountContext = createContext<Account>({} as Account);

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const account = trpc.getForm.useQuery(undefined, {
    queryKey: ["getForm", undefined],
  });

  return (
    <AccountContext.Provider
      value={{
        account,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
export const useAccount = () => {
  return useContext(AccountContext);
};
