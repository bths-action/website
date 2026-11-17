"use client";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { z, ZodError } from "zod";
import {
  EditMemberInput,
  GetMemberOutput,
  TRPCError,
  trpc,
} from "@/app/(api)/api/trpc/client";
import { editSchema } from "@/schema/form";
import { GRAD_YEARS, OLDEST_GRAD_YEAR, POSITIONS_MAP } from "@/utils/constants";
import { useAccount } from "@/providers/account";
import { PopupUI } from "../ui/popup";
import { FormQuestion } from "../ui/container";
import { FormError, RequestError } from "../ui/error";
import { RoundButton } from "../ui/buttons";
import { Loading } from "../ui/loading";
import { confirm } from "../ui/confirm";

type Member = NonNullable<GetMemberOutput>;

const OPTIONAL_TEXT_FIELDS = ["phone", "instagram", "referredBy"] as const;

const MemberEditor: FC<{ member: Member }> = ({ member }) => {
  const utils = trpc.useUtils();
  const account = useAccount();
  const editMember = trpc.editMember.useMutation();
  const setPosition = trpc.setMemberPosition.useMutation();
  const [error, setError] = useState<TRPCError | null>(null);
  const [saved, setSaved] = useState(false);
  const [pendingPosition, setPendingPosition] = useState(false);

  const initialValues = {
    name: member.name ?? "",
    preferredName: member.preferredName ?? "",
    pronouns: member.pronouns ?? "",
    gradYear: member.gradYear ?? OLDEST_GRAD_YEAR,
    birthday: member.birthday ?? "",
    prefect: member.prefect ?? "",
    sgoSticker: member.sgoSticker ?? false,
    eventAlerts: member.eventAlerts,
    phone: member.phone ?? "",
    instagram: member.instagram ?? "",
    referredBy: member.referredBy ?? "",
  };

  type FormValues = typeof initialValues;

  const isSelf = account.data?.email?.toLowerCase() === member.email.toLowerCase();
  const isExec = member.position === "EXEC";

  function changedValues(values: FormValues) {
    const changed: Record<string, unknown> = {};
    for (const key of Object.keys(values) as (keyof FormValues)[]) {
      if (values[key] === initialValues[key]) continue;
      changed[key] =
        values[key] === "" &&
        (OPTIONAL_TEXT_FIELDS as readonly string[]).includes(key)
          ? null
          : values[key];
    }
    return changed;
  }

  const changePosition = async () => {
    setError(null);
    if (
      !(await confirm({
        title: isExec ? "Revoke Exec" : "Make Exec",
        children: isExec
          ? `Remove exec status from ${
              member.preferredName ?? member.email
            }? Their exec profile (title, description, photo) will also be deleted.`
          : `Make ${member.preferredName ?? member.email} an exec?`,
      }))
    )
      return;

    setPendingPosition(true);
    setPosition.mutate(
      {
        email: member.email,
        position: isExec ? "MEMBER" : "EXEC",
      },
      {
        onSuccess: async () => {
          await utils.getMember.invalidate();
        },
        onError: (err) => setError(err as TRPCError),
        onSettled: () => setPendingPosition(false),
      }
    );
  };

  return (
    <div className="p-2 border-t-2 mt-2 text-left">
      <p>
        <strong>{member.email}</strong>
        {" — "}
        {member.position}
        {member.execDetails?.position &&
          ` (${POSITIONS_MAP[member.execDetails.position]})`}
      </p>
      {!member.name && (
        <p className="text-yellow-600">
          This member has not completed registration yet — they will be asked
          to fill in their profile on their next visit.
        </p>
      )}
      <div className="flex flex-wrap gap-2 my-2">
        <RoundButton
          type="button"
          disabled={isSelf || pendingPosition}
          onClick={changePosition}
        >
          {isExec ? "Revoke Exec" : "Make Exec"}
        </RoundButton>
        {isSelf && <span>You cannot change your own position.</span>}
      </div>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validate={(values) => {
          setError(null);
          setSaved(false);
          try {
            editSchema.parse(changedValues(values));
          } catch (err) {
            if (err instanceof ZodError) {
              return z.flattenError(err).fieldErrors;
            }
          }
        }}
        onSubmit={async (values) => {
          const changed = changedValues(values);
          if (Object.keys(changed).length === 0) {
            setSaved(true);
            return;
          }
          await editMember
            .mutateAsync({
              email: member.email,
              ...changed,
            } as EditMemberInput)
            .then(async () => {
              setSaved(true);
              await utils.getMember.invalidate();
            })
            .catch((err: TRPCError) => setError(err));
        }}
      >
        {({ errors, isSubmitting, setFieldValue }) => (
          <Form>
            <FormQuestion errored={Boolean(errors.name)}>
              <label htmlFor="name">Full (Legal) Name:</label>
              <Field id="name" name="name" type="text" />
              <FormError name="name" />
            </FormQuestion>
            <br />
            <FormQuestion errored={Boolean(errors.preferredName)}>
              <label htmlFor="preferredName">Preferred Name:</label>
              <Field id="preferredName" name="preferredName" type="text" />
              <FormError name="preferredName" />
            </FormQuestion>
            <br />
            <FormQuestion errored={Boolean(errors.pronouns)}>
              <label htmlFor="pronouns">Pronouns:</label>
              <Field id="pronouns" name="pronouns" type="text" />
              <FormError name="pronouns" />
            </FormQuestion>
            <br />
            <FormQuestion errored={Boolean(errors.gradYear)}>
              <label htmlFor="gradYear">Graduation Year:</label>
              <Field
                id="gradYear"
                name="gradYear"
                as="select"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  void setFieldValue("gradYear", Number(e.target.value));
                }}
              >
                {(GRAD_YEARS.includes(initialValues.gradYear)
                  ? GRAD_YEARS
                  : [initialValues.gradYear, ...GRAD_YEARS]
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Field>
              <FormError name="gradYear" />
            </FormQuestion>
            <br />
            <FormQuestion errored={Boolean(errors.birthday)}>
              <label htmlFor="birthday">Birthday:</label>
              <Field id="birthday" name="birthday" type="date" />
              <FormError name="birthday" />
            </FormQuestion>
            <br />
            <FormQuestion errored={Boolean(errors.prefect)}>
              <label htmlFor="prefect">Prefect:</label>
              <Field id="prefect" name="prefect" type="text" />
              <FormError name="prefect" />
            </FormQuestion>
            <br />
            <FormQuestion>
              <label className="flex items-center flex-wrap gap-1">
                <Field id="sgoSticker" name="sgoSticker" type="checkbox" />
                Has an SGO Sticker
              </label>
            </FormQuestion>
            <br />
            <FormQuestion>
              <label className="flex items-center flex-wrap gap-1">
                <Field id="eventAlerts" name="eventAlerts" type="checkbox" />
                Receives event alerts
              </label>
            </FormQuestion>
            <br />
            <FormQuestion errored={Boolean(errors.phone)}>
              <label htmlFor="phone">Phone Number:</label>
              <Field id="phone" name="phone" type="text" />
              <FormError name="phone" />
            </FormQuestion>
            <br />
            <FormQuestion errored={Boolean(errors.instagram)}>
              <label htmlFor="instagram">Instagram Handle:</label>
              <Field id="instagram" name="instagram" type="text" />
              <FormError name="instagram" />
            </FormQuestion>
            <br />
            <FormQuestion errored={Boolean(errors.referredBy)}>
              <label htmlFor="referredBy">Referrer Email:</label>
              <Field id="referredBy" name="referredBy" type="text" />
              <FormError name="referredBy" />
            </FormQuestion>
            <br />
            {error && <RequestError error={error} />}
            {saved && <p className="text-green-500">Saved.</p>}
            <RoundButton type="submit" disabled={isSubmitting}>
              Save Changes{isSubmitting && "ing"}
            </RoundButton>
          </Form>
        )}
      </Formik>
    </div>
  );
};

