import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Window } from 'happy-dom';
import { lawyers } from '../src/data/lawyers';
import { insights } from '../src/data/insights';
import { industries } from '../src/data/industries';
import { practices } from '../src/data/practices';
import { filterLawyers, linkedinProfileUrl, professionalEmailHref } from '../src/lib/people';
import { approvedVideoUrl, filterInsightRecords, getInsightContext, getInsightLookup, getVisibleInsights, insightDateLabel, insightFilterOptions } from '../src/lib/insights';
import { paginate } from '../src/lib/pagination';
import { InsightDetailTemplate } from '../src/components/insights/InsightDetailTemplate';
import { LawyerProfileTemplate } from '../src/components/people/LawyerProfileTemplate';
import { ApprovedVideo } from '../src/components/insights/ApprovedVideo';
import { InsightsPage } from '../src/pages/InsightsPage';
import type { Editorial, Insight } from '../src/types/content';

const approved: Editorial = { status: 'approved', source: 'TEST FIXTURE ONLY', approvedBy: 'Test reviewer', approvedAt: '2026-11-01', publishedAt: '2026-11-02' };
const lookup = getInsightLookup('approved-only');
function html(element: Parameters<typeof renderToStaticMarkup>[0]) { return renderToStaticMarkup(h(MemoryRouter, null, element)); }

test('People practice filters intersect name search and only match stable supported IDs', () => {
  const result = filterLawyers(lawyers, 'FAITH', 'corporate-and-commercial', practices);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'faith-izegboya-adebo');
  assert.equal(filterLawyers(lawyers, 'FAITH', 'arbitration-mediation', practices).length, 0);
  assert.equal(filterLawyers(lawyers, '', 'not-a-practice', practices).length, 0);
  assert.equal(filterLawyers(lawyers, 'banking financial services', 'all', practices).length, 3);
});

test('Insights search combines category, author, industry and practice without indexing unapproved bodies', () => {
  const aviation = filterInsightRecords(insights, { query: '2006 DALLEY', category: 'external-publication', authorId: lawyers[1].id, practiceId: 'aviation-transportation', industryId: 'aviation-and-airlines' }, lookup);
  assert.equal(aviation.length, 1);
  assert.equal(aviation[0].id, 'warsaw-convention-exclusivity');
  assert.equal(filterInsightRecords(insights, { category: 'video' }, lookup).length, 0);
  assert.equal(filterInsightRecords(insights, { authorId: lawyers[0].id }, lookup).length, 0);
  assert.equal(filterInsightRecords(insights, { practiceId: 'absent' }, lookup).length, 0);
  const fixture: Insight = { ...insights[0], editorial: approved, subtitle: 'CAFÉ FIXTURE', body: 'UNAPPROVED SECRET FIXTURE' };
  assert.equal(filterInsightRecords([fixture], { query: 'cafe fixture' }, lookup).length, 1);
  assert.equal(filterInsightRecords([fixture], { query: 'secret' }, lookup).length, 0);
  assert.equal(filterInsightRecords([{ ...fixture, bodyEditorial: approved }], { query: 'secret' }, lookup).length, 1);
  assert.equal(getVisibleInsights('approved-only', [{ ...fixture, editorial: { status: 'draft', source: 'fixture' } }]).length, 0);
});

test('filter options and source relationships resolve real records without invented associations', () => {
  const options = insightFilterOptions(insights, lookup);
  assert.deepEqual(options.authors.map(item => item.id), [lawyers[1].id]);
  assert.deepEqual(options.industries.map(item => item.id), ['aviation-and-airlines']);
  assert.equal(options.authors[0].count, 3);
  assert.ok(options.practices.some(item => item.id === 'international-cross-border'));
  for (const record of insights) {
    for (const id of record.authorIds) assert.ok(lawyers.some(item => item.id === id));
    for (const id of record.practiceIds) assert.ok(practices.some(item => item.id === id));
    for (const id of record.industryIds) assert.ok(industries.some(item => item.id === id));
    const context = getInsightContext(record, 'approved-only');
    assert.equal(context.authors[0].id, lawyers[1].id);
  }
});

