# Prompt 8 - People and Insights

The existing static React/Vite implementation and premium visual language are preserved. No backend, CMS, email-delivery or booking integration was added.

## People delivered

- Eight source-grounded professional profiles with the supplied headshots, names, roles, education, memberships, certifications and known years of call. New profile introductions use only the already supplied role, practice list and year of call.
- Search plus a supported-practice filter using stable practice IDs, live result counts, shareable URLs and clear/empty states.
- Reusable profile templates with LinkedIn/contact destinations when supplied and validated. Seven LinkedIn profiles are supplied; no individual email address was invented. Obinna's unprovided year of call and university remain omitted.
- Authored central insight records appear automatically on the author profile. Bibliography entries can reference `insightId` and avoid duplicating those verified records.

## Insights delivered

- Three real external publication references, preserving historic dates: the 2019 arbitration and trade entries, plus the 2006 aviation paper listed in the supplied biography.
- The additional [Kluwer publisher page](https://kluwerlawonline.com/journalarticle/Air%2Band%2BSpace%2BLaw/31.3/AILA2006019) confirms its title and journal reference. The supplied biography establishes author and year; no day/month or article body was invented. This provenance distinction is recorded in `prompt-8-sources.json` and the record itself.
- Client-side search and combined category, author, practice and industry filters. Relationship options derive from visible central records; no invented sectors or authors fill unused categories.
- Searchable, labelled cards display publication date/category, resolved authors and available practice/industry links. Details show publisher destinations, related profiles/expertise and related perspectives.
- Pagination is implemented at six records per page with range/status, boundary controls, URL state and page reset on filter changes. The current three references fit on one page. Tests exercise the actual UI using real records at page size one, plus longer fixture collections for boundaries.
- Articles, case reviews, news, events, videos and awards are supported in structured files. Categories with no supplied material remain empty. No fictional articles, announcements, case reviews, awards, dates or videos were added.
- Independently permitted plain-text article bodies are supported and safely rendered. Unapproved bodies are neither displayed nor searched.
- Approved YouTube/Vimeo embeds use validated provider IDs and separate media permission. Provider contact occurs only after a click, with titled/lazy iframes. No real video was supplied, so no live video is configured. Event details/registration links are supported only when real data is provided.

## Verification

- 61 automated tests pass, covering all 54 routes, People search/practice combinations, every insight filter, URL round trips, empty/reset behavior, pagination, authorship and taxonomy links, source omissions, date precision, approved body rendering and click-to-load/withdrawn video permission.
- Responsive CSS checks cover 320, 390, 768, 1024 and 1440 pixels, including the new filter controls. Existing shared contrast/reduced-motion checks remain passing.
- ESLint with JSX accessibility rules passes. Strict TypeScript and the production build pass.
- Shared libraries are separated into a cacheable vendor chunk after the combined bundle crossed Vite's size-warning threshold. Current output: app 187.28 kB / 33.18 kB gzip, vendor 321.75 kB / 103.04 kB gzip, CSS 55.32 kB / 10.83 kB gzip. This removes the individual-chunk warning; no Lighthouse measurements are claimed.
- Built-preview HTTP checks passed for all 54 routes, three filtered/paginated deep links and 15 emitted assets. The SPA's HTTP fallback is distinguished from in-app routing, which is verified by integration tests.
- Browser access was retried and no browser was available. Screenshots, actual rendered overflow, screen-reader runs and real-device/browser-console QA remain unverified. These automated checks are not a full accessibility or browser acceptance audit.

## Maintaining content and remaining inputs

See [people-insights-content-guide.md](people-insights-content-guide.md) for data fields, stable-ID relationships, permissions, URLs, media configuration and checks. The Drive folder was rechecked: the same eight biographies and portraits remain available, with no new manuscripts/news/events/video files. The credentials document was not opened or copied. Source documents and review files remain outside `dist`.

Further real article bodies, case reviews, news, event and video records can be added without rebuilding the UI. Final firm editorial review, current professional memberships/titles, Abuja address, phone availability and a higher-resolution logo remain documented refinements. Existing source/requester authorization remains distinct from final firm legal sign-off.

The contact form remains an email-draft preview and Calendly remains pending. Prompt 9 has not been started. No production deployment or DNS changes were performed.
