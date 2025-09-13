"use client";
import { TRPCError, trpc } from "@/app/(api)/api/trpc/client";
import { useAccount } from "@/providers/account";
import { Field, Form, Formik } from "formik";
import { FC, useState } from "react";
import { RoundButton } from "../ui/buttons";
import { PopupUI } from "../ui/popup";
import { confirm } from "../ui/confirm";
import { Loading } from "../ui/loading";
import { FormError, RequestError } from "../ui/error";
import { FormQuestion } from "../ui/container";
import { Event } from "@prisma/client";
import { MarkDownView } from "../ui/md-view";
import { createEventSchema } from "@/schema/events";
import { ZodError } from "zod";
import { BiXCircle } from "react-icons/bi";
import { useRouter } from "next/navigation";

type Props = (
  | {
      mode: "create";
      event?: undefined;
      setEvent?: undefined;
    }
  | {
      mode: "edit";
      event: Event;
      setEvent: (event: Event) => any;
    }
) & {
  setOpen: (open: boolean) => any;
};

const TEMPLATES: { name: string; image: string; content: string }[] = [
  {
    name: "Club Meeting",
    image: "",
    content: ``,
  },
];

const FormContent: FC<Props> = ({ mode, setOpen, event, setEvent }) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const createEvent = trpc.createEvent.useMutation();
  const editEvent = trpc.editEvent.useMutation();
  const [error, setError] = useState<TRPCError | null>(null);
  const [uploading, setUploading] = useState(false);
  const [shownTemplates, setShownTemplates] = useState(false);

  const initialValues = {
    name: mode == "edit" ? event.name : "",
    description: mode == "edit" ? event.description : "",
    maxHours: mode == "edit" ? event.maxHours : 0,
    maxPoints: mode == "edit" ? event.maxPoints : 0,
    eventTime: mode == "edit" ? event.eventTime : null,
    finishTime: mode == "edit" ? event.finishTime : null,
    registerBefore: mode == "edit" ? event.registerBefore : true,
    address: mode == "edit" ? event.address : "",
    limit: mode == "edit" ? event.limit || 0 : (0 as number | null),
    serviceLetters: mode == "edit" ? event.serviceLetters : null,
    imageURL: mode == "edit" ? event.imageURL : null,
  };

  type FormValues = typeof initialValues;

  return (
    <Formik
      initialValues={initialValues}
      validate={(data) => {
        setError(null);
        let values = { ...data };
        if (!values.limit) values.limit = null;
        if (!values.serviceLetters) values.serviceLetters = null;

        try {
          createEventSchema.parse(values);
        } catch (err) {
          if (err instanceof ZodError) {
            return err.formErrors.fieldErrors;
          }
        }
      }}
      onSubmit={async (data) => {
        let values = { ...data };
        if (!values.limit) values.limit = null;
        if (!values.serviceLetters) values.serviceLetters = null;

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

        await (mode == "edit" ? editEvent : createEvent)
          .mutateAsync(
            {
              ...values,
              id: (mode == "edit" ? event.id : undefined)!,
              eventTime: values.eventTime!,
              finishTime: values.finishTime!,
            },
            {
              onSuccess: (data) => {
                setEvent?.({
                  ...event,
                  ...data,
                });
                router.push(`/events/${data.id}`);
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
        const errors = Object.fromEntries(
          Object.entries(errorsRaw).map(([key, value]) => [
            key,
            touched[key as keyof FormValues] ? value : undefined,
          ])
        ) as typeof errorsRaw;
        return (
          <>
            {shownTemplates && (
              <PopupUI
                setOpen={setShownTemplates}
                title="Templates"
                size="large"
              >
                dsds
              </PopupUI>
            )}
            <Form className="py-2">
              <a
                className="default"
                onClick={() => {
                  setShownTemplates(true);
                }}
              >
                Use a template.
              </a>
              <br />
              <FormQuestion errored={Boolean(errors.name)}>
                <label htmlFor="name">Name:</label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Event name"
                />
                <FormError name="name" />
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
                  placeholder="Event description and instructions."
                  maxLength={5000}
                  className="w-full h-60 p-1 rounded-md"
                />
                <FormError name="description" />
              </FormQuestion>
              <br />
              {values.description && (
                <div className="mx-2 bg-gray-500/20 overflow-auto break-words p-1 rounded-md">
                  <MarkDownView>{values.description}</MarkDownView>
                </div>
              )}
              <FormQuestion errored={Boolean(errors.maxHours)}>
                <label htmlFor="maxHours">Max Hours:</label>
                <Field
                  id="maxHours"
                  name="maxHours"
                  type="number"
                  step={0.25}
                  min={0}
                  placeholder="Max hours"
                />
                <FormError name="maxHours" />
              </FormQuestion>
              <br />
              <FormQuestion errored={Boolean(errors.maxPoints)}>
                <label htmlFor="maxPoints">Max Points:</label>
                <Field
                  id="maxPoints"
                  name="maxPoints"
                  step={0.1}
                  type="number"
                  min={0}
                  placeholder="Max points"
                />
                <FormError name="maxPoints" />
              </FormQuestion>
              <br />
              <FormQuestion errored={Boolean(errors.eventTime)}>
                <label htmlFor="eventTime">Event Time:</label>
                <input
                  id="eventTime"
                  name="eventTime"
                  type="datetime-local"
                  value={
                    values.eventTime
                      ? // turn into date time local format with timezone alterations
                        new Date(
                          values.eventTime.getTime() -
                            values.eventTime.getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .slice(0, -1)
                      : ""
                  }
                  onChange={(e) =>
                    setFieldValue(
                      "eventTime",
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                />
                <FormError name="eventTime" />
              </FormQuestion>
              <br />

              <FormQuestion errored={Boolean(errors.finishTime)}>
                <label htmlFor="finishTime">Finish Time:</label>
                <input
                  id="finishTime"
                  name="finishTime"
                  type="datetime-local"
                  value={
                    values.finishTime
                      ? // turn into date time local format with timezone alterations
                        new Date(
                          values.finishTime.getTime() -
                            values.finishTime.getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .slice(0, -1)
                      : ""
                  }
                  onChange={(e) => {
                    const time = new Date(e.target.value);
                    setFieldValue(
                      "finishTime",
                      e.target.value ? new Date(e.target.value) : null
                    );
                  }}
                />
                <FormError name="finishTime" />
              </FormQuestion>
              <br />
              <FormQuestion errored={Boolean(errors.registerBefore)}>
                <label
                  htmlFor="registerBefore"
                  className="flex items-center flex-wrap gap-1"
                >
                  <Field
                    id="registerBefore"
                    name="registerBefore"
                    type="checkbox"
                  />
                  Uncheck this if you want people to register between the above
                  times.
                </label>
                <FormError name="registerBefore" />
              </FormQuestion>
              <br />
              <FormQuestion errored={Boolean(errors.address)}>
                <label htmlFor="address">Address:</label>
                <Field
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Address"
                />
                <FormError name="address" />
              </FormQuestion>
              <br />
              {values.address && (
                <div className="mx-2 p-1">
                  <iframe
                    src={encodeURI(
                      `https://maps.google.com/maps?q=${values.address}&t=&z=13&ie=UTF8&iwloc=&output=embed`
                    )}
                    className="border-none w-full rounded-lg h-60"
                  ></iframe>
                </div>
              )}

              <FormQuestion errored={Boolean(errors.limit)}>
                <label htmlFor="limit">Limit:</label>
                <Field
                  id="limit"
                  name="limit"
                  type="number"
                  min={0}
                  placeholder="Limit"
                />
                <FormError name="limit" />
              </FormQuestion>
              <br />

              <FormQuestion errored={Boolean(errors.serviceLetters)}>
                <label htmlFor="serviceLetters">Service Letters:</label>
                <Field id="serviceLetters" name="serviceLetters" type="url" />
                <FormError name="serviceLetters" />
              </FormQuestion>
              <br />

              <FormQuestion errored={Boolean(errors.imageURL)}>
                <label htmlFor="imageURL">Event Image:</label>
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
                        className="absolute top-0 right-0 p-0 bg-black/20 rounded-full"
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
                Submit{isSubmitting && "ting"} Event
              </RoundButton>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export const EventForm: FC<Props> = ({ mode, setOpen, event, setEvent }) => {
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
      title={mode == "edit" ? "Edit Event" : "Create Event"}
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
          event={event}
          setEvent={setEvent}
        />
      )}
    </PopupUI>
  );
};
