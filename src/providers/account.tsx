"use client";
import { GetFormOutput, TRPCError, trpc } from "@/app/api/trpc/client";
import { UserForm } from "@/components/form/user-form";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

type AccountQuery = UseTRPCQueryResult<GetFormOutput, TRPCError>;

const AccountContext = createContext<AccountQuery>({} as AccountQuery);

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const account = trpc.getForm.useQuery();
  const [open, setOpen] = useState(false);

  return (
    <AccountContext.Provider value={account}>
      {account.isSuccess && account.isFetched && account.data == null && (
        <UserForm mode="create" setOpen={setOpen} />
      )}
      {children}
    </AccountContext.Provider>
  );
};
export const useAccount = () => {
  return useContext(AccountContext);
};
