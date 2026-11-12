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
export function renderContentReport(review: ContentReview, now = new Date()) {
  const records = [...industries, ...practices];
  if (review.pages.length !== records.length || new Set(review.pages.map(page => page.id)).size !== records.length || records.some(record => !review.pages.some(page => page.id === record.id))) throw new Error('Source review must cover every confirmed category exactly once.');
  const missing = records.filter(record => !isPublished(record, now) || !record.summary?.trim() || !record.sections?.length);
  const links = expertiseConnections.filter(link => isPublished({ ...link, name: link.id, slug: link.id }, now));
  const lines = ['# Content coverage and final-review report', '',
    'Updated after the requester explicitly authorised use of supplied materials and delegated authorship of missing copy on 12 November 2026. This supersedes the previous content-blocker report.', '',
    `**${records.length - missing.length} of ${records.length} industry/practice pages populated. ${missing.length} missing page introductions/sections.** About Us: ${isPublished(about, now) ? 'populated and requester-authorized' : 'pending'}. Taxonomy connections: ${links.length}.`, '',
    'Publication uses the distinct `authorized` editorial state. It records the real requester instruction; it does not invent a firm reviewer or represent newly written copy as final legal sign-off. The original source-coverage inventory remains in content-review.json.', '',
    '## Page coverage', '', '| Page | Route | Copy basis | Status |', '| --- | --- | --- |'];
  for (const page of review.pages) {
    const record = records.find(item => item.id === page.id)!;
    lines.push(`| ${page.name.replaceAll('|', '\\|')} | \`${page.route}\` | ${page.sourcePages.length ? `Profile pp. ${page.sourcePages.join(', ')} plus editorial adaptation` : 'Original editorial copy using the confirmed category'} | ${isPublished(record, now) && record.summary && record.sections?.length ? 'Populated; requester-authorized' : 'Content pending'} |`);
  }
  lines.push('', '## What was added', '',
    '- Unique introductions, commercial context, discussion topics and enquiry links for all 15 industries and 21 practices.',
    '- Profile-grounded About history, commercial positioning and client-service approach.',
    '- Bidirectional industry/practice links, described as editorial navigation rather than proof of past experience.',
    '- Eight existing source-checked biographies/portraits and two verified historic publication references restored to normal views. Article bodies were not invented or republished; body permission is separate from archive metadata permission.', '',
    '## Final firm review and outstanding assets', '',
    '- Review newly authored sector/practice wording for final firm positioning and service scope. This is a later editorial refinement, not a missing-copy blocker.',
    '- Reconfirm professional titles and current memberships; all displayed details remain as supplied.',
    '- Confirm Abuja address, telephone availability and provide a higher-resolution logo.',
    '- Any future representative matters, client names, amounts, awards or rankings require specific sourced content. None was invented to fill a page.',
    '- Complete additional People/Insights functionality and relationships in Prompt 8. Email delivery, scheduling, analytics and production deployment remain later work.', '',
    'No credentials or private source documents were added to public assets. Run `npm run content:report` to regenerate this inventory.', '');
  return lines.join('\n');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  writeFileSync('docs/missing-content-report.md', renderContentReport(JSON.parse(readFileSync('docs/content-review.json', 'utf8')) as ContentReview));
  console.log('Updated content coverage and final-review report.');
}
