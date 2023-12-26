"use client";
import { GetEventsInput } from "@/app/api/trpc/client";
import { Field, Form, Formik } from "formik";
import { Dispatch, FC, SetStateAction } from "react";
import { TransparentButton } from "../ui/buttons";

export const QueryForm: FC<{
  query: GetEventsInput;
  setQuery: Dispatch<SetStateAction<GetEventsInput>>;
}> = ({ query, setQuery }) => {
  return (
    <Formik
      initialValues={query}
      onSubmit={(values) => {
        for (const key in values) {
          if (values[key as keyof typeof values] == null) {
            delete values[key as keyof typeof values];
          }
        }
        setQuery(values);
      }}
    >
      {({ setFieldValue, values }) => {
        return (
          <Form className="my-2 bordered rounded-lg py-2">
            <Field
              // for text search
              name="search"
              type="text"
              placeholder="Search"
              className=""
            />
            <TransparentButton type="submit" className="px-2 bordered">
              Search
            </TransparentButton>
            <br />
            <div className="flex justify-center items-center flex-wrap gap-1">
              <h6>Availability Status:</h6>
              <label className="choice">
                <Field
                  name="includeStatus.available"
                  type="checkbox"
                  className="mr-1"
                />
                Available
              </label>
              <label className="choice">
                <Field
                  name="includeStatus.unavailable"
                  type="checkbox"
                  className="mr-1"
                />
                Unavailable
              </label>
              <label className="choice">
                <Field
                  name="includeStatus.upcoming"
                  type="checkbox"
                  className="mr-1"
                />
                Upcoming
              </label>
            </div>
            <div className="flex justify-center items-center flex-wrap">
              <h6>Order By:</h6>
              <Field name="orderBy" as="select" className="mr-0">
                <option value="createdAt">Created At</option>
                <option value="eventTime">Event Time</option>
              </Field>
              <Field name="order" as="select" className="ml-0">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Field>
            </div>
            <div className="flex justify-center items-center flex-wrap gap-1">
              <h6>Event Range: {values.startRange?.toISOString()}</h6>

              <input
                name="startRange"
                type="datetime-local"
                className="mr-1"
                placeholder="Start"
                onChange={(e) => {
                  setFieldValue(
                    "startRange",
                    e.target.value ? new Date(e.target.value) : null
                  );
                }}
              />
              <input
                name="endRange"
                type="datetime-local"
                className="ml-1"
                placeholder="End"
                onChange={(e) => {
                  setFieldValue(
                    "endRange",
                    e.target.value ? new Date(e.target.value) : null
                  );
                }}
              />
            </div>
            To prevent abuse, the results may be cached and slightly out of
            date.
          </Form>
        );
      }}
    </Formik>
  );
};
