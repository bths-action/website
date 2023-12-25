"use client";
import { Form, Formik } from "formik";
import { FC } from "react";

export const QueryForm: FC = () => {
  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      <Form></Form>
    </Formik>
  );
};
