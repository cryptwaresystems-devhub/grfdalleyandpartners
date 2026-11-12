# G.R.F. Dalley & Partners

Static React/Vite/TypeScript website for Cryptware Systems Ltd. Prompts 1–6 form the preserved MVP. Prompt 7 adds long-form content support and approved-only public presentation; final expertise and About population is blocked by missing client copy/approval. No backend, CMS or database.

See the [current missing-content report](docs/missing-content-report.md) for all 36 expertise pages and About Us. No documented client design feedback or new approved copy was supplied. The [Prompt 7 report](docs/prompt-7-report.md) records implementation and verification.

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

The default is `approved-only`. Confirmed category names remain available, while unapproved About narrative, professional profiles and publication entries are hidden. Draft detail URLs show the existing not-found page. Full detail copy remains pending until supplied and approved.

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

Home `/`, About `/about`, Industry `/industries` (15 detail routes), Practice `/practices` (21 detail routes), People `/people`, Insights `/insights`, Contact `/contact`. The management preview retains eight profiles and two historic publication details, giving 53 destinations including content-pending templates. The default public build exposes the seven main pages and 36 confirmed category templates; unapproved profile/publication URLs show not-found content. Singular `/industry` and `/practice` URLs redirect.

People search, insight-category filters, accessible mobile navigation and the About dropdown work locally. The contact form prepares a mailto draft; it sends nothing. Scheduling is explicitly pending.

## Staging on Vercel

Use a staging-only Vercel project or a Preview deployment, with this repository root as the root directory. Install `npm ci`, build `npm run build`, output `dist`. `vercel.json` supplies SPA fallback and noindex headers. No environment variables are required.

For a manual preview from a linked staging project, run `npx vercel` and use the generated preview URL. Do not use `--prod`, attach the firm's production domain, or change DNS. Check the target project before linking; pushes to a configured production branch can trigger production deployments. A push to GitHub is not evidence that staging has been deployed or verified.

HTML and response headers deliberately prevent search indexing. Metadata updates per route in the browser; prerendering, production canonical URLs and final search/social indexing remain later work. Direct SPA unknown URLs retain HTTP 200 with an in-app not-found page.

## Content and assets

See [the MVP review](docs/prompt-6-report.md) for approval status, checks, limitations and the client-demo sequence. All management-preview biographies and newly written narrative require publication approval. Category labels are confirmed; detailed legal-service copy is pending. Abuja's address, current telephone availability and a high-resolution logo need confirmation.

Local assets: supplied 264×24 JPEG logo, eight supplied professional portraits and three licensed architectural WebPs. The architecture is illustrative, not represented as the firm's offices. Provenance: [asset inventory](docs/asset-inventory.json), [image credits](docs/homepage-image-credits.json), [profile verification](docs/profile-verification.json).

## Structure

- `src/app`: shared router and shell.
- `src/components`, `src/pages`: reusable UI and page templates.
- `src/styles`: central tokens and responsive page styles; local system serif/sans fonts avoid external font requests.
- `src/data`, `src/types`: structured content and editorial states.
- `src/lib`: publication gates, relationships, search, contact and route metadata.
- `tests`: route, content-safety, interaction, responsive-CSS and contrast checks.
- `docs`: non-public review records and approval requirements.

The publication gate requires a reviewer and valid approval/publication dates. Explicitly labelled management previews are an exception for design review, not authentication or a private portal. Do not put confidential records in this static app. Historical prompt reports are retained in `docs/`; the Prompt 7 report describes the latest implementation and content blockers.
