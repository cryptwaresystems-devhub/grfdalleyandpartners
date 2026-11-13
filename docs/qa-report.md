# Formal QA report - Prompt 12

**Date:** 13 November 2026. **Baseline:** GitHub main at 82df705 plus the QA changes committed with this report. **Reference:** supplied WRS (2), section 7 (FR-01-FR-12), and SOW (1), sections 4.5, 8.2 and 8.3. The source WRS filename/hash and exact acceptance text are retained in [requirements.json](qa/requirements.json).

**Verdict: QA execution complete; production/client acceptance remains BLOCKED.** This is not a claim that the complete contracted website or live integrations have passed. No DNS change, manual deployment, real email, booking or GA4 event verification was performed. Prompt 13 has not been started.

## Status definitions

- **PASS:** the specifically named local technical check was performed successfully. It does not confer content/legal approval or prove a live integration.
- **FAIL:** a reproduced defect remains unresolved within the checked scope. There are zero such local defects after the fixes below.
- **BLOCKED:** required content, approval, credentials, service setup or provider access prevents acceptance.
- **NOT TESTED:** the necessary browser/device/audit environment was unavailable. Happy DOM is not Chrome, Firefox, Safari or Edge.

## Requirements traceability

See [FR-01-FR-12 checklist](requirements-traceability.md): **2 PASS, 0 unresolved FAIL, 9 BLOCKED, 1 NOT TESTED**. These are contractual requirement outcomes; technical subchecks under blocked requirements are recorded separately. In particular, a mocked email response does not pass FR-06/FR-07 and requester authorization does not satisfy final firm approval under FR-10.

## Executed and blocked test cases

