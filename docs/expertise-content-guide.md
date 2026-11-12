# Expertise content and publication guide

All 15 industry and 21 practice pages are populated. Copy combines the supplied Firm Profile where applicable with original, neutral sector/practice wording written under the requester's explicit discretion. The 68 industry/practice associations are editorial navigation, not claims of past representative work.

## Publication states

`approved` records require `approvedBy`, `approvedAt` and `publishedAt`. `authorized` records instead require `authorizedBy`, `authorizedAt` and `publishedAt`: the real requester instruction is recorded, without inventing final firm legal review. Both reject missing/invalid metadata, future publication and publication before authorization/approval. Draft, archived and in-review records remain excluded from normal views.

The current requester authorization is documented in `requester-content-authorization.json`. Actual firm legal sign-off remains a separate later review. Do not invent approval names, credentials, rankings, matters or dates. These are static display controls, not authentication; confidential information must not be placed in frontend content files.

## Page content

Edit matching records in `src/data/industries.ts` and `src/data/practices.ts`. Each has `summary` and `sections: [{ heading, paragraphs, items? }]`. The template generates section anchors, an on-page menu and service/discussion lists, and safely renders text without raw HTML. Confirmed names are independently governed by `labelApproval`.

`src/data/about.ts` contains profile-grounded history, positioning and service approach. It shares the publication boundary. Homepage leadership and insight previews draw on central source records.

## Relationships

`src/data/expertise-connections.ts` stores `{ id, industryId, practiceId, editorial }` records. One permitted connection resolves in both directions, with deduplication and confirmed destinations. Withdrawn, dangling and unpublished links do not appear. This independent permission does not publish an otherwise unapproved page narrative.

Existing `relationships` arrays and legacy `relatedIds` still work. Source-checked lawyer practice IDs populate related people; verified insight associations populate related insights. Related records must have their own publication permission. Do not assign a lawyer to a new sector solely to fill a panel.

Archive metadata permission does not authorize reproduction of an article body. An insight body additionally requires its own valid `bodyEditorial` metadata. No new article bodies have been supplied or generated.

## Reports and final review

Run `npm run content:report` to regenerate `docs/missing-content-report.md`. It checks all 36 pages and reports current content coverage and outstanding factual/asset confirmations. `content-review.json` preserves original source-page coverage and candidate evidence; it is outside public build output.

The default build displays authorized/approved records. `VITE_CONTENT_MODE=management-preview` additionally displays eligible review records with a banner. Both retain noindex until launch is separately authorised. Final wording review, current professional details, Abuja address, phone availability and a better logo remain documented refinements. They do not require blanking the completed demonstration pages.
