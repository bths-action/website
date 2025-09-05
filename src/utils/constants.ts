import { ExecPosition } from "@prisma/client";
import { ReactNode } from "react";

export const OLDEST_GRAD_YEAR = 2026;
export const YOUNGEST_GRAD_YEAR = 2029;
export const GRAD_YEARS = Array.from(
  { length: YOUNGEST_GRAD_YEAR - OLDEST_GRAD_YEAR + 1 },
  (_, i) => OLDEST_GRAD_YEAR + i
);
export const POSITIONS = [
  "PRESIDENT",
  "VICE_PRESIDENT",
  "SECRETARY",
  "TREASURER",
  "EVENT_COORDINATOR",
] as const;
export const POSITIONS_MAP: Record<ExecPosition, string> = {
  PRESIDENT: "President",
  VICE_PRESIDENT: "Vice President",
  SECRETARY: "Secretary",
  TREASURER: "Treasurer",
  EVENT_COORDINATOR: "Event Coordinator",
} as const;
export type Status = "loading" | "unauthorized" | "success" | "error";
export type NodeMap<T extends string | number | symbol> = {
  [key in T]: ReactNode;
};

export const DISCORD_INVITE_LINK = "https://discord.gg/TepH9vuqn4";
// our club can give out 6 credits per semester
export const MAX_CREDITS = 6;
export const BASE_URL = process.env.VERCEL_URL
  ? `https://bthsaction.org`
  : `http://localhost:3000`;

export const BANNED_USERS = [""];

export const REFERRAL_POINTS = 5;
export const REFERRAL_ENTRIES = 0.5;
export const MAX_REFERRALS = 20;
export const CREDIT_RATE = 20;

export const PRIMARY_COLOR = "#19b1a0";
export const PRIMARY_COLOR_HEX = 0x19b1a0;