| Case | Check | Result | Evidence / limit |
| --- | --- | --- | --- |
| QA-01 | Seven main sections - local routing/rendering | **PASS** | All seven primary routes render. This checks software delivery, not final content approval. |
| QA-02 | 15 industry route templates | **PASS** | All 15 category routes, breadcrumbs and local links checked; final copy approval is QA-29. |
| QA-03 | 21 practice route templates | **PASS** | All 21 category routes and related-industry navigation checked. |
| QA-04 | Eight professional profile templates | **PASS** | Source-checked portraits and available fields render; final roster/credential approval is QA-29. |
| QA-05 | Insights listing and three historical reference details | **PASS** | Routing, metadata and original historical date precision checked; missing article bodies are not fabricated. |
| QA-06 | Profile/insight and industry/practice ID relationships | **PASS** | Identifiers resolve; actual author/profile links and reciprocal browsing links tested. Firm relationship sign-off remains blocked. |
| QA-07 | Search/filter/pagination and URL state | **PASS** | Combined supported filters, empty states, reset, focus and URL/back-navigation tests pass. |
| QA-08 | Internal navigation/assets/fragments | **PASS** | 55 HTTP page checks, 2,430 internal link references and 38 assets; zero local issues. |
| QA-09 | General-enquiry UI and mock adapter | **PASS** | Labels, validation, challenge, duplicate sends, errors and mocked acceptance checked; no real delivery is claimed. |
| QA-10 | Real enquiry delivery/inbox receipt | **BLOCKED** | No authorized Resend sender/key, Turnstile settings or origin allowlist. No live mail sent. |
| QA-11 | Consultation form and editable draft fallback | **PASS** | Consultation fields and honest request feedback tested; stale-preference draft defect fixed. |
| QA-12 | Live consultation email delivery | **BLOCKED** | Same delivery configuration dependency as QA-10. |
| QA-13 | Actual Calendly availability and booking | **BLOCKED** | Approved Calendly URL missing. Fixture embeds are tested, but no real appointment was booked. |
| QA-14 | Consent technical behavior | **PASS** | Default rejection, saved preferences, invalid/expired storage, revisit, focus handling and media withdrawal tested. |
| QA-15 | Cookie notice/CMP legal acceptance | **BLOCKED** | Firm wording/retention/category approval and first-party controls acceptance remain missing. |
| QA-16 | GA4 adapter and React Router event behavior | **PASS** | Fixture-only tests verify no pre-consent loader, deduplication, URL redaction and withdrawal; no live property receipt implied. |
| QA-17 | GA4 live tracking/property settings | **BLOCKED** | Actual ID/account configuration, stream settings and authorized Realtime/DebugView verification unavailable. |
| QA-18 | Privacy route and missing-policy state | **PASS** | Dedicated route links work and no invented policy is rendered. This is a status-page test. |
| QA-19 | Approved Privacy Policy publication | **BLOCKED** | Firm-approved full legal text and approval record not supplied. |
| QA-20 | SEO fields/static generation/metadata mechanics | **PASS** | Unique route titles/descriptions, approved overrides, alt fields, draft suppression and generated HTML checks pass. |
| QA-21 | Live canonical/social/sitemap/indexing acceptance | **BLOCKED** | Approved HTTPS VITE_SITE_URL missing; public indexing intentionally disabled. Live search/social tool verification pending. |
| QA-22 | Mobile-menu DOM/keyboard controls | **PASS** | Disclosure, Escape, focus return and route navigation tested in Happy DOM. |
| QA-23 | Responsive CSS behavior | **PASS** | 320/390/768/1024/1440px fixture checks. This is not a visual/device or cross-browser result. |
| QA-24 | Real browser/device responsiveness | **NOT TESTED** | Supported browser runtime and actual mobile devices unavailable. |
| QA-25 | Automated accessibility checks | **PASS** | Headings, labels/errors, alternatives, landmarks, keyboard focus, reduced motion and tested AA palette pairs pass. |
| QA-26 | Screen reader, zoom and visual contrast/layout | **NOT TESTED** | No real browser/assistive-technology session. No WCAG certification or photo-overlay contrast claim. |
| QA-27 | 404/API-error/asset error handling | **PASS** | Missing pages and assets return 404; malformed requests/provider failures never report fake success. |
| QA-28 | TypeScript/lint/production bundle/static HTML | **PASS** | Build passes; 98 source/DOM tests plus 2 artifact tests pass. No production release is implied. |
| QA-29 | Final approved content/assets/relationships | **BLOCKED** | Requester-authorized copy is distinct from final firm sign-off. Current roles/roster, Abuja, telephone, high-res logo and full content/media approvals remain open. |
| QA-30 | Production release guard | **PASS** | Explicit production-release build rejects missing legal approvals as intended; release acceptance remains blocked. |
| QA-31 | Chrome latest | **NOT TESTED** | Browser runtime unavailable. |
| QA-32 | Firefox latest | **NOT TESTED** | Browser runtime unavailable. |
| QA-33 | Safari latest | **NOT TESTED** | No supported Safari/macOS environment. |
| QA-34 | Edge latest | **NOT TESTED** | Browser runtime unavailable. |
| QA-35 | iOS/Android real phone/tablet | **NOT TESTED** | No supported device sessions. |
| QA-36 | Lighthouse >90 targets | **NOT TESTED** | No supported audit browser; no scores measured. |
| QA-37 | Approved video live playback | **BLOCKED** | No actual approved video asset configured; allowlist/permission/consent fixtures tested. |

| QA-38 | External HTTP reachability/provider access | **BLOCKED** | 12 URLs checked: 5 HTTP 200, 2 HTTP 403 and 5 nonstandard 999; refused requests remain unverified in a browser. |

## Reproduced defects and fixes

| Defect | Before | Fix and retest | Final |
| --- | --- | --- | --- |
| QA-D01, medium | After preparing a consultation email draft, editing the preference left an outdated mailto link visible. | Preference edits now invalidate the old draft and stale preference error. Navigation regression reproduces the change and verifies removal. | CLOSED / PASS |
| QA-D02, medium | GET /assets/missing-qa.webp returned 200 text/html from the preview SPA fallback. | Missing/invalid/out-of-root asset paths now return a genuine text 404. Final HTTP audit tests missing asset and all 38 real assets. | CLOSED / PASS |
| QA-D03, low | The idempotency identifier regex accepted arbitrary 36-character strings made from hex/hyphens, including only hyphens. | Validate the actual UUID-v4 shape emitted by crypto.randomUUID; malformed identifiers are rejected before provider calls. Regression tests pass. | CLOSED / PASS |
| QA-D04, medium, FR-11 | Source-editable SEO existed only as generated labels/body snippets rather than independent per-record title/description/portrait-alt fields. | Added reviewed SEO fields, approved static-page overrides and protected fallback behavior. Draft/future overrides cannot leak or disguise missing policy/unknown routes. | CLOSED / PASS |

