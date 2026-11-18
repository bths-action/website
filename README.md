# Website built for Action Club
do what every u want with this code ig

## Testing events

Set `TEST_EVENT_WEBHOOK`, `TESTING_EMAIL`, and `TESTING_BCC_EMAIL` in the
server environment before using the testing toggle in the event form. Testing
events post to the testing Discord webhook, send the email to
`TESTING_EMAIL`, and Bcc `TESTING_BCC_EMAIL`.

## Event emails

Mailgun currently limits this domain to 9 recipients per message and 26
recipients per 30 seconds, so `src/utils/mail.ts` splits every event email into
small batches and paces them. Execs are sent together in `To:`. Members go out
in batches of 8 in `Bcc:` with `noreply@bthsaction.org` in `To:`, so no member's
address appears in another member's copy. Override the defaults with
`MAILGUN_MAX_RECIPIENTS_PER_MESSAGE`, `MAILGUN_RECIPIENT_WINDOW_LIMIT`,
`MAILGUN_RECIPIENT_WINDOW_SECONDS`, and `MAILGUN_NOREPLY_ADDRESS` if Mailgun
lifts the restriction. A full send to all members can take a few minutes.
(`MAILGUN_API_BASE_URL` points the client at a local stub; it is only used for
testing the batching logic.)

`noreply@bthsaction.org` must not reach anyone. The domain's catch-all route
forwards all inbound mail to `bthsaction@gmail.com`, so add a higher-priority
route in Mailgun (Receiving -> Routes):

```
match_recipient("noreply@bthsaction.org")  ->  stop()     priority 0
catch_all()                                ->  forward("bthsaction@gmail.com")  priority 50
```

Without the `stop()` route every member batch is forwarded to Gmail (one copy
per batch). The account's API key can send mail but cannot manage routes, so
this route has to be created in the dashboard.

Each successful batch is recorded in `EventEmailRecipient` for that event. The
"Skip people who already received this event" toggle in Edit Event uses that
list, so a repeated or interrupted resend only emails whoever is left.

Unsubscribed members are only included when "send email to all current members"
is checked **and** their account was created on or after January 1, 2024
(`UNSUBSCRIBED_SIGNUP_CUTOFF` in `src/utils/constants.ts`). Older opt-outs
belong to alumni, so they are never emailed by the event form.