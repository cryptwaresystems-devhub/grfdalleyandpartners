# Expertise content guide

## What is currently public

The WRS-confirmed category names, routes and content-pending states are visible. No detailed industry/practice summaries, representative matters or draft biographies were invented or promoted to approved status.

`labelApproval.status = confirmed` confirms the category name only. Its source identifies the relevant WRS section. It is independent of `editorial`, which governs the summary and relationships. If retiring a category completely, withdraw its label confirmation as well as its publication approval.

## Add approved introductions

Edit the matching record in `src/data/industries.ts` or `src/data/practices.ts` and populate `summary`. Record the real approval metadata in `editorial`: approved status, named reviewer, approval timestamp and publication timestamp. The existing `isPublished` selector rejects missing/invalid dates, future publication and publication before approval.

A confirmed name never publishes its draft summary. No approval names or timestamps should be fabricated. Keep confidential material out of static source modules; this is an editorial display gate, not access control.

For long-form content, add `sections: [{ heading, paragraphs: string[], items?: string[] }]` on the expertise record. These paragraphs and service bullets share the record's approval gate. The template generates section anchors and on-page navigation automatically and renders text safely without raw HTML.

The source-reference inventory is `docs/content-review.json`: all 36 page gaps, 11 verbatim candidate excerpts including About, and ten proposed taxonomy associations. It stays outside app data. No excerpt or suggested association is approved merely because it is listed there. Run `npm run content:report` after updating actual content/approval records.

## Populate relationships

`Expertise.relationships` accepts arrays of existing IDs:

- industryIds / practiceIds: cross-taxonomy expertise.
- lawyerIds: related fully approved lawyers.
- insightIds: related fully approved insights.
- matterIds: related fully approved representative matters.
- publicationIds: related fully approved publications.

Explicit relationships on an expertise record become active when that source record is fully published. The resolver also recognises inverse associations from approved records. Published lawyers use practiceIds; insights, matters and publications use practiceIds and industryIds. Do not invent associations merely to fill a page.

A taxonomy relationship may also be reviewed independently of either narrative. Add its `id`, `industryId`, `practiceId` and real `editorial` approval metadata to `src/data/expertise-connections.ts`. Approved associations appear in both directions, resolve confirmed destinations only and are deduplicated. Draft, scheduled, incomplete and dangling associations do not appear. This does not publish either page's unapproved copy. The list is currently empty because the proposed associations await approval.

Related people and insights link directly to their approved detail routes. Their own publication approval remains required even when the expertise introduction or taxonomy association is approved.

The legacy `relatedIds` field still resolves cross-taxonomy links and can coexist with the new fields. Dangling IDs are ignored. Cross-taxonomy destinations require a confirmed category name or full publication approval; their summaries remain gated independently.

## Matters and publications

`src/data/matters.ts` and `src/data/publications.ts` start empty. Add only approved, source-backed records using the types in `src/types/content.ts`. Matters support a summary. Publications support author IDs, publisher, optional verified year and external URL.

Only fully approved records display. External links accept HTTP/HTTPS only; text is rendered safely as text. Publication bodies, unverified dates and case outcomes should not be fabricated. The homepage's two verified archive excerpts remain separate from these approval-governed detail-page datasets.

## Template behavior

`getExpertiseDetail` resolves the introduction and relationships. `ExpertiseDetailTemplate` displays approved sections automatically and omits empty ones. With no approved summary, it displays a content-pending panel and enquiry link. With no related material, it displays a concise forthcoming note. Adjacent-category navigation and breadcrumbs are automatic.

No React template changes are needed to add approved content or relationships. As with the rest of this static Vite site, data updates still require the normal build/deployment process.

The practice browsing groups are editorial navigation, not additional legal services or approved marketing claims. New confirmed practice records not assigned to a group fall into Further practice areas.

## Before public launch

Approve About marketing language and all visible management-preview portraits, complete content review, perform real-browser/device QA, and remove preview noindex only when launch is authorised. No CMS or backend has been introduced.

The default presentation is approved-only. An explicit `VITE_CONTENT_MODE=management-preview` build preserves the MVP for review and displays a banner. About, directories/detail pages, homepage previews, authors/related writing and route metadata share this boundary. Technical implementation approval is separate from content publication approval.