interface Props {
  setOpen: (open: boolean) => void;
}

export const ManageMemberForm: FC<Props> = ({ setOpen }) => {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(input.trim()), 250);
    return () => clearTimeout(timeout);
  }, [input]);

  const search = trpc.searchMembers.useQuery(
    { query: debounced },
    { enabled: debounced.length > 0 }
  );
  const member = trpc.getMember.useQuery(
    { email: email ?? "" },
    { enabled: Boolean(email) }
  );

  const results = search.data ?? [];
  const showResults =
    input.trim().length > 0 &&
    input.trim().toLowerCase() !== email?.toLowerCase();

  const choose = (memberEmail: string) => {
    setInput(memberEmail);
    setEmail(memberEmail);
  };

  return (
    <PopupUI setOpen={setOpen} title="Manage Members">
      <div className="p-4">
        <form
          className="flex flex-wrap gap-2 justify-center items-center"
          onSubmit={(e) => {
            e.preventDefault();
            const resultsAreCurrent =
              debounced.toLowerCase() === input.trim().toLowerCase();
            if (resultsAreCurrent && results.length > 0) {
              choose(results[0].email);
            } else if (input.includes("@")) {
              choose(input.trim().toLowerCase());
            }
          }}
        >
          <label htmlFor="memberSearch">Search by name or email:</label>
          <input
            id="memberSearch"
            type="search"
            className="border-2 border-black dark:border-white rounded-md p-1"
            placeholder="Name or student@nycstudents.net"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <RoundButton type="submit">Look Up</RoundButton>
        </form>

        {showResults && (
          <div className="mt-2 border-2 border-black dark:border-white rounded-md overflow-hidden">
            {search.isFetching && (
              <Loading loadingType="bar" className="p-2">
                Searching...
              </Loading>
            )}
            <div className="max-h-64 overflow-auto divide-y divide-gray-400/30">
              {results.map((result) => (
                <button
                  key={result.email}
                  type="button"
                  className="block w-full text-left p-2 hover:bg-gray-400/20"
                  onClick={() => choose(result.email)}
                >
                  <span className="font-bold">
                    {result.preferredName ?? result.name ?? result.email}
                  </span>
                  {result.preferredName &&
                    result.name &&
                    result.preferredName !== result.name &&
                    ` (${result.name})`}
                  <span className="block text-sm opacity-70">
                    {result.email} ·{" "}
                    {result.position === "EXEC" ? "Exec" : "Member"}
                    {result.gradYear != null && ` · Class of ${result.gradYear}`}
                  </span>
                </button>
              ))}
              {search.isFetched && results.length === 0 && (
                <p className="p-2">No members found.</p>
              )}
              {results.length === 10 && (
                <p className="p-2 text-sm opacity-70">
                  Showing up to 10 matches — keep typing to narrow it down.
                </p>
              )}
            </div>
          </div>
        )}

        {member.isFetching && <Loading loadingType="bar">Loading member...</Loading>}
        {member.error ? (
          <RequestError error={member.error} />
        ) : (
          member.isFetched &&
          !member.isFetching &&
          email &&
          member.data === null && <p className="mt-3">No member found.</p>
        )}
        {member.data && (
          <MemberEditor key={member.data.email} member={member.data} />
        )}
      </div>
    </PopupUI>
  );
};
