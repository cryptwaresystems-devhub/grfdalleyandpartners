# G.R.F. Dalley & Partners

Static React/Vite/TypeScript website for Cryptware Systems Ltd. Prompts 1–6 form the preserved MVP. Prompt 7 populates all 15 industries, 21 practices and About, with connected expertise and source-backed people/publication previews. Missing wording was completed under the requester's explicit editorial discretion. Prompt 8 adds People practice filters, complete source-grounded profiles and searchable, multi-filtered Insights with pagination. No backend, CMS or database.

See the [current missing-content report](docs/missing-content-report.md) for all 36 expertise pages and About Us. The requester authorised use of the supplied materials and composition of missing copy; this is recorded separately from final firm legal sign-off. The [Prompt 7 report](docs/prompt-7-report.md) records implementation and verification.

## Local setup and preview

Use Node 22.12+ (verified with Node 24). On Windows use `npm.cmd` if PowerShell blocks `npm.ps1`.

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Open the URL printed by Vite, normally http://127.0.0.1:5173.

```sh
npm run lint
npm test
npm run build
npm run preview -- --host 127.0.0.1
```

The production-build preview normally runs at http://127.0.0.1:4173. `build` includes strict TypeScript checking. Never place credentials, source documents or private client material in `public/`, source modules or Vite environment variables.

## Public and management-review builds

The default is `approved-only`. All 36 expertise pages, About, eight source-checked profiles and three verified publication references are available under requester authorization. Records without publication permission remain hidden; draft detail URLs show the existing not-found page.

To preserve the full MVP for a local design review, explicitly opt in using PowerShell:

```powershell
$env:VITE_CONTENT_MODE = 'management-preview'
npm.cmd run dev -- --host 127.0.0.1
```

The management build shows a review banner. It is not authentication: use Vercel deployment protection if sharing requires access restrictions. Do not configure this value on the production project. Stop the server and remove the override before a public build:

```powershell
Remove-Item Env:VITE_CONTENT_MODE
npm.cmd run build
```

`.env.example` documents the default. URL parameters cannot enable review content. Keep `VITE_CONTENT_MODE=approved-only` or unset in public builds. `npm run content:report` regenerates the missing-content report; it does not approve or publish anything. The [content guide](docs/expertise-content-guide.md) explains how to add genuinely approved content and relationships.

## Available routes

Current People/Insights functionality, source limits and test results are recorded in the [Prompt 8 report](docs/prompt-8-report.md). Use the [content guide](docs/people-insights-content-guide.md) for adding approved records and media.

Home `/`, About `/about`, Industry `/industries` (15 detail routes), Practice `/practices` (21 detail routes), People `/people`, Insights `/insights`, Contact `/contact`. The management preview retains eight profiles and three historic publication details, giving 54 content destinations. The Privacy Policy route adds a 55th destination. The normal build now exposes all 55 destinations, with populated expertise pages and supplied profiles. Unauthorised records still show not-found content. Singular `/industry` and `/practice` URLs redirect.

People search and practice filters, Insights search and category/author/practice/industry filters, pagination, accessible mobile navigation and the About dropdown work locally. Directory selections use shareable URL parameters. Insights pagination uses six records per page; the current three references fit on one page. Contact provides enquiry and consultation-request forms, shared validation, accessible feedback and a secure Vercel delivery adapter. Without configuration it prepares an email draft and sends nothing. Calendly remains pending until the approved URL is configured. See [contact setup](docs/contact-services-setup.md).

## Staging on Vercel

Use a staging-only Vercel project or a Preview deployment, with this repository root as the root directory. Install `npm ci`, build `npm run build`, output `dist`. `vercel.json` uses clean static HTML URLs and legacy redirects; generated metadata and robots.txt protect staging from indexing. The website can be previewed without environment variables; online email delivery and Calendly require the server settings documented in [contact setup](docs/contact-services-setup.md).

For a manual preview from a linked staging project, run `npx vercel` and use the generated preview URL. Do not use `--prod`, attach the firm's production domain, or change DNS. Check the target project before linking; pushes to a configured production branch can trigger production deployments. A push to GitHub is not evidence that staging has been deployed or verified.

Staging HTML and robots.txt deliberately prevent search indexing. Every real route is prerendered to its own HTML document, with metadata refreshed during navigation. Canonical/social URLs require VITE_SITE_URL. Unknown direct routes use a custom 404 page; the built-site preview verifies HTTP 404 instead of an SPA soft 404. Actual Vercel behavior still needs staging verification.

## Content and assets

