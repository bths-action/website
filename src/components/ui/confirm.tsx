"use client";
import { PropsWithChildren } from "react";
import { confirmable, ConfirmDialog, createConfirmation } from "react-confirm";
import { PopupUI } from "./popup";
import { RoundButton } from "./buttons";

const DialogComponent: ConfirmDialog<
  PropsWithChildren<{
    title: string;
  }>,
  boolean
> = ({ show, proceed, children, title }) =>
  show && (
    <PopupUI setOpen={proceed} title={title} size="small">
      <div className="m-2">{children}</div>
      <div className="flex gap-2 m-2 mt-0 justify-center">
        <RoundButton onClick={() => proceed(false)}>Cancel</RoundButton>
        <RoundButton onClick={() => proceed(true)}>Ok</RoundButton>
      </div>
    </PopupUI>
  );

const Dialog = confirmable(DialogComponent);

export const confirm = createConfirmation(Dialog);
