# Prompt 11 - SEO, performance and accessibility

13 November 2026. React/Vite/TypeScript and the existing static-site content architecture are preserved. There is no new runtime server, CMS or database. Existing contact serverless function remains separate.

## Findings and fixes

The previous build returned an empty React shell at every URL and updated metadata only after JavaScript ran. A blanket rewrite returned HTTP 200 for missing pages. The new build uses React renderToString with the real data-router tree to write 55 complete route HTML documents plus a custom 404. Main content, headings and metadata are present before JavaScript. Normal route loads hydrate that markup; parameterized filter views render afresh to avoid a mismatch against an unfiltered static directory.

Each real page has a unique descriptive title and meta description. Canonical URLs, Open Graph/Twitter metadata, the supplied-logo social card, Organization/WebPage JSON-LD and breadcrumbs use the configured approved origin. JSON-LD includes only sourced name, founding year, enquiry email and the two confirmed office addresses. It omits uncertain telephone availability, Abuja street address, ratings, awards and professional achievements. Archive references are not misrepresented as newly authored articles.

`VITE_SITE_URL` must be the exact approved HTTPS origin; it is currently unconfigured. No production hostname was invented. Without it, absolute canonical/image/schema URLs are omitted and sitemap.xml is valid but empty. With a configured origin, the sitemap covers the 54 currently published routes exactly once and excludes the pending Privacy Policy, aliases, query filters and draft-only records. No lastmod dates are invented. Tests cover the populated sitemap with an explicitly labelled fixture origin.

Staging remains noindex. The old blanket X-Robots-Tag header is removed from page responses so a future approved release can be indexed; API responses retain noindex. Generated per-page robots metadata and robots.txt control indexing. Legal approval, an approved origin, approved-only content mode and `VITE_PUBLIC_INDEXING=true` are required to enable it. A category label alone cannot publish/index a draft narrative. Current requester-authorized content follows the existing publication gate; this does not assert final firm legal sign-off. The Privacy Policy remains explicitly pending.

Vercel now uses clean static HTML URLs, permanent singular-to-plural redirects and the custom 404 file, instead of rewriting arbitrary paths to index.html. A preview middleware mirrors route delivery and returns real local HTTP 404s. In-app unknown navigation shows the existing not-found UI and noindex metadata. Actual Vercel responses must still be checked on staging; nothing was manually deployed and no DNS was changed.

## Measured performance changes

- 11 original supplied/licensed images total 1,338,719 bytes; the largest served responsive variants total 527,104 bytes: **60.6% smaller**. This compares source files with the largest served variants, not a measured whole-page transfer or load-time improvement. Smaller viewport choices can transfer less.
- Desktop hero: 397,822 to 197,344 bytes. Mobile hero: 228,524 to 114,464 bytes. Facade: 233,136 to 95,046 bytes. Eight largest served portrait variants together: 120,250 bytes, versus 479,237 bytes for the supplied JPEGs.
- Original assets and provenance are preserved. WebP sources have responsive width descriptors/sizes and actual intrinsic image dimensions, with original fallback images. The hero is eager/high priority; noncritical images remain lazy. Existing portrait crop containers reserve their space. The supplied low-resolution logo is retained honestly; a higher-resolution source is still desirable.
- Font loading uses local system serif/sans stacks, so no web-font request or font-display swap was introduced. Hero text no longer starts transparent; its subtle movement remains. Scrollbar space is reserved to reduce width changes. No numeric CLS/LCP improvement is claimed without a browser measurement.
- Removed the motion package and its unused layout wrapper; existing animations are CSS-based and retain reduced-motion support. This did not materially reduce the already tree-shaken vendor bundle. Sharp is a build-only dependency; generated images are committed and optimization is a separate reproducible command.
- Route code remains in a small shared application bundle. Shared structured content supports cross-links; an additional route-loader framework was not justified by this audit. Prerendered HTML improves initial content availability without replacing the frontend stack.

See image-optimization-report.json for per-asset sizes and prompt-11-measurements.json for final built byte/gzip sizes. No render-blocking external fonts or pre-consent analytics scripts were added.

## Accessibility and responsiveness

Existing mobile/tablet/desktop CSS, meaningful image alternatives, labelled forms/errors, consent keyboard behavior and reduced-motion controls remain covered by tests. Added a footer office heading, high-contrast gold focus outlines on the dark footer, correct image dimensions, sticky-header scroll margins for form fields and stable scrollbar space. Generated-page tests check every heading transition for skipped levels.

Metadata updates on query changes now run separately from scroll/focus handling. Typing a People/Insights filter updates its URL without stealing keyboard focus or returning to the top; a regression test verifies this. Query views receive client noindex metadata and canonicalize to the base directory. Static directory HTML is unfiltered because query-specific HTML is not generated.

Automated palette checks meet WCAG AA 4.5:1 for the tested small-text foreground/background pairs. DOM keyboard/form/landmark/image checks are evidence for those checks, not full WCAG certification. Real device zoom, overflow, screen-reader behavior and photo-overlay contrast still require browser/manual QA.

## Verification

- 93 source/unit/DOM tests passed; two post-build artifact tests passed.
- All 55 real HTML files contain route content, exactly one h1/title/description and social metadata before JavaScript. Source tests verify unique titles/descriptions, publication-aware indexing, sitemap coverage, structured data and configured canonicals.
- Representative pages hydrate their prerendered data-router markup into an actual BrowserRouter in the DOM test environment without recoverable errors. Filter changes preserve focus. No test credentials or real analytics requests are used.
- Built-site HTTP checks: 55/55 routes returned 200 and real static content. Missing root and profile URLs returned 404. Legacy `/industry?test=1` returned 308 to `/industries?test=1`. robots.txt and sitemap.xml returned 200 with appropriate content types. Frontend preview returns JSON 404 for /api/contact, rather than pretending the Vercel function is running.
- TypeScript, lint with zero warnings and the full build passed. The explicit production-release build intentionally failed with the existing missing-policy/consent approval message, confirming that the new build pipeline preserves launch protection.
- **Lighthouse: not run; no scores reported.** The required browser plugin runtime was unavailable. Performance/accessibility/SEO scores above 90 remain targets requiring a browser audit, not completed measurements.

## Preview and launch instructions

1. `npm.cmd ci`, then `npm.cmd run dev` for normal frontend work.
2. `npm.cmd test` and `npm.cmd run lint`.
3. `npm.cmd run build`, `npm.cmd run test:built`, then `npm.cmd run preview -- --host 127.0.0.1 --port 4173` to inspect real static documents and 404 responses. Preview does not execute Vercel functions; use an authorized staging deployment or Vercel dev for contact delivery.
4. Populate real approved legal records and configure the approved `VITE_SITE_URL`. Confirm final content, service settings and client acceptance. Keep indexing disabled for previews.
5. For an authorized public release only, opt in with `VITE_PUBLIC_INDEXING=true` and use `npm.cmd run build:production` / the production target. The build rejects missing legal records, missing/invalid origin and management-preview mode. Rebuild whenever content approvals, scheduled publication dates, URL or environment settings change.
6. On staging, check direct deep links, Vercel custom 404/redirect/API behavior, social previews and Google structured-data tools. Run mobile and desktop Lighthouse against built pages (Home, directory, profile, expertise, Contact), record actual scores and address failures. No 90+ score has been claimed.

Primary references: [Vite prerendering](https://vite.dev/guide/ssr), [React hydration](https://react.dev/reference/react-dom/client/hydrateRoot), [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Vercel static URL configuration](https://vercel.com/docs/project-configuration/vercel-json).

Prompt 12 has not been started.