test('pagination clamps invalid and out-of-range pages and covers every result exactly once', () => {
  const records = Array.from({ length: 13 }, (_, index) => index + 1);
  assert.deepEqual(paginate(records, '1').items, [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(paginate(records, '2').items, [7, 8, 9, 10, 11, 12]);
  assert.deepEqual(paginate(records, '999').items, [13]);
  assert.equal(paginate(records, '-1').page, 1);
  assert.equal(paginate(records, 'bad').page, 1);
  assert.equal(paginate(records, '1.5').page, 1);
  assert.deepEqual(paginate([], '999').items, []);
  assert.equal(paginate([], null).first, 0);
});

test('profile narratives and bibliography links remain source-grounded and suppress unsupplied contact details', () => {
  assert.ok(lawyers.every(person => person.biography?.includes(person.name)));
  for (const person of lawyers) {
    assert.ok(person.biography?.includes(person.role.toLowerCase().split(' ')[0]) || person.biography?.includes('co-founding'));
    for (const entry of person.suppliedPublications ?? []) if (entry.insightId) assert.ok(insights.some(record => record.id === entry.insightId && record.authorIds.includes(person.id)));
  }
  const profile = html(h(LawyerProfileTemplate, { person: lawyers[1] }));
  for (const record of insights) assert.ok(profile.includes(`href="/insights/${record.slug}"`));
  assert.equal(linkedinProfileUrl('https://example.com/in/name'), null);
  assert.equal(linkedinProfileUrl('javascript:alert(1)'), null);
  assert.equal(linkedinProfileUrl('https://www.linkedin.com.evil.test/in/name'), null);
  assert.equal(linkedinProfileUrl('https://user:pass@www.linkedin.com/in/name'), null);
  assert.ok(linkedinProfileUrl(lawyers[0].linkedin));
  assert.equal(professionalEmailHref(null), null);
  assert.equal(professionalEmailHref('name@example.com\nBcc:other@example.com'), null);
  assert.equal(professionalEmailHref('name@example.com'), 'mailto:name%40example.com');
});

test('historic date precision is preserved and impossible dates do not become invented dates', () => {
  assert.equal(insightDateLabel(insights[2]), '2006');
  assert.equal(insightDateLabel(insights[0]), 'December 2019');
  assert.equal(insightDateLabel({ ...insights[1], date: '2026-02-31' }), 'Publication date pending');
  assert.equal(insightDateLabel({ ...insights[0], date: '2026-13' }), 'Publication date pending');
  assert.equal(insightDateLabel({ ...insights[2], date: 'unknown' }), 'Publication date pending');
});

test('video embeds require independent publication permission, validated provider IDs and explicit loading', () => {
  const video: NonNullable<Insight['video']> = { provider: 'youtube', id: 'TESTvideo01', title: 'TEST VIDEO FIXTURE', editorial: approved };
  assert.equal(approvedVideoUrl(video), 'https://www.youtube-nocookie.com/embed/TESTvideo01');
  assert.equal(approvedVideoUrl({ ...video, provider: 'vimeo', id: '123456789' }), 'https://player.vimeo.com/video/123456789');
  for (const id of ['../file', 'id?autoplay=1', '<script>', '']) assert.equal(approvedVideoUrl({ ...video, id }), null);
  assert.equal(approvedVideoUrl({ ...video, editorial: { status: 'draft', source: 'fixture' } }), null);
  assert.equal(approvedVideoUrl({ ...video, editorial: { ...approved, publishedAt: '2099-01-01' } }), null);
  const markup = html(h(ApprovedVideo, { insight: { ...insights[0], video } }));
  assert.ok(markup.includes('Choose preferences to enable video'));
  assert.ok(!markup.includes('<iframe'));
  assert.equal(html(h(ApprovedVideo, { insight: { ...insights[0], editorial: { status: 'draft', source: 'fixture' }, video } })), '');
});

test('detail templates render approved plain text and event metadata without treating every entry as an archive', () => {
  const fixture: Insight = { ...insights[0], editorial: approved, name: 'TEST EVENT FIXTURE', type: 'event', archive: false, externalUrl: undefined, subtitle: undefined, body: 'Approved fixture paragraph.\n\n<script>literal text</script>', bodyEditorial: approved, event: { startsAt: '2026-11-20T10:00:00Z', location: 'TEST LOCATION', registrationUrl: 'https://example.com/registration' } };
  const dom = new Window();
  try {
    dom.document.body.innerHTML = html(h(InsightDetailTemplate, { insight: fixture }));
    assert.equal(dom.document.querySelectorAll('.insight-body-copy p').length, 2);
    assert.equal(dom.document.querySelectorAll('script').length, 0);
    assert.ok(dom.document.querySelector('.insight-event time'));
    assert.ok(dom.document.body.textContent.includes('TEST LOCATION'));
    assert.ok(dom.document.querySelector('a[href="https://example.com/registration"]'));
    assert.ok(!dom.document.querySelector('.insight-detail-body > .eyebrow')?.textContent.includes('Archive'));
  } finally { dom.happyDOM.close(); }
});

test('refinement controls adapt to mobile, tablet and desktop with labelled native inputs', () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const dom = new Window({ width, height: 900 });
    try {
      dom.document.body.innerHTML = html(h(InsightsPage));
      const style = dom.document.createElement('style');
      style.textContent = readFileSync('src/styles/people-insights-contact.css', 'utf8');
      dom.document.head.append(style);
      assert.equal(dom.getComputedStyle(dom.document.querySelector('.insight-refine-grid')!).gridTemplateColumns, width < 768 ? '1fr' : 'repeat(3, minmax(0, 1fr))');
      for (const control of dom.document.querySelectorAll('input, select')) assert.ok(dom.document.querySelector(`label[for="${control.id}"]`));
    } finally { dom.happyDOM.close(); }
  }
});
