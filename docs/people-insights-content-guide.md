# People and Insights content guide

The site remains a static React/Vite application. All content changes are made in typed data files, checked and rebuilt. There is no CMS or backend.

## People

Edit `src/data/lawyers.ts`. Keep each person's `id` and `slug` stable. Names, roles, education, memberships, certifications, years of call and LinkedIn URLs must come from the supplied biography or a later confirmed source. Eight portraits are already matched to their biography photographs. Do not infer missing qualifications, contact details or office assignments.

`biography` supports plain-text paragraphs separated by a blank line. Current narratives use only the supplied roles, practice lists and years of call. `practiceNames` preserves the source wording; `practiceIds` links confirmed taxonomy records and drives the directory filter. Only practices linked to visible people are offered as options.

`email` and `linkedin` are optional and suppressed when absent or invalid. The current sources provide seven LinkedIn profiles and no personal professional email addresses. Every profile retains the general Contact the Firm destination. Do not substitute a guessed individual email.

`suppliedPublications` is a historical bibliography, not a fabricated insight dataset. An optional `insightId` connects a verified publication to the central Insights record. When that insight is visible, it appears once in Published perspectives rather than being duplicated in the bibliography. Other supplied titles remain qualified bibliography entries with their original year precision.

## Insights

Edit `src/data/insights.ts`. Supported types are `article`, `case-review`, `external-publication`, `news`, `event`, `video` and `award`. The current dataset contains three external archive references; no manuscripts, news, event or video records were supplied. Those categories correctly show no results.

Each record contains a stable `id`, `slug`, actual title, `type`, date, source and publication permission. Use `authorIds`, `practiceIds` and `industryIds` for relationships. These resolve labels, links and filter options from the central published/confirmed datasets. Never assign an unrelated industry just to fill a panel. The trade article links to International/Cross Border; the aviation article links to Aviation and Airlines and its connected practices. The arbitration paper has no invented sector association.

Use `datePrecision: 'year' | 'month' | 'day'` with the corresponding `YYYY`, `YYYY-MM` or `YYYY-MM-DD` value. Do not fill in a day or month that is unknown. `archive: true` adds the archive label; news and events are not automatically described as historical. The current references are December 2019, 3 September 2019 and year 2006.

`externalUrl` points to the actual publisher. No publisher body was copied. `body` contains plain text and is only displayed or indexed by search when `bodyEditorial` independently passes the publication gate as well as the parent record. Permission to list metadata is not permission to reproduce article text. HTML is never executed as body content.

## Video and event support

For a real approved video, add `video: { provider, id, title, editorial }`. Providers are `youtube` (11-character video ID) and `vimeo` (numeric video ID). Supply the real video identifier and its own permission record. Raw iframe markup and arbitrary embed URLs are not accepted.

No provider request is made until the visitor clicks Load video. YouTube uses the `youtube-nocookie.com` embed host; Vimeo uses `player.vimeo.com`. The iframe has a title, constrained permissions and no forced autoplay. Withdrawing video or parent permission removes the embed. Prompt 10 additionally requires optional-media consent from the global cookie preferences; the Load action alone cannot override a rejection. Withdrawing media permission removes the iframe. No real video is currently configured.

Optional event details use `event: { startsAt, endsAt?, location?, registrationUrl? }`. Use an actual date or an ISO timestamp with a timezone. Date-only inputs do not acquire an invented time; timestamp displays explicitly use UTC. Registration links appear only when supplied and valid. Do not invent event dates or locations.

## Search, filters and browsing

- People: `/people?q=Faith&practice=corporate-and-commercial`.
- Insights: `/insights?q=2006&author=fatai-ajibola-dalley-san-fciarb-uk&industry=aviation-and-airlines`.
- Additional Insights parameters are `category`, `practice` and `page`.

Search is case/accent-insensitive and matches all entered terms. Insight search includes titles, subtitles, publisher/date, visible authors, practice/industry labels and independently permitted body text. Unpublished bodies are not searchable. Filters intersect rather than replacing each other. Options are derived from actual visible records and include counts.

Changing a filter resets pagination. Clearing filters resets the whole directory selection. URL state survives visiting a profile and using Back. Invalid relationship selections produce an honest empty result with a clear/reset option. Pagination defaults to six entries, clamps invalid page numbers and appears only when there is more than one page; the current three entries fit on one page. The actual pagination UI is tested using the real records at a one-entry page size.

## Checks and publication

Run `npm run lint`, `npm test`, `npm run build` and `npm run content:report`. Tests verify data IDs, source relationships, date precision, filter intersections, browser-router interactions, pagination, body/media permissions, safe text and responsive CSS.

Existing `authorized` records retain the requester's explicit instruction to use supplied material. Final firm approval can replace that with real `approvedBy` and `approvedAt` metadata when received. Never invent a legal reviewer or treat a source check as independent certification of current memberships. Keep private source documents and credentials out of the frontend and `public/` directory.
