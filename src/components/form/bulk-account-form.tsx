"use client";

import { trpc, TRPCError } from "@/app/(api)/api/trpc/client";
import { FormError, RequestError } from "../ui/error";
import { FormQuestion } from "../ui/container";
import { PopupUI } from "../ui/popup";
import { RoundButton } from "../ui/buttons";
import { Field, Form, Formik } from "formik";
import { FC, useState } from "react";
import { bulkAccountSchema } from "@/schema/bulk-accounts";
import { ZodError, z } from "zod";

export const BulkAccountForm: FC<{ setOpen: (open: boolean) => void }> = ({
  setOpen,
}) => {
  const createAccounts = trpc.createBulkAccounts.useMutation();
  const [error, setError] = useState<TRPCError | null>(null);
  const [result, setResult] = useState<{ created: number; skipped: number }>();

  return (
    <PopupUI setOpen={setOpen} title="Create Student Accounts">
      <Formik
        initialValues={{ emails: "" }}
        validate={({ emails }) => {
          try {
            bulkAccountSchema.parse({
              emails: emails
                .split(/[\s,;]+/)
                .map((email) => email.trim())
                .filter(Boolean),
            });
          } catch (err) {
            if (err instanceof ZodError) {
              return z.flattenError(err).fieldErrors;
            }
          }
        }}
        onSubmit={async ({ emails }) => {
          setError(null);
          setResult(undefined);
          await createAccounts
            .mutateAsync({
              emails: emails
                .split(/[\s,;]+/)
                .map((email) => email.trim())
                .filter(Boolean),
            })
            .then(setResult)
            .catch(setError);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="p-4">
            <p className="mb-3">
              Paste student emails separated by commas, spaces, semicolons, or
              new lines. Existing accounts are skipped.
            </p>
            <FormQuestion errored={Boolean(touched.emails && errors.emails)}>
              <label htmlFor="emails">Student emails:</label>
              <Field
                id="emails"
                name="emails"
                as="textarea"
                className="w-full h-48 p-1 rounded-md"
                placeholder="student@nycstudents.net"
              />
              <FormError name="emails" />
            </FormQuestion>
            {error && <RequestError error={error} />}
            {result && (
              <p className="my-3">
                Created {result.created} account(s); skipped {result.skipped}{" "}
                existing account(s).
              </p>
            )}
            <RoundButton disabled={isSubmitting} type="submit">
              Create Accounts{isSubmitting && "ing"}
            </RoundButton>
          </Form>
        )}
      </Formik>
    </PopupUI>
  );
};
