# Prompt 7 implementation and source review

12 November 2026. Existing React/Vite static architecture, design, routes and management-review MVP retained. No client design-feedback document was supplied or found in the referenced folder.

## Completion status

**Content population is blocked, not complete.** There are no final approved introductions for the 15 industry and 21 practice pages in the current data. About copy remains in review. The specification confirms category names; the Firm Profile is a starting source rather than a substitute for complete, current page copy and publication permission. No approvals were invented to make empty pages appear complete.

The implementation below is ready for approved content. The precise outstanding inputs are listed in [missing-content-report.md](missing-content-report.md). Do not represent this work as 36 fully populated, approved detail pages.

## Sources checked

- Local WRS (2), 28 October 2026: category lists, content responsibilities and publication requirements.
- Local SOW (1), 9 November 2026: static React/Vite architecture and requirement for firm-supplied page copy.
- Updated Firm Profile, all 25 pages: service narratives, key-service lists and source coverage. Historic matters, client names, monetary amounts, comparative claims and relative recency statements were excluded from public population.
- Supplied Drive folder: 18 files, consisting of biographies, portraits, the logo and an excluded credentials document. No new approved expertise/About copy or design feedback was located. Credentials were not opened or copied.

`content-review.json` records source hashes, per-page coverage, 11 candidate verbatim excerpts including About, and ten proposed industry/practice associations. Each excerpt was compared against its stated PDF page after whitespace normalization. This review inventory is documentation only; it is not imported by the website or included in the `dist` output.

## Implemented

- Extended structured expertise records with multiple headings, paragraphs and optional service lists. Existing templates generate accessible section anchors and sidebar navigation and display these sections only after the record passes the publication gate.
- Added independently approved taxonomy connections. A single reviewed association works in both directions without approving either narrative. Connections are deduplicated; draft, future, incomplete, dangling or withdrawn-destination links stay hidden. The live connections list remains empty pending real approval. Existing record-level and inverse links still work.
- Related lawyers and insights now link to their own detail routes when their records are approved and an association exists. Empty sections remain omitted.
- Added a typed About record and shared approval selector. The management preview retains the designed About page; the public view shows a clear pending overview until the actual copy is approved.
- Added a shared, build-selected presentation mode across routes, homepage previews, About, People, Insights, author/related-writing links and metadata. Default `approved-only` does not display unapproved records. `management-preview` explicitly preserves the MVP with a visible banner. Invalid or missing mode values fail closed; URL parameters do not enable it.
- Homepage practice cards now link to their confirmed practice routes and use approved summaries in public mode. Leadership previews now draw from the central lawyer records, avoiding a separate publication state for the same person. Insight previews use central insight records and approved author visibility.
- Added source coverage and missing-content reports for all 36 categories and About. `npm run content:report` regenerates the current approval-gap report and validates complete category coverage.
- Retained burgundy/plum, gold, typography, portraits, licensed architecture, responsive shell, breadcrumbs, compatibility redirects and enquiry controls. Added long-copy wrapping and service-list styling. No dependencies, backend or CMS were added.

## Routes and presentation

Public default: seven main destinations plus all 36 confirmed category detail routes. Each category retains its proper title, breadcrumbs, adjacent-category navigation and enquiry CTA. Detail copy remains pending. The People and Insights directories show honest approval-pending/empty states, and unapproved profile/insight detail URLs render the existing not-found page with matching metadata.

Management preview: all 53 MVP destinations, including eight source-checked profiles and two historic publication references. The management build is not authentication; records still reside in static frontend modules. Do not put confidential content in either build. Use deployment protection if a review requires restricted access.

Both modes retain noindex HTML and Vercel headers. No production deployment, domain, DNS, analytics, email delivery or calendar changes were made. Prompt 8 was not started.

## Verification

- 47 automated tests pass, including the existing navigation, search/filter, contact, publication-gate, taxonomy, route and responsive-CSS suites.
- New tests cover both presentation modes, direct-URL metadata safety, About approval transitions, reciprocal taxonomy-link approvals, draft/future/withdrawn links, long-form section anchors, safe plain-text rendering, all 36 expertise breadcrumbs/pending states and report completeness.
- Existing management-preview audit covers all 53 destinations, unique IDs, landmarks, local image files/dimensions, form labels and useful link destinations.
- Responsive CSS tests cover 320, 390, 768, 1024 and 1440 px; contrast-token and reduced-motion tests remain passing.
- ESLint with JSX accessibility rules passes without warnings. Strict TypeScript and both approved-only and management-preview Vite builds pass. Public output is `dist`; the review-build check uses ignored `tmp/management-build`.
- Build-preview HTTP checks cover all main/category routes, direct profile/insight URLs and local assets. An HTTP 200 on a SPA fallback does not prove approved content exists or that its in-app page is not a 404.
- Browser setup was retried and reported no available browsers. Visual screenshots, rendered overflow checks, browser-console review, screen-reader testing and real-device responsiveness remain unverified. No browser QA or client acceptance is claimed.

## Handoff

See the root README for local commands and explicit management-preview setup. Keep the public mode unset or `approved-only`. Supply final page text or identify exact passages approved for reuse, confirm proposed relationships, and provide the real approving reviewer and approval/publication dates. Then update `src/data/about.ts`, `industries.ts`, `practices.ts` and `expertise-connections.ts`, regenerate the report and rerun checks. No template rebuild is required to populate those content structures.

Until those inputs arrive, the 36 introductions and About population must remain listed as outstanding. Progression to the next prompt does not waive these content requirements.
