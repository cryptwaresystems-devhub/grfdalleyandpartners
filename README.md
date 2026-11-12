# G.R.F. Dalley & Partners

Prompts 1-5 of 14: static React/Vite/TypeScript foundation and global visual system for Cryptware Systems Ltd. No backend, database or CMS. Existing `.qodo` and review tooling were preserved.

## Run

Use Node 22.12+ (tested on Node 24). On Windows, use `npm.cmd` if PowerShell blocks npm.ps1.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
```

## Architecture

- `src/app/`: router and shared site shell with responsive header and footer.
- `src/components/`: reusable buttons, container, breadcrumbs, section headings, page header/template, header/footer and route focus/scroll behavior.
- `src/pages/`: Home, About, expertise overviews/details, remaining section placeholder and not-found page.
- `src/styles/tokens.css`: centralized plum, burgundy, gold and warm-neutral palette, serif/sans-serif system font stacks, spacing, breakpoints and reduced-motion behavior; Tailwind v4 Vite plugin.
- `src/types/content.ts`: typed firm, office, expertise, lawyer, insight, matter and publication records.
- `src/data/`: source-grounded records and route labels.
- `src/lib/publication.ts`: shared publication selector; `expertise.ts` resolves confirmed categories and approved relationships.
- `tests/`: publication safety, taxonomy, route rendering and global-navigation interaction checks.
- `public/assets/`: supplied logo, selected firm portraits and licensed architectural photos. Never put source documents or secrets here.
- `docs/`: asset inventory and outstanding requirements, outside the public build.

## Routes

- `/`: homepage.
- `/about`: firm history and service approach, with a visible provisional-copy notice and leadership preview.
- `/industries`: all 15 confirmed industry categories.
- `/industries/:slug`: reusable industry detail pages.
- `/practices`: all 21 confirmed practices in editorial browsing groups.
- `/practices/:slug`: reusable practice detail pages.
- `/industry`, `/practice` and their `/:slug` variants: compatibility redirects to plural URLs, preserving query strings and anchors.
- `/people` and `/people/:slug`: searchable directory and eight biography-backed profile previews.
- `/insights` and `/insights/:slug`: category-filtered archive and verified external-publication entries.
- `/contact`: actual office details, email-draft form and consultation booking preview.
- Unknown categories/paths: client-side not-found page.

Navigation and homepage links now use plural expertise URLs. `src/app/routes.tsx` holds the shared route definitions for browser routing and integration tests; `router.tsx` still creates the browser router.

## Content publication

Full source records remain `in-review` and are not imported into public views; limited homepage presentation excerpts and explicitly labelled portrait previews are separate. `contact-details.ts` separately records the office addresses and email explicitly confirmed by the client in Prompt 2. The footer telephone is sourced from the firm profile and visibly marked as requiring reconfirmation. All future listings, details, search, related-content links and generated SEO must use `publishedOnly` / `isPublished`. Status `approved` requires a nonempty reviewer, valid approval and publication timestamps, approval preceding publication, and publication no later than the current time. This is a static editorial safeguard, not authentication. Private material must never enter source content modules or public assets. Never use frontend environment variables for secrets.

The WRS confirms category labels, but this does not establish publication approval for descriptions or biographies. No publications, awards or case results have been fabricated; insights starts empty. Missing values remain null or empty collections. Lawyer relationships, full narrative copy and contact links await validation against supplied biographies.

## Vercel

Import this directory as a Vite project. Install: `npm ci`; build: `npm run build`; output: `dist`. `vercel.json` provides SPA fallback for direct section URLs and excludes static asset paths. No deployment or DNS changes were performed. Keep cPanel email hosting and current nameservers intact.

This foundation is intentionally noindex in both HTML and Vercel headers. Remove both restrictions only when the production launch content is approved. Decide prerendering/SEO delivery in later prompts. Review hosting headers and consent behavior when integrations are implemented.

## Assets and sources

The actual logo is a 264 x 24 JPEG, inspected and used as supplied. A high-resolution SVG or transparent PNG remains required. Drive inventory contains eight biographies, eight portraits and the logo. A credential document exists but has not been copied to this project or exposed in public output. See `docs/asset-inventory.json` for non-sensitive source metadata. All eight supplied portraits are now available in the explicitly labelled management preview and have been matched to their embedded biography photographs.

References: WRS (2), 28 October 2026; SOW (1), 9 November 2026; Updated Firm Profile, 25 pages; firm-supplied Drive folder. Package setup follows the official Vite guide (https://vite.dev/guide/) and Tailwind Vite instructions (https://tailwindcss.com/docs/installation/using-vite).

## Global visual system (Prompt 2)

The sticky header uses the supplied logo at its intrinsic resolution, all seven primary routes, active-route states and a Start a Conversation CTA. A separate About Us disclosure links to the firm, people and office locations; it supports Enter/Space, Arrow Down, Escape, outside click and focus leaving the disclosure. Other sections remain direct links until approved detailed pages are implemented.

Below 80rem (1280px), the header switches to a nonmodal mobile disclosure with all primary links and a CTA. It supports Escape with focus return, closes on navigation and breakpoint changes, and scrolls inside the viewport on short screens. The surrounding page remains available through normal keyboard navigation; this is not a dialog or focus trap.

The footer includes confirmed Lagos and Port Harcourt addresses, pending Abuja address, email, the source-qualified phone number, site links and a back-to-top link. No invented opening hours, social handles or legal-policy text are published. Privacy/cookie links will be added when the corresponding approved page exists.

`Button` handles native button actions; `ButtonLink` handles internal navigation. Both offer primary, outline and light variants. `PageHeader`, `SectionHeading`, `Breadcrumbs` and `Container` provide shared composition. Typography uses installed system font stacks without third-party font calls. Token values are centralized in `src/styles/tokens.css`.

## Homepage (Prompt 3)

The homepage now includes an architectural hero with the supplied provisional headline and 1962 founding date, a firm introduction adapted from the profile, six confirmed practices, selected industries, real partner portraits, verified archive publications and a final contact CTA. Shared routes and content records remain intact. About and expertise routes are now implemented in Prompt 4; People, Insights and Contact were implemented in Prompt 5.

`src/data/homepage.ts` contains the limited source-backed presentation excerpts and provenance. It does not promote full biographies or source expertise records to approved status. `PeoplePreview` defaults to the central publication gate. The homepage explicitly opts into `management-preview` to display the three firm-supplied portraits/names/roles, with a visible final-approval note; drafts and archived records remain excluded. Remove this preview mode or obtain complete publication approval before public launch. The application remains noindex.

The two archive links were verified on the original publishers (The Gravitas Review and The Guardian). They are identified as 2019 publications; no current dates or invented article bodies were added. The Gravitas publisher page may require purchase. See `homepage.ts` for source URLs and `docs/homepage-image-credits.json` for image provenance and licence links.

Architectural WebP images are served locally with a smaller mobile hero crop, eager/high-priority hero image, and lazy-loaded supporting images. The three portraits are actual supplied photos; no synthetic people are used. No architecture is presented as a photograph of the firm's offices. Entrance effects respect reduced motion and reveal content on keyboard focus. The homepage final CTA replaces the generic footer invitation only on this route.

`npm test` covers structure, asset paths, destinations, preview approval states and responsive CSS at 320/390/768/1024/1440px, alongside the global interaction checks. These DOM/CSS checks do not replace real-browser screenshots or device testing.

## Supporting sections (Prompt 4)

The About narrative uses the Firm Profile as its factual basis and visibly marks newly written copy as provisional. Leadership retains the existing management-preview approval notice.

Industry/practice category names have separate `labelApproval` metadata recording WRS confirmation. This allows directory/detail titles to appear without treating draft summaries as approved. The existing narrative `editorial` status remains in-review. Every current category detail shows a content-pending state.

Detail sections resolve related industries/practices, lawyers, insights, matters and publications through IDs and the central publication gate. Relationships assigned on an expertise record are used only after that record is published; approved inverse associations also work. Empty relationships produce a short forthcoming note rather than invented content. Empty matters/publications datasets contain no sample client work. The original `relatedIds` field remains supported.

See `docs/expertise-content-guide.md` for data-population instructions. `supporting.css` contains the responsive supporting-page layout. Real-browser screenshots and device overflow checks remain pending because the browser runtime has no available browser.

## People, Insights and Contact (Prompt 5)

All eight supplied biographies were re-read. Names, roles, year of call, supplied education, source practice labels, affiliations, certifications and LinkedIn URLs were checked. Each standalone portrait was compared with the photograph embedded in its matching DOCX. See `docs/profile-verification.json`. Missing facts stay null; Faith's biography-body spelling is used and the filename discrepancy is documented. No personal email addresses were invented.

`getVisibleLawyers` defaults to fully approved content. The MVP pages explicitly select management-preview mode for source-checked in-review records and show an approval-pending notice. Drafts, archived records and unverified profiles remain excluded. Source affiliations/bibliography are not represented as independently confirmed current credentials. Practice IDs are conservative navigation mappings; exact source practice labels are retained separately. Full narrative biographies remain unset rather than invented.

Insights prepares Articles, Case reviews, External publications, Firm news, Events and Videos. Only two verified external records exist. The Gravitas entry retains month precision (December 2019, from the supplied biography); the Guardian entry retains its confirmed day (3 September 2019). Author relationships lead to the matching supplied profile. No article bodies were copied or generated. Publisher-verified preview metadata never publishes an unapproved body. Empty category states are intentional. The homepage's existing archive links remain functional.

Contact uses the confirmed office/address/email data. On this route, the main office section owns `#offices` and the footer uses a separate anchor to avoid duplicate IDs. No Abuja street address or office hours are invented.

The enquiry form validates required fields and prepares an encoded mailto draft in browser memory. It sends no network request and never claims delivery. Editing invalidates the prepared draft; clearing resets the form. The visitor must choose Open your email app and send from their configured mail client. There is no localStorage, database or form API.

`src/data/contact-services.ts` is public configuration: bookingUrl is null and enquiryMode is mailto-draft. The booking preview clearly says forthcoming and offers a real consultation-request mailto link. A valid HTTPS Calendly URL can activate the external booking link later; no automatic iframe or tracking is loaded. An actual email delivery service, approved privacy text and booking configuration belong to the later full implementation. Never add service API secrets to frontend code.

`people-insights-contact.css` contains responsive layouts. Route and interaction tests cover all eight profiles, both Insight detail pages, search/filters, unknown records, form validation/draft state and no-config booking behavior. Browser/device visual review remains pending because no browser is available in the runtime.

The Vite development watcher ignores temporary review/tooling folders so Windows document locks do not interrupt hot reload.

Prompt 6 has not started.
