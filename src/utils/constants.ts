import { ExecPosition } from "@prisma/client";

export const OLDEST_GRAD_YEAR = 2024;
export const YOUNGEST_GRAD_YEAR = 2027;
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
