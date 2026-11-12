import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { industries } from '../src/data/industries';
import { practices } from '../src/data/practices';
import { about } from '../src/data/about';
import { expertiseConnections } from '../src/data/expertise-connections';
import { isPublished } from '../src/lib/publication';

export interface ContentReview {
  checkedOn: string;
  about: { sourcePages: number[]; missing: string[] };
  pages: { id: string; kind: string; route: string; name: string; sourcePages: number[]; coverage: string; missing: string[] }[];
  relationshipCandidates: { id: string; industryId: string; practiceId: string; sourcePages: number[]; evidence: string }[];
}
const cell = (value: string) => value.replaceAll('|', '\\|').replaceAll('\n', ' ');
export function renderContentReport(review: ContentReview, now = new Date()) {
  const records = [...industries, ...practices];
  if (review.pages.length !== records.length || new Set(review.pages.map(page => page.id)).size !== records.length
    || records.some(record => !review.pages.some(page => page.id === record.id))) throw new Error('Source review must cover every confirmed category exactly once.');
  const missing = records.filter(record => !isPublished(record, now) || !record.summary?.trim());
  const approvedLinks = expertiseConnections.filter(link => isPublished({ ...link, name: link.id, slug: link.id }, now));
  const lines = [
    '# Prompt 7 missing-content and approval report', '',
    `Source review: ${review.checkedOn}. Regenerate with \`npm run content:report\` after content or approval changes.`, '',
    `**${missing.length} of ${records.length} expertise introductions await supplied content or publication approval.** About Us: ${isPublished(about, now) ? 'publication approved' : 'publication approval pending'}. Independently approved taxonomy connections: ${approvedLinks.length}.`, '',
    'The approved specification confirms the 15 industry and 21 practice labels. It does not supply complete page copy or approve the Firm Profile for verbatim publication. The supplied Drive folder contains the original biographies, portraits, logo and an excluded credentials document; no new approved page copy or design-feedback file was located.', '',
    'No approval names, dates, descriptions, matters, rankings or professional achievements have been invented. Source-backed excerpts and proposed links are in `docs/content-review.json` for review only; this file is not imported by the app.', '',
    '## About Us', '',
    `Source: Updated Firm Profile, page ${review.about.sourcePages.join(', ')}. Existing composed copy is retained in the management preview and hidden from the default public build.`, '',
    ...review.about.missing.map(item => `- ${item}`), '',
  ];
  for (const [kind, heading] of [['industry', 'Industries'], ['practice', 'Practice areas']]) {
    lines.push(`## ${heading}`, '', '| Page and route | Source coverage | Publication status |', '| --- | --- | --- |');
    for (const page of review.pages.filter(item => item.kind === kind)) {
      const record = records.find(item => item.id === page.id)!;
      const ready = isPublished(record, now) && Boolean(record.summary?.trim());
      const pages = page.sourcePages.length ? `Profile pp. ${page.sourcePages.join(', ')}. ` : '';
      lines.push(`| ${cell(page.name)} — \`${page.route}\` | ${cell(pages + page.coverage)} | ${ready ? 'Introduction approved; check final sections and associations' : 'Approved introduction, page sections and relationship decisions needed'} |`);
    }
    lines.push('');
  }
  lines.push('## Proposed cross-links requiring approval', '', '| Industry | Practice | Evidence |', '| --- | --- | --- |');
  for (const link of review.relationshipCandidates) {
    const industry = industries.find(item => item.id === link.industryId);
    const practice = practices.find(item => item.id === link.practiceId);
    if (!industry || !practice) throw new Error(`Invalid proposed relationship: ${link.id}`);
    lines.push(`| ${cell(industry.name)} | ${cell(practice.name)} | Profile pp. ${link.sourcePages.join(', ')}: ${cell(link.evidence)} |`);
  }
  lines.push('', 'Related lawyers and insights remain hidden on expertise pages until the related records have full publication approval and an explicit source-backed association. Existing biography practice mappings are not a substitute for that approval.', '',
    '## Required client response', '',
    'Provide final approved copy for each listed page, or identify the exact source passages approved for reuse. Confirm the taxonomy relationships and any related people/insights. Supply the actual approving reviewer, approval date and intended publication date; the engineer will not assign these on the firm\'s behalf. Specific gaps in the profile include current-service scope, mediation, broader transport coverage, technology/telecom scope and up-to-date regulatory references.', '',
    'Historic representative matters, client names, monetary amounts, relative dates such as “currently/recently”, comparative rankings and achievements in the profile have not been copied into public pages. Their currency and publication permission require separate review.', '',
    'Prompt 7 content population is **not complete** until these inputs arrive. The templates, approval boundary and missing-content inventory can be reviewed now.', '');
  return lines.join('\n');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const review = JSON.parse(readFileSync('docs/content-review.json', 'utf8')) as ContentReview;
  writeFileSync('docs/missing-content-report.md', renderContentReport(review));
  console.log('Updated docs/missing-content-report.md for all 36 expertise routes and About Us.');
}
