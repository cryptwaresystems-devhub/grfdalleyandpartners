# G.R.F. Dalley & Partners — first MVP

Static React/Vite/TypeScript design preview for Cryptware Systems Ltd. Prompts 1–6 cover the first MVP, not completion of the signed website scope. No backend, CMS or database.

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

## Available routes

Home `/`, About `/about`, Industry `/industries` (15 detail routes), Practice `/practices` (21 detail routes), People `/people` (8 profile previews), Insights `/insights` (2 historic publication references), Contact `/contact`. There are 53 populated route destinations including content-pending templates. Singular `/industry` and `/practice` URLs redirect; unknown URLs show a client-side not-found page.

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

The publication gate requires a reviewer and valid approval/publication dates. Explicitly labelled management previews are an exception for design review, not authentication or a private portal. Do not put confidential records in this static app. Historical prompt reports are retained in `docs/`; the Prompt 6 report describes the current MVP.
