"use client";
import { TRPCError, trpc } from "@/app/(api)/api/trpc/client";
import { Field, Form, Formik } from "formik";
import { FC, useState } from "react";
import { FormError, RequestError } from "../ui/error";
import { FormQuestion } from "../ui/container";
import { Giveaway, GiveawayType } from "@prisma/client";
import { MarkDownView } from "../ui/md-view";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { createGiveawaySchema } from "@/schema/giveaways";
import { RoundButton, TransparentButton } from "../ui/buttons";
import { useAccount } from "@/providers/account";
import { BiXCircle } from "react-icons/bi";
import { Loading } from "../ui/loading";
import { PopupUI } from "../ui/popup";
import { confirm } from "../ui/confirm";
import { GIVEAWAY_TYPE_MAP } from "@/utils/constants";

type Props = (
  | {
      mode: "create";
      giveaway?: undefined;
      setGiveaway?: undefined;
    }
  | {
      mode: "edit";
      giveaway: Giveaway;
      setGiveaway: (giveaway: Giveaway) => any;
    }
) & {
  setOpen: (open: boolean) => any;
};

const FormContent: FC<Props> = ({ mode, setOpen, giveaway, setGiveaway }) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const createGiveaway = trpc.createGiveaway.useMutation();
  const editGiveaway = trpc.editGiveaway.useMutation();
  const [error, setError] = useState<TRPCError | null>(null);
  const [uploading, setUploading] = useState(false);

  const initialValues = {
    name: mode == "edit" ? giveaway.name : "",
    description: mode == "edit" ? giveaway.description : "",
    endsAt: mode == "edit" ? giveaway.endsAt : null,
    imageURL: mode == "edit" ? giveaway.imageURL : (null as null | undefined),
    maxWinners: mode == "edit" ? giveaway.maxWinners : 1,
    prizes:
      mode == "edit"
        ? (giveaway.prizes as {
            name: string;
            details: string;
          }[])
        : [],
    type: mode == "edit" ? giveaway.type : ("ORDERED_CLAIM" as GiveawayType),
  };

  type FormValues = typeof initialValues;

  return (
    <Formik
      initialValues={initialValues}
      validate={(data) => {
        setError(null);
        let values = { ...data };

        try {
          createGiveawaySchema.parse(values);
        } catch (err) {
          if (err instanceof ZodError) {
            console.log(err.issues);
            const error = err;
            let prizes = data.prizes.map((_item, index) => {
              const map: { [key: string]: string } = {};
              for (const issue of error.issues) {
                if (issue.path[0] == "prizes" && issue.path[1] == index) {
                  map[issue.path[2]] = issue.message;
                }
              }

              return map;
            });

            return {
              ...error.formErrors.fieldErrors,
              prizes: prizes.filter((prize) => {
                return Object.keys(prize).length !== 0;
              }).length
                ? prizes
                : undefined,
            };
          }
        }
      }}
      onSubmit={async (data) => {
        let values = { ...data };

        if (!values.imageURL) delete values.imageURL;

        if (mode == "edit") {
          values = Object.fromEntries(
            Object.entries(values).filter(
              ([key, value]) =>
                value?.valueOf() !==
                initialValues[key as keyof FormValues]?.valueOf()
            )
          ) as typeof values;
        }

        if (Object.keys(values).length == 0) {
          setOpen(false);
          return;
        }

        await (mode == "edit" ? editGiveaway : createGiveaway)
          .mutateAsync(
            {
              ...values,
              id: (mode == "edit" ? giveaway.id : undefined)!,
              endsAt: values.endsAt!,
            },
            {
              onSuccess: (data) => {
                setGiveaway?.({
                  ...giveaway,
                  ...data,
                });
                router.push(`/giveaways/${data.id}`);
                setOpen(false);
              },
              onError: (err) => {
                setError(err);
              },
            }
          )
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
        const errors = {
          ...(Object.fromEntries(
            Object.entries(errorsRaw).map(([key, value]) => [
              key,
              touched[key as keyof FormValues] ? value : undefined,
            ])
          ) as typeof errorsRaw),
          prizes: (errorsRaw.prizes as any[])?.map((item, index) =>
            (touched.prizes as any[])?.[index] ? item : undefined
          ),
        };

        console.log(errors);

        return (
          <Form className="py-2">
            <FormQuestion errored={Boolean(errors.name)}>
              <label htmlFor="name">Name:</label>
              <Field
                id="name"
                name="name"
                type="text"
                placeholder="Giveaway name"
              />
              <FormError name="name" />
            </FormQuestion>
            <br />
            <FormQuestion errored={Boolean(errors.type)}>
              <label htmlFor="type">Giveaway Type:</label>
              <Field name="type" id="type" as="select">
                <option value="">Select a type</option>
                {Object.entries(GIVEAWAY_TYPE_MAP).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field>
              <FormError name="type" />
            </FormQuestion>
            <br />
            <FormQuestion errored={Boolean(errors.description)}>
              <label htmlFor="description">
                Description: ({4000 - values.description.length} chars
                remaining)
              </label>
              <Field
                name="description"
                id="description"
                as="textarea"
                placeholder="Giveaway description and instructions."
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

            <FormQuestion errored={Boolean(errors.endsAt)}>
              <label htmlFor="endsAt">Giveaway End Time:</label>
              <input
                id="endsAt"
                name="endsAt"
                type="datetime-local"
                value={
                  values.endsAt
                    ? // turn into date time local format with timezone alterations
                      new Date(
                        values.endsAt.getTime() -
                          values.endsAt.getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .slice(0, -1)
                    : ""
                }
                onChange={(e) =>
                  setFieldValue(
                    "endsAt",
                    e.target.value ? new Date(e.target.value) : null
                  )
                }
              />
              <FormError name="endsAt" />
            </FormQuestion>
            <br />

            <FormQuestion errored={Boolean(errors.maxWinners)}>
              <label htmlFor="maxWinners">Max Winners:</label>
              <Field
                id="maxWinners"
                name="maxWinners"
                type="number"
                min={0}
                placeholder="maxWinners"
              />
              <FormError name="maxWinners" />
            </FormQuestion>
            <br />
            <FormQuestion
              className="w-96 max-w-full"
              errored={Boolean(
                errors.prizes?.some((v) => v && Object.keys(v).length) ||
                  errorsRaw["prize" as keyof typeof errorsRaw]
              )}
            >
              <label htmlFor="prizes">Prizes:</label>
              <div className="flex gap-2 flex-col mb-2">
                {values.prizes.map((prize, index) => (
                  <div key={index} className="flex flex-col">
                    <Field
                      name={`prizes.${index}.name`}
                      type="text"
                      placeholder="Prize name"
                    />

                    <FormError name={`prizes.${index}.name`} />
                    <Field
                      name={`prizes.${index}.details`}
                      as="textarea"
                      placeholder="Prize details"
                    />
                    <FormError name={`prizes.${index}.details`} />
                    <TransparentButton
                      className="px-2 bordered"
                      type="button"
                      onClick={() => {
                        setFieldValue(
                          "prizes",
                          values.prizes.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      Remove
                    </TransparentButton>
                  </div>
                ))}
              </div>
              <TransparentButton
                className="rounded-full px-2 bordered"
                type="button"
                onClick={() => {
                  setFieldValue("prizes", [
                    ...values.prizes,
                    { name: "", details: "" },
                  ]);
                }}
              >
                Add Prize
              </TransparentButton>
              {errorsRaw["prize" as keyof typeof errorsRaw] && (
                <FormError
                  error={errorsRaw[
                    "prize" as keyof typeof errorsRaw
                  ]?.toString()}
                />
              )}
            </FormQuestion>
            <br />

            <FormQuestion errored={Boolean(errors.imageURL)}>
              <label htmlFor="imageURL">Giveaway Image:</label>
              <input
                type="file"
                name="imageURL"
                id="imageURL"
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
                      "imageURL",
                      "Error uploading image. You may have attached a bad file."
                    );
                    setUploading(false);
                    return;
                  }
                  const body = await res.json();
                  setFieldValue("imageURL", body.image.url);
                  e.target.value = "";
                  setUploading(false);
                }}
              />
              <div className="w-full flex justify-center relative items-center mt-2">
                {values.imageURL ? (
                  <span className="relative">
                    <img
                      src={values.imageURL}
                      className="max-w-full max-h-44 rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 p-0 bg-black bg-opacity-20 rounded-full"
                      onClick={() => {
                        setFieldValue("imageURL", null);
                      }}
                    >
                      <BiXCircle className="w-10 h-10 text-white" />
                    </button>
                  </span>
                ) : (
                  "No image selected."
                )}
              </div>
              <FormError name="imageURL" disabled={uploading} />
            </FormQuestion>
            <br />
            <RoundButton disabled={isSubmitting} type="submit">
              Submit{isSubmitting && "ting"} Giveaway
            </RoundButton>
          </Form>
        );
      }}
    </Formik>
  );
};

export const GiveawayForm: FC<Props> = ({
  mode,
  setOpen,
  giveaway,
  setGiveaway,
}) => {
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
      title={mode == "edit" ? "Edit Giveaway" : "Create Giveaway"}
    >
      {account.status == "loading" ? (
        <Loading loadingType="bar">Loading...</Loading>
      ) : account.status == "error" ? (
        <RequestError error={account.error} className="rounded-none" />
      ) : (account.data?.position || "MEMBER") == "MEMBER" ? (
        "You are not an exec."
      ) : (
        // @ts-ignore
        <FormContent
          mode={mode}
          setOpen={setOpen}
          giveaway={giveaway}
          setGiveaway={setGiveaway}
        />
      )}
    </PopupUI>
  );
};
