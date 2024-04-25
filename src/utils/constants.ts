import { ExecPosition, GiveawayType } from "@prisma/client";
import { ReactNode } from "react";

export const OLDEST_GRAD_YEAR = 2024;
export const YOUNGEST_GRAD_YEAR = 2027;
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
export type GiveawayPrize = {
  name: string;
  details: string;
};

export const DISCORD_INVITE_LINK = "https://discord.gg/TepH9vuqn4";

export const MAX_CREDITS = 12;
export const BASE_URL = process.env.VERCEL_URL
  ? `https://bthsaction.org`
  : `http://localhost:3000`;

export const GIVEAWAY_TYPE_MAP: Record<GiveawayType, string> = {
  RANDOM: "Random",
  FIRST_CLAIM: "First Claim",
  ORDERED_CLAIM: "Ordered Claim",
} as const;

export const BANNED_USERS = ["junchaol2@nycstudents.net"];

export const REFERRAL_POINTS = 5;
export const REFERRAL_ENTRIES = 0.5;
export const MAX_REFERRALS = 20;
export const CREDIT_RATE = 25;

export const PRIMARY_COLOR = "#19b1a0";
export const PRIMARY_COLOR_HEX = 0x19b1a0;