See [the MVP review](docs/prompt-6-report.md) for approval status, checks, limitations and the client-demo sequence. Existing source-checked biographies and newly written narrative are requester-authorized. Final firm legal review can refine the wording without blocking the populated demonstration. Abuja's address, current telephone availability and a high-resolution logo need confirmation.

Local assets: supplied 264×24 JPEG logo, eight supplied professional portraits and three licensed architectural WebPs. The architecture is illustrative, not represented as the firm's offices. Provenance: [asset inventory](docs/asset-inventory.json), [image credits](docs/homepage-image-credits.json), [profile verification](docs/profile-verification.json).

## Structure

- `src/app`: shared router and shell.
- `src/components`, `src/pages`: reusable UI and page templates.
- `src/styles`: central tokens and responsive page styles; local system serif/sans fonts avoid external font requests.
- `src/data`, `src/types`: structured content and editorial states.
- `src/lib`: publication gates, relationships, search, contact and route metadata.
- `tests`: route, content-safety, interaction, responsive-CSS and contrast checks.
- `docs`: non-public review records and approval requirements.

The publication gate accepts either named firm approval or explicit requester authorization with valid dates. Requester authorization does not assert final firm legal sign-off. Explicitly labelled management previews are an exception for design review, not authentication or a private portal. Do not put confidential records in this static app. Historical prompt reports are retained in `docs/`; the [Prompt 8 report](docs/prompt-8-report.md) describes People/Insights implementation. The [Prompt 9 report](docs/prompt-9-report.md) records the latest Contact implementation and verification. See the [People and Insights content guide](docs/people-insights-content-guide.md) to maintain records and add approved media.


## Contact services (Prompt 9)

The static React site now has one minimal Vercel serverless function, `/api/contact`, solely for secure contact delivery. No database or CMS was added. Read [configuration and verification](docs/contact-services-setup.md) before enabling delivery. `npm.cmd run dev` and `npm.cmd run preview` only serve the frontend; an unavailable endpoint leaves the email-draft fallback active. Use `npx vercel dev` for local full-stack verification or a staging Preview deployment with server environment variables. Never use `--prod` for a staging check.


## Privacy and analytics (Prompt 10)

`/privacy` is a dedicated route with a clearly labelled pending notice until the firm supplies approved legal text. The footer opens persistent, accessible cookie preferences. Analytics and media default off; declining optional cookies prevents the Google loader. GA4 is prepared through public environment settings, but remains disabled pending legal approval and real stream configuration. See [privacy and analytics setup](docs/privacy-analytics-setup.md).

Production and Preview builds use the same deployable build pipeline. Missing legal approvals or an approved site origin no longer fail the build; `npm.cmd run launch:check` reports these as outstanding launch items. The `/privacy` page continues to show its pending notice, and indexing remains disabled until legal approval, approved-only content, an approved HTTPS origin, and explicit indexing opt-in are all present. A successful build is not legal or launch approval.


## SEO, performance and accessibility (Prompt 11)

`npm.cmd run build` now typechecks, builds Vite assets and prerenders all 55 routes plus `404.html`. `npm.cmd run preview` serves those HTML files with static routing and genuine local HTTP 404s. Run `npm.cmd test`, `npm.cmd run lint`, and after building `npm.cmd run test:built`.

Set the approved HTTPS origin in `VITE_SITE_URL` for canonical URLs, social image URLs, structured data and sitemap locations. Builds without it still deploy, with those absolute URLs omitted. Staging defaults to noindex. `VITE_PUBLIC_INDEXING=true` only enables indexing when the legal launch gates are satisfied and public content mode is selected. No domain/DNS changes were made. Full setup, measured results and remaining browser/Lighthouse checks: [Prompt 11 report](docs/prompt-11-report.md).

Original images remain intact. `npm.cmd run images:optimize` regenerates the responsive WebP files, image manifest, branded social card and size report using build-only Sharp. No external font downloads or new runtime animation library are needed.


## Quality assurance (Prompt 12)

See the [formal QA report](docs/qa-report.md), [FR-01-FR-12 traceability checklist](docs/requirements-traceability.md), [browser matrix](docs/qa/browser-matrix.md) and [raw HTTP evidence](docs/qa/http-results.json). Software checks are distinct from missing legal/content approval and live service verification. Browser/Lighthouse tests were not performed; this is not a production acceptance sign-off.

For a built local preview on port 4174, `npm.cmd run qa:http -- --external` checks route, fragment, asset and external HTTP reachability and writes its evidence to docs/qa. It never sends email or creates bookings. Provider refusals are reported BLOCKED. Source-editable metadata uses optional reviewed `seo` fields on content records and `src/data/page-seo.ts` for static pages; slugs remain in existing structured records. SEO title, description and portrait-alt drafts are independently gated.
