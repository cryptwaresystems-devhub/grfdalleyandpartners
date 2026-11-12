# Contact service setup

Status: UI and adapters implemented; actual email delivery and Calendly configuration are pending. No test email or booking was made. Existing source-checked office details are preserved; Abuja has no confirmed address. Telephone availability, office-specific phone numbers and hours require confirmation.

## Server settings

Configure these as server environment variables in the Vercel staging project. `.env.example` contains names only. Do not commit real values or prefix secrets with `VITE_`.

| Setting | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Restricted sending key for the authorized Resend account |
| `CONTACT_FROM_EMAIL` | Plain email address on the Resend-verified sending domain; not an unverified visitor address |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile server verification secret |
| `TURNSTILE_SITE_KEY` | Corresponding public widget key; configure permitted staging/production hostnames in Cloudflare |
| `CONTACT_ALLOWED_ORIGINS` | Exact permitted website origins separated by commas, e.g. staging URL with protocol and no trailing slash; never use a wildcard |
| `CALENDLY_URL` | Actual client-approved HTTPS calendly.com event URL; leave empty until supplied |

`GET /api/contact` returns only availability, the public widget key when ready, and validated booking URL. All five delivery settings must be present for online sending. Availability indicates configuration presence, not a successful provider test. Changes to Vercel variables require a new deployment. Do not copy credentials from unrelated social-media or historical website documents.

`POST /api/contact` fixes the recipient to `inq@grfdalleyandpartners.com`. It validates types/lengths, approved enquiry choices, sender email and request origin; rejects honeypots and oversized bodies; verifies Turnstile server-side including action and hostname; and submits a plain-text email with the visitor address as Reply-To. The caller cannot choose a recipient. Provider errors and secrets are not returned. The application does not log or persist submitted personal information. Providers may retain it under their policies.

The frontend disables duplicate submissions while sending. An unchanged request reuses its UUID as a Resend idempotency key on retries (within the provider's idempotency retention window). A fresh spam challenge is required after each online attempt. CAPTCHA, origin checks, field bounds and a honeypot are implemented; no database-backed rate limiter is claimed. Configure provider limits and any Vercel firewall rules through the approved service accounts as required.

A 202 response means Resend accepted the message; it does not prove inbox arrival. Consultation requests never reserve appointment times. No automatic acknowledgement email to the visitor is sent.

## Calendly

The optional iframe loads only after a visitor clicks Load Calendly calendar and only for a validated configured URL. An external booking link remains available. Frame loading is not treated as a completed booking. Calendly owns appointment selection, confirmation and its own notices; this app does not independently verify bookings or ingest webhooks. Slow/error states direct the visitor to the genuine booking link. No URL is currently configured.

## Local and staging verification

1. Install with `npm.cmd ci`. Run `npm.cmd run dev` for frontend review. Missing `/api/contact` leaves honest pending messaging and working email drafts.
2. To exercise the endpoint, configure a local uncommitted environment file with authorized test settings and run `npx vercel dev`, or deploy with `npx vercel` to a staging Preview project. A Vercel login/project link may be needed. Do not use `--prod` or change DNS.
3. Add the exact chosen staging origin to `CONTACT_ALLOWED_ORIGINS` and corresponding hostname to Turnstile. Verify the sending domain and recipient authorization. Configure the approved Calendly URL only when supplied.
4. With authorized test credentials, submit a clearly labelled test enquiry and a consultation request. Verify receipt at the authorized destination and Reply-To. Check provider logs without copying message bodies or credentials into the repository.
5. Exercise validation, expired challenge, offline/provider failure, retries, mobile layout and keyboard focus. Confirm the consultation request does not claim an appointment. Test real Calendly availability and its confirmation inside the provider's approved test workflow.
6. Record the live results; do not mark delivery verified based on mocks. No live service verification has yet been performed.

The normal Vite build does not compile/run Vercel functions; TypeScript checks the function and server modules and automated tests exercise its service logic. Vercel builds `/api/contact.ts` separately. `vercel.json` excludes `/api/` from the SPA rewrite. Staging remains noindex.

## Primary integration references

- [Resend email API](https://resend.com/docs/api-reference/emails/send-email)
- [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Cloudflare Turnstile client rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Cloudflare Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Calendly embed documentation](https://calendly.com/help/advanced-calendly-embed-for-developers)
