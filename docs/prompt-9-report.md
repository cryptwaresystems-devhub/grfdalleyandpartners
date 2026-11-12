# Prompt 9 - Contact experience

Implemented on the existing main branch without replacing pages or changing production DNS.

## Delivered

- General enquiry and separate consultation-request forms using shared client/server validation, associated errors, focusable error summaries, required fields, optional phone/message, loading and acceptance/error feedback.
- Existing editable mailto draft preserved when delivery is not configured. Real general email links remain available in configured mode.
- Minimal Vercel `/api/contact` endpoint with server-only Resend credentials, fixed recipient `inq@grfdalleyandpartners.com`, verified-domain sender and visitor Reply-To. No database, CMS or additional dependencies.
- Turnstile server-side verification, hostname/action checks, explicit-origin allowlist, honeypot, field/body bounds and provider idempotency keys. Client prevents concurrent sends. Success requires provider acceptance; no claim of inbox receipt.
- Calendly integration accepts only an approved HTTPS Calendly event URL. Click-to-load calendar, external fallback, loading/slow/error messaging. Calendly handles confirmation; an email request or loaded iframe is never presented as a confirmed booking.
- Address-based map links for Lagos and Port Harcourt. Abuja remains explicitly pending. Office-specific phone/hours and current supplied telephone availability require confirmation.
- Setup documentation, environment template and API-safe Vercel routing. Server files included in TypeScript checks; credentials excluded from frontend configuration.

## Verification

- 72 automated tests pass: 54-route audit, navigation, shared validation, field errors, pending-mode draft editing, configured form loading/double-submit prevention, mocked provider acceptance/failures, spam hostname/action checks, fixed recipient, idempotency key, HTTP adapter method/content-type/body handling and click-to-load calendar behavior.
- Responsive CSS checks cover 320, 390, 768, 1024 and 1440px; accessible labels and unique IDs include both forms.
- TypeScript, ESLint (zero warnings) and production build pass.
- Production frontend: application JS approximately 196.3 kB (36.0 kB gzip), vendor JS 321.8 kB (103.0 kB gzip), CSS 55.9 kB (11.0 kB gzip).
- Actual browser unavailable in this session. No screenshot, live visual QA or real third-party integration result is claimed.
- No real message sent. Provider tests use injected mocks and fixture values only. No booking made.

## Pending configuration and approvals

No authorized delivery-test credentials, verified sender, Turnstile settings, allowed origins or approved Calendly URL were available. Services therefore remain visibly pending. Complete [contact setup](contact-services-setup.md), then verify actual authorized inbox receipt and Calendly behavior on staging before treating either as live. Vite's frontend-only dev/preview commands do not serve the Vercel endpoint; use `npx vercel dev` or a staging Preview deployment for full-stack checks.

Abuja address, office-specific contacts/hours and telephone availability remain open. Privacy, cookie consent and analytics belong to Prompt 10 and have not been claimed complete. No production deployment or DNS change was performed.
