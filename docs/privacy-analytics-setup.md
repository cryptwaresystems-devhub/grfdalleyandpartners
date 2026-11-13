# Privacy, consent and GA4 setup

Status on 13 November 2026: implementation prepared; approved Privacy Policy, consent wording/implementation approval and real GA4 property configuration remain pending. This document records technical behavior, not legal advice or an approved Privacy Policy.

## Legal content and production guard

The WRS and Scope of Work require the Firm to supply its legal text. No approved policy was present in the reviewed project materials. `/privacy` displays an explicit pending notice instead of fabricated legal text. Requester-authorized marketing content cannot satisfy this legal approval gate.

Populate `src/data/privacy.ts` only from the firm's approved legal text. Record source, named approver, approval date and effective date; put the exact approved paragraphs under their headings. `status: approved` requires complete, valid, non-future metadata and nonempty sections. Draft text is not rendered, including in management preview. React renders paragraphs as text, without raw HTML.

Record approval of the cookie notice, purpose categories and implementation in `cookieNoticeApproval`. The present controls are first-party, with no hosted CMP account or third-party consent script. The SOW mentions a third-party cookie consent mechanism: obtain client acceptance of these controls or select and integrate an approved CMP before launch. Do not record an approval that was not supplied.

Production checks:

- `npm.cmd run launch:check` reports missing legal dependencies and currently exits with code 1, intentionally.
- `npm.cmd run build:production` performs that check before building.
- Normal Vite builds also enforce the check when `VERCEL_ENV=production`, `SITE_DEPLOYMENT_TARGET=production`, or Vite mode is `production-release`. Vercel's production environment cannot be overridden by a staging target flag.
- `npm.cmd run build` remains available for staging; noindex HTML and generated robots.txt remain in place. Prompt 11 replaces the blanket noindex response header with per-page metadata so an approved release can eventually be indexed. A production bundle is not approval to launch. Any other hosting pipeline must use the production command/target check.
- Do not bypass the guard, remove noindex, change DNS or manually publish production while legal dependencies remain open. The guard checks recorded content approval, not legal accuracy or full production acceptance.

## Consent behavior

The banner offers equally styled Accept optional cookies and Reject optional cookies, plus granular preferences. Analytics and optional media default off. Closing the preferences dialog without saving does not grant permission. The footer always offers Cookie preferences; the dialog supports Escape, focus trapping, focus restoration, background inertness and labelled keyboard-operable checkboxes.

`grf-cookie-preferences` in localStorage contains only a schema version, analytics/media booleans and timestamp. It expires after 180 days. Missing, corrupt, future-dated, incompatible and expired records fail closed; denied choices are remembered too. Storage failures retain the choice in memory and show a warning, rather than preventing access. Storage events synchronize changes/withdrawal between tabs. Expiry is checked on load and on focus, with a timer while open. When material purposes/providers/wording change, increment `CONSENT_VERSION` and obtain renewed consent.

Approved video and Calendly iframes require media permission AND a separate Load action. Granting consent alone does not fetch an embed. Withdrawal removes mounted iframes. External links remain available without embedding a provider in this site. Cloudflare Turnstile remains an explicitly requested anti-spam service for enquiry submission; accepting analytics is never required to contact the firm. Confirm this classification and provider notices with the firm.

## GA4 configuration

1. Obtain the client's authorized Google Analytics property/web stream or arrange setup with the approved Google account. No Google account/property was created or accessed in this task.
2. Put its public `G-...` measurement ID in `VITE_GA4_MEASUREMENT_ID`. This is a public identifier, not a secret API credential. No Measurement Protocol secret, Google account credentials or service-account key belongs in this app.
3. In the GA4 web stream, disable Enhanced Measurement, including history-based automatic page views, form interactions, site-search, outbound clicks and video events. This implementation sends manual route page views. Do not install a second GA/GTM snippet in HTML or via another provider. `send_page_view: false` alone does not disable history-based enhanced pageviews.
4. Only after verifying those stream settings set `VITE_GA4_MANUAL_PAGEVIEWS_CONFIRMED=true`. Without this flag, a valid ID and approved policy/notice, the app does not load GA4 even when optional analytics is accepted.
5. Rebuild for environment changes. Test on a staging property with explicit consent and an authorized account; verify Realtime/DebugView behavior before claiming live tracking. Do not paste credentials into chat or commit `.env` files.

Behavior: basic consent gating makes no Google script request or consent ping before analytics permission. After permission, exactly one loader/config is used per page lifetime; `send_page_view` is disabled and React Router pathname changes generate manual views. Same-path query/hash/filter changes do not add pageviews. Returning to a different page does. React StrictMode setup does not duplicate loaded views/configuration.

Events use an origin plus a recognized pathname and static route title. Query strings, fragments, referrers, directory-search text, contact fields and unknown raw paths are excluded. Unknown paths are aggregated as `/not-found`. There are no form, email-link click, user-ID or conversion events. Advertising storage/user-data/personalization remain denied; Google Signals and ad-personalization signals are disabled. GA cookies are configured for 180 days without automatic expiry renewal. Client approval of purpose/retention, Google provider terms, GA4 property retention/access settings and any applicable data-transfer obligations remain open.

Withdrawing analytics synchronously sets Google's disable flag, drops unsent views, removes the loader and clears accessible first-party `_ga` cookies for this site's host/parent domains at `/`. It sends no denial ping. A script loaded earlier cannot be removed from JavaScript memory, and prior authorized requests cannot be recalled; future application events stay disabled. Regrant reuses an already initialized tag without repeating configuration. Browser or provider blocking never produces a claim that analytics succeeded.

## Contact privacy

Both forms link to `/privacy`, mark legal text pending when appropriate, and advise against confidential case details. They keep fields in component memory; no form content is stored in localStorage or sent to analytics. Name/email are required; phone, message and consultation preferences remain optional. Existing server-side recipient restrictions, validation, challenge verification, origin checks, honeypot and idempotency protections remain intact. Final collection purpose/legal basis, processor arrangements, retention, access rights and firm notices need legal review before launch. See `contact-services-setup.md` for remaining live-delivery configuration.

## Verification and limits

Tests use fake measurement IDs, local DOMs and intercepted script loading; no real Google request, personal enquiry or booking is sent. The full suite checks rejection, granular choices, route pageviews, deduplication, script failures, late script responses after opt-out, GA cookie cleanup, expired/corrupt preferences, legal publication gating, modal keyboard behavior and media withdrawal. Live GA4 property settings/receipt and device/browser QA remain required. The available browser plugin is missing its required runtime, so this session cannot claim live visual/network verification.

Primary references:

- [Google consent setup](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic)
- [Google manual pageviews and enhanced-measurement warning](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [Google single-page applications](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)
- [Google cookie configuration](https://developers.google.com/tag-platform/security/guides/customize-cookies)
