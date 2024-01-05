"use client";
import { ChangeEvent, FC, useState } from "react";
import { PopupUI } from "../ui/popup";
import { useAccount } from "@/providers/account";
import { FormError, RequestError } from "../ui/error";
import { signOut, useSession } from "next-auth/react";
import { Field, Form, Formik } from "formik";
import { Loading } from "../ui/loading";
import { ZodError } from "zod";
import { registerSchema } from "@/app/api/trpc/schema/form";
import { FormQuestion } from "../ui/container";
import { OLDEST_GRAD_YEAR, YOUNGEST_GRAD_YEAR } from "@/utils/constants";
import { TRPCError, trpc } from "@/app/api/trpc/client";
import { TransparentButton } from "../ui/buttons";
import { Collapse } from "../ui/collapse";

interface Props {
  mode: "edit" | "create";
  setOpen: (open: boolean) => any;
}

const FormContent: FC<Props> = ({ mode, setOpen }) => {
  const utils = trpc.useUtils();
  const createForm = trpc.register.useMutation();
  const editForm = trpc.editForm.useMutation();
  const account = useAccount();
  const [error, setError] = useState<TRPCError | null>(null);
  const [prefectHelp, setPrefectHelp] = useState(false);

  const initialValues = {
    name: mode == "edit" ? account.data!.name : "",
    preferredName: mode == "edit" ? account.data!.preferredName : "",
    prefect: mode == "edit" ? account.data!.prefect : "",
    pronouns: mode == "edit" ? account.data!.pronouns : "",
    gradYear: mode == "edit" ? Number(account.data!.gradYear) : 2027,
    birthday: mode == "edit" ? account.data!.birthday : "",
    sgoSticker: mode == "edit" ? account.data!.sgoSticker : false,
    referredBy: mode == "edit" ? account.data!.referredBy : null,
    eventAlerts: mode == "edit" ? account.data!.eventAlerts : true,
  };

  type FormValues = typeof initialValues;

  return (
    <Formik
      validateOnBlur
      initialValues={{ ...initialValues }}
      validate={(values) => {
        setError(null);
        values = { ...values };
        if (values.gradYear < OLDEST_GRAD_YEAR) {
          values.gradYear = OLDEST_GRAD_YEAR;
        }
        if (values.preferredName == "") {
          values.preferredName = values.name;
        }

        try {
          registerSchema.parse(values);
        } catch (err) {
          if (err instanceof ZodError) {
            return err.formErrors.fieldErrors;
          }
        }
      }}
      onSubmit={async (values) => {
        values = { ...values };
        if (values.preferredName == "") {
          values.preferredName = values.name;
        }

        if (mode == "edit") {
          // compare values to initial values, and remove duplicates via map
          values = Object.fromEntries(
            Object.entries(values).filter(
              ([key, value]) => value !== initialValues[key as keyof FormValues]
            )
          ) as FormValues;
          console.log(values);
        }

        await (mode == "create" ? createForm : editForm)
          .mutateAsync(values, {
            onError: (err: TRPCError) => {
              setError(err);
            },
            onSuccess: (data) => {
              utils.getForm.setData(undefined, {
                ...data,
                execDetails: account.data?.execDetails || null,
              });
              setOpen(false);
            },
          })
          .catch();
      }}
    >
      {({ errors, values, setFieldValue, isSubmitting, touched }) => (
        <Form className="py-2">
          {mode == "create" && (
            <>
              <TransparentButton
                className="border-2 px-2"
                type="button"
                onClick={() => signOut()}
              >
                Not You? Sign Out
              </TransparentButton>
              <br />
            </>
          )}

          <FormQuestion errored={Boolean(errors["name"] && touched["name"])}>
            <label htmlFor="name">Name:</label>
            <Field id="name" name="name" type="text" placeholder="Your name" />
            <FormError name="name" />
          </FormQuestion>
          <br />
          <FormQuestion
            errored={Boolean(
              errors["preferredName"] && touched["preferredName"]
            )}
          >
            <label htmlFor="preferredName">Preferred Name:</label>
            <Field
              id="preferredName"
              name="preferredName"
              type="text"
              placeholder={values.name || "Your preferred name"}
            />
            <FormError name="preferredName" />
          </FormQuestion>
          <br />
          <FormQuestion
            errored={Boolean(errors["pronouns"] && touched["pronouns"])}
          >
            <label htmlFor="pronouns">Pronouns:</label>
            <Field
              id="pronouns"
              name="pronouns"
              type="text"
              placeholder="Your pronouns"
            />
            <FormError name="pronouns" />
          </FormQuestion>
          <br />
          <FormQuestion
            errored={Boolean(errors["gradYear"] && touched["gradYear"])}
          >
            <label htmlFor="gradYear">Graduation Year:</label>
            {values.gradYear < OLDEST_GRAD_YEAR ? (
              " Alumni (Cannot Change)"
            ) : (
              // Make this a select instead
              <Field
                id="gradYear"
                name="gradYear"
                as="select"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setFieldValue("gradYear", Number(e.target.value));
                }}
              >
                {Array.from(
                  { length: YOUNGEST_GRAD_YEAR - OLDEST_GRAD_YEAR + 1 },
                  (_, i) => OLDEST_GRAD_YEAR + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Field>
            )}
            <FormError name="gradYear" />
          </FormQuestion>
          <br />
          <FormQuestion
            errored={Boolean(errors["birthday"] && touched["birthday"])}
          >
            <label htmlFor="birthday">Birthday:</label>
            <Field id="birthday" name="birthday" type="date" />
            <FormError name="birthday" />
          </FormQuestion>
          <br />

          <FormQuestion
            errored={Boolean(errors["prefect"] && touched["prefect"])}
          >
            <label htmlFor="prefect">Prefect:</label>
            <Field id="prefect" name="prefect" type="text" placeholder="A1B" />
            <FormError name="prefect" />
          </FormQuestion>

          <br />
          <TransparentButton
            onClick={() => setPrefectHelp(!prefectHelp)}
            className="border-2 px-2"
            type="button"
          >
            How to get prefect? (Click to {prefectHelp ? "hide" : "show"})
          </TransparentButton>
          <Collapse collapsed={!prefectHelp} className="p-1">
            This is basically BTHS equalivalent of your "homeroom" number.
            <br />
            Go get your schedule via teachhub, and look for something that says
            "Offical Class", input the 3 digit code, that looks like this "A1B".
            If it does not look like so, please put in A1A as a temporary
            prefect and let your counselor know!
          </Collapse>
          <FormQuestion>
            <label className="flex items-center gap-1">
              <Field id="sgoSticker" name="sgoSticker" type="checkbox" />
              Check if you have an SGO Sticker
            </label>

            <FormError name="sgoSticker" />
          </FormQuestion>
          <br />
          <FormQuestion>
            <label className="flex items-center gap-1">
              <Field id="eventAlerts" name="eventAlerts" type="checkbox" />
              Check to recieve event alerts
            </label>

            <FormError name="eventAlerts" />
          </FormQuestion>
          <br />

          <FormQuestion
            errored={Boolean(errors["referredBy"] && touched["prefect"])}
          >
            <label htmlFor="referredBy">Referrer Email:</label>
            <Field
              id="referredBy"
              name="referredBy"
              type="text"
              placeholder="johndoe1@nycstudents.net"
            />
            <FormError name="referredBy" />
          </FormQuestion>
          <br />

          {error && <RequestError error={error} />}

          <TransparentButton className="border-2 px-2" type="submit">
            Submit{isSubmitting && "ting"}
          </TransparentButton>
        </Form>
      )}
    </Formik>
  );
};

export const UserForm: FC<Props> = ({ mode, setOpen }) => {
  const { status } = useSession();
  const account = useAccount();

  return (
    <PopupUI
      setOpen={(open: boolean) => {
        setOpen(open);
      }}
      disabledExit={mode == "create"}
      title={mode == "edit" ? "Edit Profile" : "Create Profile"}
    >
      {account.isError && mode == "edit" ? (
        <RequestError error={account.error} className="rounded-none" />
      ) : mode == "edit" && !account.isFetched ? (
        <Loading loadingType="bar">Loading...</Loading>
      ) : mode == "edit" && account.isFetched && !account.data ? (
        "Your form is not available. You have to register."
      ) : (
        <FormContent mode={mode} setOpen={setOpen} />
      )}
    </PopupUI>
  );
};
