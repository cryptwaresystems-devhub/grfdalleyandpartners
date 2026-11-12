# Expertise content guide

## What is currently public

The WRS-confirmed category names, routes and content-pending states are visible. No detailed industry/practice summaries, representative matters or draft biographies were invented or promoted to approved status.

`labelApproval.status = confirmed` confirms the category name only. Its source identifies the relevant WRS section. It is independent of `editorial`, which governs the summary and relationships. If retiring a category completely, withdraw its label confirmation as well as its publication approval.

## Add approved introductions

Edit the matching record in `src/data/industries.ts` or `src/data/practices.ts` and populate `summary`. Record the real approval metadata in `editorial`: approved status, named reviewer, approval timestamp and publication timestamp. The existing `isPublished` selector rejects missing/invalid dates, future publication and publication before approval.

A confirmed name never publishes its draft summary. No approval names or timestamps should be fabricated. Keep confidential material out of static source modules; this is an editorial display gate, not access control.

## Populate relationships

`Expertise.relationships` accepts arrays of existing IDs:

- industryIds / practiceIds: cross-taxonomy expertise.
- lawyerIds: related fully approved lawyers.
- insightIds: related fully approved insights.
- matterIds: related fully approved representative matters.
- publicationIds: related fully approved publications.

Explicit relationships on an expertise record become active when that source record is fully published. The resolver also recognises inverse associations from approved records. Published lawyers use practiceIds; insights, matters and publications use practiceIds and industryIds. Do not invent associations merely to fill a page.

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
