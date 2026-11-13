# Outstanding requirements

- Prompt 2 implementation complete: plum/gold visual system, shared header/footer, accessible navigation and UI primitives. Browser visual review remains pending because the browser runtime exposes no available browser.
- High-resolution SVG/transparent PNG logo; current JPEG is only 264 ? 24.
- Approved industry and practice descriptions, biographies and publication-ready headshots; validate lawyer/practice/office relationships and LinkedIn/contact fields.
- Resolve Faith name spelling between file title and biography. Obinna biography lacks year of call and complete education.
- Firm Profile roster differs from individual biographies; confirm final roster, roles and credentials.
- Confirm historic claims and any case material before publication. Firm Profile debt figures include mismatched numeric amounts and words; do not publish without correction.
- Abuja address, office-specific telephone/email and opening hours remain pending. Lagos and Port Harcourt addresses plus the enquiry email were explicitly confirmed in Prompt 2. The firm-profile phone is displayed with a reconfirmation note.
- Calendly URL, form delivery provider/configuration, GA4 property, consent wording and approved privacy policy.
- At least three approved initial insights with dates, authors and relationships. Profile publication titles alone are not publishable article bodies.
- SOW D-01 description appears to list integrations instead of design mockups; schedule contains date typos. Clarify independently of implementation.
- Before launch: SEO/prerender strategy, legacy redirects, full browser/device QA, performance/accessibility review, production metadata, consent integration and removal of noindex.

No production deployment, account login, email sending or DNS modification is included in Prompt 1.

- Prompt 3 homepage implemented. Obtain final approval for provisional homepage copy and three labelled portrait previews before launch; verify image crops/overflow in a real browser. Two 2019 archive publications are publisher-verified. Other page detail content remains for Prompt 4 and later.

- Prompt 4 complete: About narrative remains visibly provisional; all 15 industry and 21 practice names have detail routes with clean pending states. Populate only approved summaries/relationships. People, Insights and Contact are next; real-browser visual QA remains outstanding.

- Prompt 5 complete: eight biography/portrait-matched professional previews, two verified historic Insight entries, and Contact preview are implemented. Final public-use/profile approval remains required. Obinna call year and LL.B. details are absent; Faith filename spelling differs from biography. Personal email addresses were not supplied. Configure actual form delivery, approved privacy text and a valid Calendly URL in the full implementation.


## Prompt 10 legal and analytics launch dependencies

- Firm-approved full Privacy Policy and recorded approval/effective date are missing. `/privacy` explicitly flags this; production builds are gated.
- Cookie notice wording, category/retention choices and acceptance of the first-party consent approach (or an approved third-party CMP) require client/legal approval.
- Real GA4 property/web stream ID, authorized access, disabled Enhanced Measurement and authorized Realtime/DebugView verification remain pending. No real analytics traffic was verified.
- Confirm contact and third-party processor notices, retention/access arrangements and any applicable transfer requirements. No general legal-compliance certification is claimed.
- Implemented: saved consent, rejection, revisit controls, consent-gated manual route analytics adapter, optional embed permissions/withdrawal and automated regression checks. See privacy-analytics-setup.md.


## Prompt 11 remaining launch checks

- Configure the exact client-approved HTTPS origin in `VITE_SITE_URL`. No canonical hostname was guessed. Sitemap locations, absolute social metadata and structured data become available when configured.
- Keep `VITE_PUBLIC_INDEXING=false` for previews. Public indexing requires legal readiness, approved-only mode and explicit release opt-in.
- Lighthouse, real-device visual/layout QA, live Vercel 404/redirect/function verification, Search Console and rich-result verification remain outstanding. Browser automation was unavailable; no Lighthouse scores are claimed.
- Static generation, responsive image derivatives, unique metadata, publication-aware sitemap/robots generation, custom 404, JSON-LD and keyboard-focus checks are implemented. See prompt-11-report.md.
