# Prompt 6 — first MVP review

12 November 2026. Design-review MVP only; not completion of the signed scope. Existing implementation and GitHub `main` branch retained. No production deployment or DNS changes were performed.

## Routes and working features

53 available destinations: Home, About, Industry, Practice, People, Insights and Contact; 15 industry detail templates; 21 practice detail templates; eight lawyer profiles; two historic publication-reference details. Expertise descriptions are deliberately content-pending. Singular expertise aliases redirect with query strings and anchors preserved. Unknown routes show the shared not-found page.

Working: responsive shared shell, mobile disclosure, About dropdown, keyboard/Escape/focus management, office deep links, people search, insight category filters and honest empty states, verified publisher links, author/profile links, email-draft preparation and clear/reset. No message is sent by the app. Scheduling remains visibly pending.

## Visual and technical improvements

- Darkened the shared gold text accent to meet 4.5:1 contrast against both warm-neutral surfaces; retained burgundy/plum, gold and the actual client logo.
- Increased header caption readability and hid that caption on the narrowest screens; kept the supplied wordmark visible.
- Moderated internal-page heading sizes for long names and titles, retaining the homepage hero treatment.
- Corrected doubled sticky-header anchor offsets on offices and supporting-page sections.
- Fixed unsupported ARIA on the decorative hero picture; the image has an empty alternative and is hidden from assistive technology.
- Added asynchronous portrait decoding to profile pages. Existing local WebP hero variants, eager/high-priority hero loading, lazy directory imagery, fixed image dimensions, system fonts and CSS reduced-motion support retained.
- Added route-specific descriptions, Open Graph and Twitter title/description updates. Added theme colour and favicon referencing the supplied logo. Staging noindex is retained in HTML and Vercel headers. No production canonical domain has been invented.
- Added ESLint, TypeScript rules and JSX accessibility linting. TypeScript changed from 7.0.2 to the compatible 6.0 release line because the installed TypeScript ESLint parser supports versions below 6.1. A scoped minimatch override removes the development-tool advisory; lint verifies that toolchain works.
- Added `.vercelignore` to exclude local review folders and environment files from staging uploads; rewrites and security/noindex headers are retained.

## Assets integrated

Actual supplied low-resolution JPEG logo; eight source-matched portrait JPEGs; three local licensed architectural WebPs (desktop/mobile hero crops and facade). No credentials, biographies as documents or raw source PDFs were added to public output. Architectural imagery is illustrative, not a claim about the firm's offices. Provenance is retained in `asset-inventory.json`, `homepage-image-credits.json` and `profile-verification.json`.

## Approval status

| Content | Current status / action |
| --- | --- |
| Establishment in 1962 | Source-backed firm-profile fact; retain in review copy |
| 15 industry and 21 practice names | Confirmed specification labels; detail introductions and relationships pending |
| Lagos and Port Harcourt addresses, general email | Explicitly confirmed by client; used in MVP |
| Abuja | Address pending; no invented address or map |
| Telephone | Supplied profile number, visibly requiring current-availability confirmation |
| About/home marketing copy and provisional hero headline | Management review required; not marked finally approved |
| Eight biographies and portraits | Source-checked, clearly labelled previews; final public approval still required |
| Education, credentials and memberships | As supplied; not independently certified as current; unsupplied facts omitted |
| Two 2019 external publications | Publisher/author metadata verified; historical dates retained; bodies not republished |
| Other insights, events, videos, matters, awards and testimonials | No fabricated records; empty/pending where unavailable |
| Logo | Actual 264×24 JPEG used; request high-resolution SVG or transparent PNG |

Editorial approval gates remain in place. Source verification alone does not approve publication. This static preview is not access control: share only appropriate review material and enable deployment protection in Vercel if the client requires a private preview.

## Verification and limits

- ESLint: zero errors or warnings after correcting the hero ARIA issue.
- Strict TypeScript and Vite production build: pass.
- Automated suite: existing 36 tests plus four MVP review tests. Includes all 53 rendered destinations, actual navigation/profile/filter/form interactions, confirmed taxonomy counts, publication gates, missing-content states, accessible labels/landmarks, unique IDs, real internal destinations, image file presence/dimensions and responsive CSS at 320, 390, 768, 1024 and 1440 pixels.
- Added computed reduced-motion check: pending reveal content stays visible, transform removed and hero animation disabled.
- Added contrast calculations for shared small-text token combinations. This is not a full WCAG conformance audit or screen-reader test.
- Built-preview HTTP smoke checks: all 53 route URLs and 14 asset files returned 200 with expected content; noindex HTML present. Local preview does not emulate Vercel response headers.
- Dependency audit after scoped tooling patch: zero vulnerabilities reported.
- Built assets: JavaScript 409.80 kB / 122.29 kB gzip; CSS 49.59 kB / 9.93 kB gzip. No Lighthouse/Core Web Vitals measurements are claimed.
- Real-browser testing was blocked because the available browser runtime returned no browser sessions. No desktop/tablet/mobile screenshots, rendered overflow assessment, browser-console sweep, screen-reader run or real-device validation could be performed. Automated DOM rendering passed; this does not prove an error-free browser console. Complete these visual checks before the client meeting.

## Preview and staging

See the root README for installation and commands. The production-build preview is available at http://127.0.0.1:4173 while its process is running. A Vercel Preview deployment is prepared via `vercel.json`; none was created or claimed verified. Use a staging-only project or manual Preview deployment, build `npm run build`, output `dist`, and test direct detail URLs on the generated Vercel URL. Check project/branch deployment settings before connecting GitHub. Do not use `--prod` or modify production domains/DNS.

SEO metadata is client-rendered; crawler/social previews may only receive the static default HTML. Prerendering, canonical-domain decisions and final indexing belong to the later implementation. SPA unknown URLs return HTTP 200 with an in-app 404. A wide JPEG favicon is functional but a proper client-approved square asset is still preferable.

## Client demonstration

Open the homepage on desktop, then show the mobile menu, About, the 15/21-category directories, a content-pending detail, People search and one supplied profile, a historic publication reference, and Contact's email-draft/pending-booking states. Ask for feedback on brand, spacing, imagery, navigation and profile presentation. Record content corrections and approvals separately. Test the actual demonstration browser and screen size before presenting.

Reserved for subsequent prompts: complete approved content, all final expertise detail copy, complete relationships, email delivery, Calendly integration, GA4, cookie consent, final Privacy Policy, comprehensive browser/device/accessibility testing, client acceptance and production deployment.

## Prompt 6 files

Created: `.vercelignore`, `eslint.config.js`, `src/lib/route-metadata.ts`, `tests/mvp-review.test.ts`, `docs/prompt-6-report.md`.

Changed: `README.md`, `index.html`, `package.json`, `package-lock.json`, `src/components/RouteEffects.tsx`, `src/components/home/Hero.tsx`, `src/components/people/LawyerProfileTemplate.tsx`, `src/styles/tokens.css`, `src/styles/supporting.css`, `src/styles/people-insights-contact.css`, `tests/navigation.test.ts`.

Development dependencies added: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-jsx-a11y`, `globals`. TypeScript compatibility adjustment and scoped transitive minimatch patch are recorded in `package.json` and lockfile. No runtime dependencies were added.