The HTTP audit originally classified nonstandard provider status 999 as a broken-link failure. The harness was corrected to report provider refusals as BLOCKED, retaining raw status evidence; it never treats these as passed links. No supplied professional URL was removed solely because an automated request was refused.

## Evidence and reproducibility

- `npm.cmd test`: **98/98 passed**. Existing navigation, filters, relationship, content gate, contact adapter, consent, GA4, privacy and SEO checks plus QA regressions.
- `npm.cmd run build`: TypeScript and Vite production bundle passed; 55 pages plus custom 404 generated.
- `npm.cmd run test:built`: **2/2 passed**; generated HTML, headings, metadata, images and pre-JavaScript content checked.
- `npm.cmd run lint`: passed with zero warnings.
- `npm.cmd run build -- --mode production-release`: intentionally rejected missing approved Privacy Policy/consent record, verifying launch protection rather than granting release acceptance.
- `npm.cmd run preview -- --host 127.0.0.1 --port 4174 --strictPort`, then `npm.cmd run qa:http -- --external`: read-only HTTP crawl of all 55 routes, 2,430 internal link references/fragments and 38 assets. Zero local issues; page/profile/asset error probes returned 404 and the singular industry alias returned 308 preserving its query.
- Raw route/asset/external results: [http-results.json](qa/http-results.json). Only HTTP reachability is asserted for successful external checks. Provider refusals need manual browser verification; they do not prove a broken destination.
- [Environment snapshot](qa/environment.json) records versions and configuration presence booleans only. No secret values were printed or committed. Only .env.example was present; required live service settings were absent.
- [Browser/device matrix](qa/browser-matrix.md): Chrome, Firefox, Safari, Edge, iOS, Android, screen readers and Lighthouse were not tested because no supported browser runtime/device was available. No screenshots, browser versions, Lighthouse scores, LCP or CLS measurements are invented.

## Content and integration limitations

The seven main sections, 15 industries, 21 practices, eight supplied profiles and three historical publication references are technically available. Their source-checking and requester authorization are not final firm review. Historical references retain their supplied dates; unapproved article bodies, missing case matters, awards and video content were not invented. Seven supplied LinkedIn URLs are present. Some publishers/professional providers refused automated requests, as recorded in the HTTP evidence.

Live enquiry/consultation delivery needs an authorized Resend key, verified sender, Turnstile keys/hostnames and permitted origins, followed by actual authorized inbox checks. Calendly needs its real approved event URL and booking verification. GA4 needs its actual ID/account/stream settings and authorized receipt verification. Cookie copy/category/provider approval and full legal policy text remain missing. No feature is passed end-to-end merely because an adapter exists.

The normal staging-compatible production bundle passes. Approved public release remains blocked. Canonical URLs, absolute social metadata and sitemap locations need the exact approved HTTPS origin; current staging noindex is intentional. Vercel deployment behavior, TLS, DNS/email continuity, real service behavior and client UAT were not verified locally. Source content updates do not require a CMS; post-launch support terms still require separate agreement.

## Required next checks before acceptance

1. Supply/approve final legal text, cookie wording/approach, roster/credentials/content relationships and outstanding office/brand/media details.
2. Configure authorized staging email, Calendly, GA4 and exact website origin; perform real service checks without publishing credentials.
3. Execute the browser/device matrix and Lighthouse audits, recording exact environment and measured outcomes; resolve any reproduced failures.
4. Verify real Vercel deep links, redirects, custom 404s and serverless API on staging, then obtain written client acceptance under the SOW. No production DNS change is part of this QA prompt.
