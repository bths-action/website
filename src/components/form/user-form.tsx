"use client";
import { ChangeEvent, FC, useState } from "react";
import { PopupUI } from "../ui/popup";
import { useAccount } from "@/providers/account";
import { FormError, RequestError } from "../ui/error";
import { signOut } from "next-auth/react";
import { Field, Form, Formik } from "formik";
import { Loading } from "../ui/loading";
import { ZodError } from "zod";
import { registerSchema } from "@/schema/form";
import { FormQuestion } from "../ui/container";
import { GRAD_YEARS, OLDEST_GRAD_YEAR } from "@/utils/constants";
import { TRPCError, trpc } from "@/app/(api)/api/trpc/client";
import { RoundButton } from "../ui/buttons";
import { Collapse } from "../ui/collapse";
import { confirm } from "../ui/confirm";
import { isAlumni } from "@/utils/helpers";

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
    instagram: mode == "edit" ? account.data!.instagram : "",
    phone: mode == "edit" ? Number(account.data!.phone) : null,
  };

  type FormValues = typeof initialValues;

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validate={(data) => {
        setError(null);
        let values = { ...data };
        if (values.gradYear < OLDEST_GRAD_YEAR) {
          values.gradYear = OLDEST_GRAD_YEAR;
        }
        if (values.preferredName == "") {
          values.preferredName = values.name;
        }

        if (!values.referredBy) {
          values.referredBy = null;
        }

        try {
          registerSchema.parse(values);
        } catch (err) {
          if (err instanceof ZodError) {
            return err.formErrors.fieldErrors;
          }
        }
      }}
      onSubmit={async (data) => {
        let values = { ...data };
        if (values.preferredName == "") {
          values.preferredName = values.name;
        }

        if (!values.referredBy) {
          values.referredBy = null;
        }

        if (mode == "edit") {
          values = Object.fromEntries(
            Object.entries(values).filter(
              ([key, value]) => value !== initialValues[key as keyof FormValues]
            )
          ) as FormValues;
        }

        if (Object.keys(values).length == 0) {
          setOpen(false);
          return;
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
      {({
        errors: errorsRaw,
        values,
        setFieldValue,
        isSubmitting,
        touched,
      }) => {
        // remap errorsRaw so that it also checks touched
        const errors = Object.fromEntries(
          Object.entries(errorsRaw).map(([key, value]) => [
            key,
            touched[key as keyof FormValues] ? value : undefined,
          ])
        ) as typeof errorsRaw;
        return (
          <Form className="py-2">
            {mode == "create" && (
              <>
                <RoundButton type="button" onClick={() => signOut()}>
                  Not You? Sign Out
                </RoundButton>
                <br />
              </>
            )}

            <FormQuestion errored={Boolean(errors.name)}>
              <label htmlFor="name">Full (Legal) Name:</label>
              <Field
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
              />
              <FormError name="name" />
            </FormQuestion>
            <br />
            <FormQuestion errored={Boolean(errors.preferredName)}>
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
            <FormQuestion errored={Boolean(errors.pronouns)}>
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
            <FormQuestion errored={Boolean(errors.gradYear)}>
              <label htmlFor="gradYear">Graduation Year:</label>
              {isAlumni(values.gradYear) ? (
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
                  {GRAD_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Field>
              )}
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
              <Field
                id="prefect"
                name="prefect"
                type="text"
                placeholder="A1B"
              />
              <FormError name="prefect" />
            </FormQuestion>

            <br />
            <RoundButton
              onClick={() => setPrefectHelp(!prefectHelp)}
              type="button"
            >
              How to get prefect? (Click to {prefectHelp ? "hide" : "show"})
            </RoundButton>
            <Collapse collapsed={!prefectHelp} className="p-1">
              This is basically BTHS equalivalent of your "homeroom" number.
              <br />
              Go get your schedule via teachhub, and look for something that
              says "Offical Class", input the 3 digit code, that looks like this
              "A1B". If it does not look like so, please put in A1A as a
              temporary prefect and let your counselor know!
            </Collapse>
            <FormQuestion>
              <label className="flex items-center flex-wrap gap-1">
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

            <FormQuestion errored={Boolean(errors.phone)}>
              <label htmlFor="phone">Phone Number:</label>
              <Field
                id="phone"
                name="phone"
                type="text"
                placeholder="1234567890"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  const value = e.target.value;
                  setFieldValue("phone", value === "" || value === "0" ? null : Number(value));
                }}
              />
              <FormError name="phone" />
            </FormQuestion>
            <br />

            <FormQuestion errored={Boolean(errors.phone)}>
              <label htmlFor="instagram">Instagram Handle:</label>
              <Field
                id="instagram"
                name="instagram"
                type="text"
                placeholder=""
              />
              <FormError name="instagram" />
            </FormQuestion>
            <br />

            <FormQuestion errored={Boolean(errors.referredBy)}>
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

            <RoundButton type="submit">
              Submit{isSubmitting && "ting"}
            </RoundButton>
          </Form>
        );
      }}
    </Formik>
  );
};

export const UserForm: FC<Props> = ({ mode, setOpen }) => {
  const account = useAccount();

  return (
    <PopupUI
      setOpen={async (open: boolean) => {
        if (
          !open &&
          !(await confirm({
            title: "Are you sure?",
            children: "You will lose any unsaved changes.",
          }))
        )
          return;
        setOpen(open);
      }}
      disabledExit={mode == "create"}
      title={mode == "edit" ? "Edit Profile" : "Create Profile"}
    >
      {mode == "edit" && account.status == "loading" ? (
        <Loading loadingType="bar">Loading...</Loading>
      ) : mode == "edit" && account.status == "success" && !account.data ? (
        "Your form is not available. You have to register."
      ) : account.status == "error" ? (
        mode == "edit" ? (
          <RequestError error={account.error} className="rounded-none" />
        ) : (
          "You are not logged in."
        )
      ) : (
        <FormContent mode={mode} setOpen={setOpen} />
      )}
    </PopupUI>
  );
};
