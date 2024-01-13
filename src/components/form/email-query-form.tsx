import { GetEmailsInput, trpc } from "@/app/api/trpc/client";
import { GRAD_YEARS } from "@/utils/constants";
import { Field, Form, Formik } from "formik";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { PopupUI } from "../ui/popup";
import { ColorButton } from "../ui/buttons";
import { confirm } from "../ui/confirm";
import { RequestError } from "../ui/error";

interface Props {
  setOpen: (open: boolean) => any;
}

const EmailQueryContent: FC = () => {
  const [data, setData] = useState<GetEmailsInput>({
    eventAlerts: true,
    gradYears: GRAD_YEARS,
  });
  const query = trpc.getEmails.useQuery(data);

  useEffect(() => {
    if (query.status == "error") {
      confirm({
        title: "Error",
        children: (
          <>
            An error occured trying to fetch.
            <RequestError error={query.error} />
          </>
        ),
      });
    }
  }, [query.status]);

  return (
    <Formik
      initialValues={data}
      onSubmit={(data) => {
        setData(data);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <label htmlFor="eventAlerts">Event Alerts: </label>
          <select
            name="eventAlerts"
            id="eventAlerts"
            value={
              values.eventAlerts == undefined
                ? "undefined"
                : values.eventAlerts.toString()
            }
            onChange={({ currentTarget: { value } }) => {
              setFieldValue(
                "eventAlerts",
                value == "undefined" ? undefined : value == "true"
              );
            }}
          >
            <option value="undefined">Both</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <br />

          <label htmlFor="sgoSticker">Sgo Sticker: </label>
          <select
            name="sgoSticker"
            id="sgoSticker"
            value={
              values.sgoSticker == undefined
                ? "undefined"
                : values.sgoSticker.toString()
            }
            onChange={({ currentTarget: { value } }) => {
              setFieldValue(
                "sgoSticker",
                value == "undefined" ? undefined : value == "true"
              );
            }}
          >
            <option value="undefined">Both</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <br />

          <label>Grad Years: </label>
          <br />
          {GRAD_YEARS.map((year) => {
            return (
              <label
                key={year}
                className="flex justify-center items-center gap-1"
              >
                <Field
                  type="checkbox"
                  name="gradYears"
                  value={year}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setFieldValue(
                      "gradYears",
                      e.currentTarget.checked
                        ? [...values.gradYears!, year]
                        : values.gradYears!.filter((y) => y != year)
                    );
                  }}
                />
                {year}
              </label>
            );
          })}
          <ColorButton color="default" innerClass="p-2" type="submit">
            Submit
          </ColorButton>
          <div className="h-64 bg-gray-400 bg-opacity-30 m-2 rounded-lg overflow-auto">
            <code>
              {query.status == "loading"
                ? "Loading..."
                : query.status == "error"
                ? "Error!"
                : query.data.join(", ")}
            </code>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export const EmailQueryForm: FC<Props> = ({ setOpen }) => {
  return (
    <PopupUI title="Email Query" setOpen={setOpen}>
      <EmailQueryContent />
    </PopupUI>
  );
};
