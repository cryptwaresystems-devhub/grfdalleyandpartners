# Prompt 3 completion report

Homepage implemented on the existing React/Vite foundation. Prompt 4 has not started; no deployment or DNS changes were performed.

## Homepage

- Full-width architectural hero with the exact provisional headline, ESTABLISHED 1962, commercially focused profile-derived introduction, two functional CTAs and a discover-the-firm anchor.
- Locally served licensed architecture with separate desktop/mobile hero crops, burgundy overlay, entrance transitions, reduced-motion support and high-priority hero loading.
- Split editorial About preview, six WRS-confirmed services with concise profile-derived summaries, and a contrasting industry feature.
- Three actual firm-supplied partner photographs with consistent crops and source-backed names/roles. A visible note marks these as profile previews pending final approval.
- Two verified external archive publication cards, both identified as 2019 work. No recent dates, article bodies, testimonials, rankings, case results or statistics were invented. The Gravitas link identifies possible purchase requirements.
- Final contact CTA before the footer. The generic footer invitation is suppressed only on the homepage to avoid duplication; it remains on other routes.
- Responsive composition and subtle viewport reveals. Content is visible before enhancement and on keyboard focus; reduced motion disables entrance effects.

## Content and approval

The practice/industry labels come from WRS sections 6.3 and 6.4. Firm copy is adapted from the supplied profile, particularly pages 2, 5 and 12. All copy remains subject to management sign-off before public launch.

The existing source models and publication selectors are unchanged. PeoplePreview defaults to the central publication gate. Only the homepage explicitly selects management-preview mode for the three in-review portrait excerpts; draft and archived records remain excluded. Full biographies and the wider People directory are not promoted or published. The preview note is visible and site-wide noindex remains enabled. Before launch, approve these records fully or remove management-preview mode.

## Sources and licences

Architecture is illustrative stock, not a claim that the firm occupies the pictured buildings. Both source photo pages explicitly identify the free Unsplash Licence; source/photographer metadata is recorded in homepage-image-credits.json.

- Sean Pollock: https://unsplash.com/photos/low-angle-photo-of-city-high-rise-buildings-during-daytime-PhYq704ffdA
- Ishaan Brar: https://unsplash.com/photos/modern-building-facade-with-reflections-in-glass-panels-MYzaOHvnZGY
- Licence: https://unsplash.com/license
- The Gravitas Review publisher: https://gravitasreview.com.ng/product/non-interventionist-principle-sections-30-and-34/
- The Guardian publisher: https://guardian.ng/features/continental-free-trade-agreement-renews-hope-for-africas-prosperity/

Publisher pages confirm titles/authorship; the Guardian confirms its 3 September 2019 date and the supplied Ajibola Dalley biography confirms the Gravitas December 2019 issue. No publisher article body or photography was copied into the publication cards.

## Files

Created:
- src/data/homepage.ts
- src/components/home/Hero.tsx
- src/components/home/Reveal.tsx
- src/components/home/PeoplePreview.tsx
- src/components/home/InsightsPreview.tsx
- src/styles/home.css
- tests/homepage.test.ts
- docs/homepage-image-credits.json
- docs/prompt-3-report.md
- public/assets/architecture/towers-1920.webp
- public/assets/architecture/towers-960.webp
- public/assets/architecture/facade-960.webp
- public/assets/people/aderemi-dalley.jpg
- public/assets/people/ajibola-dalley.jpg
- public/assets/people/wande-esan.jpg

Changed:
- src/pages/HomePage.tsx
- src/main.tsx
- src/app/FoundationLayout.tsx
- src/components/SiteFooter.tsx
- src/styles/tokens.css (comment only)
- index.html (description; noindex preserved)
- .gitignore (temporary asset originals)
- README.md
- docs/outstanding-requirements.md

No dependencies added. Original Wande PNG and unused high-resolution facade download are retained under ignored tmp/asset-sources, outside the public build.

## Validation

- 16 tests passed: source taxonomy, approval gates, all global navigation interactions, homepage structure, destination/asset validity, image alternatives, named sections, historical metadata and responsive CSS selections.
- Responsive CSS checked at 320, 390, 768, 1024 and 1440px in the DOM environment. No horizontal clipping is intentionally used to hide overflow.
- Strict TypeScript check passed.
- Production build passed.
- Homepage, direct practice route and all six image URLs returned HTTP 200 with expected image/HTML content types in local preview.
- Supplied portraits and both architecture photographs were visually inspected as image files.
- Browser runtime setup and documented browser discovery returned no available browser. Real-browser screenshots, actual-device layout/overflow, screen-reader use and Lighthouse measurements remain unverified. DOM/CSS tests do not establish pixel rendering or formal accessibility conformance.

## Remaining

Final management approval for the provisional copy and portrait excerpts; higher-resolution firm logo; real-browser/device visual QA. Other routes remain working preparation pages for the later prompts. No fabricated profile detail pages or article bodies were added.
