# Prompt 10 - Privacy, cookies and analytics

13 November 2026. Existing React/Vite architecture and the main branch retained. No new dependencies, database, CMS, DNS change or manual production deployment.

## Implemented

- `/privacy`, footer/form links and route metadata. The page shows an explicit legal-text-pending notice; there is no invented policy or claim of legal approval. Only a complete, firm-approved policy record can render legal paragraphs. Requester-authorized marketing approval does not qualify.
- Equally prominent acceptance/rejection, granular analytics and media choices, versioned 180-day preference storage, invalid/expired-record rejection, cross-tab synchronization and storage-failure handling. Preferences remain accessible from the footer. The dialog handles labels, Escape, focus containment/return and background inertness.
- GA4 adapter using public environment measurement ID, with no API secret. Basic gating makes no Google request before permission. Approved legal records and explicit confirmation of disabled GA4 Enhanced Measurement are also required. No real measurement ID was available.
- Manual React Router pathname pageviews, repeat-render/configuration deduplication and StrictMode-safe registration. Queries, hashes, form inputs, referrers and unknown raw paths are excluded. No form, click, user-ID or conversion tracking was added. Advertising consent remains denied.
- Withdrawal blocks subsequent application events, removes the loader, discards pending views and clears accessible first-party GA cookies. Regrant does not configure an already initialized tag twice. Prior requests cannot be recalled and already executed JavaScript cannot be unloaded.
- Video and Calendly embeds require optional-media permission AND a load action. Revoking permission removes mounted iframes. External links and essential enquiry spam protection remain separate.
- Contact forms link to the policy status and retain minimal collection, memory-only drafts and existing server-side protections.
- Initially added a production release guard for missing legal approvals; a later deployment-readiness follow-up removed the build failure while retaining the pending-policy notice and noindex safeguards. `launch:check` now reports missing launch items without failing.

## Verification

- 85 automated tests passed, including all 55 route render audits and existing People, Insights, Contact and navigation checks.
- Tested: rejecting optional analytics creates no Google loader/events; persisted rejection survives remount; granular opt-in enables exactly one loader; route changes send intended views and omit private query/hash/unknown path content; withdrawal stops subsequent views; late script callbacks after opt-out stay silent; blocked scripts do not report success; cookies clear without deleting essential cookies; corrupt/expired records fail closed; unavailable storage remains usable; keyboard focus and media withdrawal work.
- Test fixtures intercept external script loading and use fake IDs; no real Google request, enquiry, booking or analytics account/property operation was performed.
- TypeScript, lint with zero warnings and normal production-bundle build passed. Frontend application approximately 208.4 kB (40.1 kB gzip), vendor 321.8 kB (103.0 kB gzip), CSS 58.4 kB (11.5 kB gzip).
- At the time of this report, `npm.cmd run launch:check` and an explicit production-release build failed with the missing-policy/consent-approval message. That historical gate has since been removed so production-mode deployment builds can complete.
- Live browser visual/network QA was unavailable: the browser plugin could not load its required runtime. No screenshot, device QA or GA4 Realtime receipt is claimed.

## Outstanding client/legal dependencies

1. Full approved Privacy Policy, source/approver/date/effective-date record.
2. Approval of consent wording, purpose/provider categories and retention. The SOW references a third-party consent mechanism; obtain acceptance of the current first-party controls or integrate a selected approved CMP before launch. No hosted CMP account/service is claimed.
3. Authorized GA4 property/stream and measurement ID. Disable Enhanced Measurement/history/form/search/outbound/video automatic tracking; confirm this in configuration and verify with an authorized account on staging. Final retention/access/provider arrangements require client review.
4. Remaining contact credentials, approved Calendly URL, office confirmations and real delivery checks from Prompt 9.
5. Final browser/device QA, legal acceptance and later production-launch approval. This is not a legal-compliance certification.

## Main implementation files

New: `src/data/privacy.ts`, `src/lib/privacy.ts`, `src/lib/consent.ts`, `src/lib/analytics.ts`, `src/pages/PrivacyPage.tsx`, `src/components/AnalyticsBridge.tsx`, `src/components/privacy/CookieConsent.tsx`, `src/styles/privacy.css`, `scripts/assert-production-ready.ts`, `tests/privacy-analytics.test.ts` and privacy setup/report documentation.

Updated: application layout/routes, footer, contact and video components, route title/metadata, stylesheet entry, Vite configuration, package scripts/environment template, route/interaction/media tests, content inventory generator and setup/outstanding-content guides.

See [privacy and analytics setup](privacy-analytics-setup.md) for configuration, approval records, storage behavior, primary integration references and staging verification. Prompt 11 has not been started.
