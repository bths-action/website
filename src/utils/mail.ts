import formData from "form-data";
import Mailgun from "mailgun.js";
import { convert } from "html-to-text";

/**
 * bthsaction.org is on a restricted Mailgun account that cannot send large
 * batches yet. Measured limits (testmode):
 *
 *   8 recipients in one message  -> OK
 *   9 recipients in one message  -> OK
 *   10 recipients in one message -> 403 "not allowed to send large batches yet"
 *   26 recipients in 30 seconds  -> OK
 *   27th recipient in 30 seconds -> 420 "recipient limit (26) exceeded"
 *
 * So every send is split into small messages and paced. Members are batched
 * with a fixed discard-route `To:` address so their addresses stay hidden.
 * These are overridable in case the account is upgraded and limits are lifted.
 */
const MAX_RECIPIENTS_PER_MESSAGE = readPositiveInt(
  process.env.MAILGUN_MAX_RECIPIENTS_PER_MESSAGE,
  9
);
const RECIPIENT_WINDOW_LIMIT = readPositiveInt(
  process.env.MAILGUN_RECIPIENT_WINDOW_LIMIT,
  26
);
const RECIPIENT_WINDOW_MS =
  readPositiveInt(process.env.MAILGUN_RECIPIENT_WINDOW_SECONDS, 30) * 1000;

/**
 * Fixed `To:` for member batches. Mailgun rejects an empty `To:`, so this
 * address is used instead of exposing a member. It is never delivered: the
 * Mailgun route `match_recipient("noreply@bthsaction.org")` -> `stop()`
 * discards it (the account's catch-all route would otherwise forward it).
 */
const NOREPLY_ADDRESS =
  process.env.MAILGUN_NOREPLY_ADDRESS ??
  "BTHS Action <noreply@bthsaction.org>";

/** One recipient slot is reserved for NOREPLY_ADDRESS. */
const MEMBER_BATCH_SIZE = Math.max(1, MAX_RECIPIENTS_PER_MESSAGE - 1);

/** Retries for a single message when Mailgun rate-limits us. */
const MAX_ATTEMPTS = 5;
const MAX_RETRY_WAIT_MS = 5 * 60 * 1000;

export type SendEmailData = { subject: string; html: string };

export type SendEmailOptions = {
  /** Primary recipients. These are kept in `To:` where the limits allow it. */
  recipient?: string | string[];
  /** Secondary recipients, sent as `Bcc:` in small batches. */
  bcc?: string[];
  /**
   * Called after each Mailgun request succeeds, with the addresses that
   * request covered. Used to persist who has already received the email so a
   * later resend can skip them.
   */
  onChunkSent?: (emails: string[]) => Promise<void> | void;
  /**
   * Called before waiting out a rate limit. Long Mailgun waits must not look
   * like a dead send to whatever is watching progress.
   */
  onRateLimitWait?: (waitMs: number) => Promise<void> | void;
};

export type SendEmailResult = {
  id: string;
  ids: string[];
  messages: number;
  recipientCount: number;
};

/** Module-level so concurrent sends in one process share the same budget. */
const recentSends: { at: number; recipients: number }[] = [];

export async function sendEmail(
  data: SendEmailData,
  options?: SendEmailOptions
): Promise<SendEmailResult> {
  const mg = createMailgunClient();
  const execs = dedupe(toArray(options?.recipient));
  const execEmails = new Set(execs.map((email) => email.toLowerCase()));
  const members = dedupe(toArray(options?.bcc)).filter(
    (email) => !execEmails.has(email.toLowerCase())
  );

  // Execs first, so the first message can keep them in `To:`.
  const queue = [...execs, ...members];
  if (queue.length === 0) {
    throw new Error("No email recipients were provided.");
  }

  const ids: string[] = [];
  let cursor = 0;
  let sentCount = 0;
  let messages = 0;
  let maxPerMessage = MAX_RECIPIENTS_PER_MESSAGE;

  sendLoop: while (cursor < queue.length) {
    const inExecRegion = cursor < execs.length;

    // Execs go out together (they are already listed publicly on /executives).
    // Members go out in batches of 8 addressed to a fixed `noreply@` that has
    // a discard route, so no member's address is visible to any other member.
    const size = inExecRegion
      ? await availableChunkSize(
          Math.min(maxPerMessage, queue.length - cursor)
        )
      : await memberBatchSize(maxPerMessage, queue.length - cursor);

    const slice = queue.slice(cursor, cursor + size);
    const chunk = inExecRegion
      ? buildChunk(slice, execEmails)
      : { to: [NOREPLY_ADDRESS], bcc: slice };

    // The noreply `To:` occupies a recipient slot too.
    const countedRecipients = slice.length + (inExecRegion ? 0 : 1);

    let attempt = 0;
    for (;;) {
      attempt += 1;
      const startedAt = Date.now();

      try {
        const response = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
          from: "BTHS Action <events@bthsaction.org>",
          to: chunk.to,
          ...(chunk.bcc.length ? { bcc: chunk.bcc } : {}),
          subject: data.subject,
          html: data.html,
          text: convert(data.html),
        });

        // Count the message against the rolling window from the moment the
        // request started, which is when Mailgun evaluates the limit.
        recentSends.push({ at: startedAt, recipients: countedRecipients });

        cursor += slice.length;
        sentCount += slice.length;
        messages += 1;
        if (response?.id) ids.push(response.id);

        await options?.onChunkSent?.(slice);
        break;
      } catch (error) {
        const { status, message } = describeMailgunError(error);

        // Too many recipients for a single message: retry it in smaller
        // pieces rather than failing the whole send.
        if (
          status === 403 &&
          /large batches/i.test(message) &&
          slice.length > 1
        ) {
          maxPerMessage = Math.max(1, Math.floor(slice.length / 2));
          continue sendLoop;
        }

        const retryAt =
          status === 420 || status === 429 ? parseRetryTime(message) : null;
        if (retryAt !== null && attempt <= MAX_ATTEMPTS) {
          const wait = Math.min(
            Math.max(retryAt - Date.now() + 500, 1_000),
            MAX_RETRY_WAIT_MS
          );
          await options?.onRateLimitWait?.(wait);
          await sleep(wait);
          continue;
        }

        const partial =
          sentCount > 0
            ? ` ${sentCount} of ${queue.length} recipients already received it; press Resend again to continue with the rest.`
            : "";
        throw new Error(
          `Email could not be sent${status ? ` (HTTP ${status})` : ""}: ${message}.${partial}`
        );
      }
    }
  }

  return {
    id: ids[0] ?? "",
    ids,
    messages,
    recipientCount: sentCount,
  };
}

