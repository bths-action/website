"use client";
import { TRPCError, trpc } from "@/app/api/trpc/client";
import { createExecSchema } from "@/schema/exec";
import { useAccount } from "@/providers/account";
import { ExecPosition } from "@prisma/client";
import { Field, Form, Formik } from "formik";
import { FC, useState } from "react";
import { ZodError } from "zod";
import { FormQuestion } from "../ui/container";
import { POSITIONS_MAP } from "@/utils/constants";
import { FormError, RequestError } from "../ui/error";
import { Loading } from "../ui/loading";
import { PopupUI } from "../ui/popup";
import { BiXCircle } from "react-icons/bi";
import { RoundButton } from "../ui/buttons";
import { confirm } from "../ui/confirm";
import { MarkDownView } from "../ui/md-view";

interface Props {
  mode: "edit" | "create";
  setOpen: (open: boolean) => any;
}

const FormContent: FC<Props> = ({ mode, setOpen }) => {
  const utils = trpc.useUtils();
  const createExec = trpc.createExec.useMutation();
  const editExec = trpc.editExec.useMutation();
  const account = useAccount();
  const [error, setError] = useState<TRPCError | null>(null);
  const [uploading, setUploading] = useState(false);

  const initialValues = {
    position: (mode == "edit" ? account.data!.execDetails!.position : "") as
      | ExecPosition
      | "",
    selfieURL: mode == "edit" ? account.data!.execDetails!.selfieURL : null,
    description: mode == "edit" ? account.data!.execDetails!.description : "",
  };

  type FormValues = typeof initialValues;

  return (
    <Formik
      initialValues={initialValues}
      validate={(data) => {
        setError(null);
        try {
          createExecSchema.parse(data);
        } catch (err) {
          if (err instanceof ZodError) {
            return err.formErrors.fieldErrors;
          }
        }
      }}
      onSubmit={async (data) => {
        let values = {
          ...data,
          position: data.position as ExecPosition,
        };

        if (mode == "edit") {
          values = Object.fromEntries(
            Object.entries(values).filter(
              ([key, value]) => value !== initialValues[key as keyof FormValues]
            )
          ) as typeof values;
        }

        if (Object.keys(values).length == 0) {
          setOpen(false);
          return;
        }

        await (mode == "edit" ? editExec : createExec)
          .mutateAsync(values, {
            onSuccess: (data) => {
              utils.getForm.setData(undefined, {
                ...account.data!,
                execDetails: data,
              });
              setOpen(false);
            },
            onError: (err) => {
              setError(err);
            },
          })
          .catch();
      }}
    >
      {({
        errors: errorsRaw,
        setFieldValue,
        isSubmitting,
        values,
        setFieldError,
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
            <FormQuestion errored={Boolean(errors.position)}>
              <label htmlFor="position">Position:</label>
              <Field name="position" id="position" as="select">
                <option value="">Select a position</option>
                {Object.entries(POSITIONS_MAP).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field>
              <FormError name="position" />
            </FormQuestion>
            <br />

            <FormQuestion errored={Boolean(errors.description)}>
              <label htmlFor="description">
                Description: ({5000 - values.description.length} chars
                remaining)
              </label>
              <Field
                name="description"
                id="description"
                as="textarea"
                placeholder="Describe yourself."
                maxLength={5000}
                className="w-full h-60 p-1 rounded-md"
              />
              <FormError name="description" />
            </FormQuestion>
            <br />
            {values.description && (
              <div className="mx-2 bg-gray-500 bg-opacity-20 overflow-auto break-words p-1 rounded-md">
                <MarkDownView>{values.description}</MarkDownView>
              </div>
            )}

            <FormQuestion errored={Boolean(errors.selfieURL)}>
              <label htmlFor="selfieURL">Selfie:</label>
              <input
                type="file"
                name="selfieURL"
                id="selfieURL"
                accept="image/*, .jpg,.png,.bmp,.gif,.webp,.jpeg"
                onChange={async (e) => {
                  let file;
                  if (!(file = e.target.files?.[0])) return;
                  setUploading(true);
                  const formData = new FormData();
                  formData.append("source", file);

                  const res = await fetch("/api/image-upload", {
                    method: "POST",
                    body: formData,
                  });
                  if (res.status !== 200) {
                    setFieldError(
                      "selfieURL",
                      "Error uploading image. You may have attached a bad file."
                    );
                    setUploading(false);
                    return;
                  }
                  const body = await res.json();
                  setFieldValue("selfieURL", body.image.url);
                  e.target.value = "";
                  setUploading(false);
                }}
              />
              <div className="w-full flex justify-center relative items-center mt-2">
                {values.selfieURL ? (
                  <span className="relative">
                    <img
                      src={values.selfieURL}
                      className="max-w-full max-h-44 rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 p-0 bg-black bg-opacity-20 rounded-full"
                      onClick={() => {
                        setFieldValue("selfieURL", null);
                      }}
                    >
                      <BiXCircle className="w-10 h-10 text-white" />
                    </button>
                  </span>
                ) : (
                  "No selfie selected."
                )}
              </div>
              <FormError name="selfieURL" disabled={uploading} />
            </FormQuestion>
            <br />

            <RoundButton disabled={isSubmitting} type="submit">
              Submit{isSubmitting && "ting"} Exec Desc
            </RoundButton>
          </Form>
        );
      }}
    </Formik>
  );
};

export const ExecForm: FC<Props> = ({ mode, setOpen }) => {
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
      ) : account.data?.position == "EXEC" ? (
        <FormContent mode={mode} setOpen={setOpen} />
      ) : (
        "You are not an exec."
      )}
    </PopupUI>
  );
};