function createMailgunClient() {
  const mailgun = new Mailgun(formData);
  return mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
    // Only set for tests that point the client at a local stub instead of the
    // real API.
    ...(process.env.MAILGUN_API_BASE_URL
      ? { url: process.env.MAILGUN_API_BASE_URL }
      : {}),
  });
}

/**
 * Blocks until the rolling recipient window has room, then returns how many
 * recipients the next message may contain.
 */
async function availableChunkSize(requested: number): Promise<number> {
  for (;;) {
    const now = Date.now();
    pruneWindow(now);

    const used = recentSends.reduce((sum, entry) => sum + entry.recipients, 0);
    const available = RECIPIENT_WINDOW_LIMIT - used;
    if (available > 0) return Math.min(available, requested);

    const wait = recentSends[0].at + RECIPIENT_WINDOW_MS - now + 250;
    await sleep(Math.max(wait, 250));
  }
}

/**
 * Returns how many members fit in the next message, reserving one recipient
 * slot for NOREPLY_ADDRESS. Shrinks automatically if Mailgun rejects a batch.
 */
async function memberBatchSize(maxRecipients: number, remaining: number) {
  const maxMembers = Math.max(
    1,
    Math.min(MEMBER_BATCH_SIZE, maxRecipients - 1)
  );
  const requested = Math.min(maxMembers, remaining);

  for (;;) {
    const capacity = await availableChunkSize(requested + 1);
    if (capacity > 1) return Math.min(capacity, requested + 1) - 1;
    await sleep(1_000);
  }
}

function pruneWindow(now: number) {
  while (
    recentSends.length > 0 &&
    now - recentSends[0].at >= RECIPIENT_WINDOW_MS
  ) {
    recentSends.shift();
  }
}

/**
 * Builds the `To:`/`Bcc:` split for a batch that starts with execs. Execs stay
 * in `To:`; member addresses that fill the rest of the batch go in `Bcc:`.
 */
function buildChunk(slice: string[], execEmails: Set<string>) {
  const to = slice.filter((email) => execEmails.has(email.toLowerCase()));
  if (to.length === 0) to.push(slice[0]);

  const toEmails = new Set(to.map((email) => email.toLowerCase()));
  return {
    to,
    bcc: slice.filter((email) => !toEmails.has(email.toLowerCase())),
  };
}

function describeMailgunError(error: unknown) {
  const err = error as {
    status?: number;
    message?: string;
    details?: string;
  };

  // mailgun.js puts the API body's message in `details` and the HTTP status
  // text ("Forbidden") in `message`, which is why the UI used to show
  // "Forbidden" instead of the real reason. Prefer whichever is descriptive.
  const generic = new Set([
    "forbidden",
    "unauthorized",
    "bad request",
    "not found",
    "too many requests",
    "internal server error",
  ]);
  const candidates = [err?.details, err?.message]
    .map((value) => value?.trim())
    .filter((value): value is string => !!value);
  const message =
    candidates.find((value) => !generic.has(value.toLowerCase())) ??
    err?.message?.trim() ??
    err?.details?.trim() ??
    "Unknown Mailgun error";

  return {
    status: typeof err?.status === "number" ? err.status : undefined,
    message,
  };
}

function parseRetryTime(message: string): number | null {
  const match = message.match(/try again after (.+)$/i);
  if (!match) return null;

  const time = Date.parse(match[1]);
  return Number.isNaN(time) ? null : time;
}

function toArray(value?: string | string[]): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function dedupe(emails: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const email of emails) {
    const key = email.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(email.trim());
  }

  return result;
}

function readPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
