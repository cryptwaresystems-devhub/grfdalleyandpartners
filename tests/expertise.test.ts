import { PresentationProvider } from '../src/lib/presentation';
import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Window } from 'happy-dom';
import { ExpertiseOverviewPage } from '../src/pages/ExpertiseOverviewPage';
import { AboutPage } from '../src/pages/AboutPage';
import { ExpertiseDetailTemplate } from '../src/components/expertise/ExpertiseDetailTemplate';
import { getExpertiseCategories, getExpertiseDetail, expertiseData, safeExternalUrl, type ExpertiseData } from '../src/lib/expertise';
import { practiceGroups } from '../src/data/practice-groups';
import type { Editorial } from '../src/types/content';

const windows: Window[] = [];
afterEach(() => { for (const window of windows.splice(0)) window.happyDOM.close(); });
function render(element: Parameters<typeof renderToStaticMarkup>[0], width = 1440) {
  const dom = new Window({ width, height: 900 }); windows.push(dom);
  dom.document.body.innerHTML = renderToStaticMarkup(h(MemoryRouter, null, h(PresentationProvider, { mode: 'management-preview' }, element)));
  return dom;
}
const now = new Date('2026-11-12');
const approved: Editorial = { status: 'approved', source: 'TEST FIXTURE ONLY', approvedBy: 'Test reviewer', approvedAt: '2026-11-01', publishedAt: '2026-11-02' };
function fixtures(): ExpertiseData {
  return {
    industries: [{ ...expertiseData.industries[0], editorial: approved }],
    practices: [{ ...expertiseData.practices[0], editorial: approved, summary: 'APPROVED INTRO FIXTURE' }],
    lawyers: [{ ...expertiseData.lawyers[0], id: 'test-lawyer', name: 'Approved lawyer fixture', editorial: approved, practiceIds: [expertiseData.practices[0].id] }],
    insights: [{ id: 'test-insight', slug: 'test-insight', name: 'Approved insight fixture', editorial: approved, type: 'article', date: '2026-11-02', authorIds: ['test-lawyer'], practiceIds: [expertiseData.practices[0].id], industryIds: [], body: 'Fixture' }],
    matters: [{ id: 'test-matter', slug: 'test-matter', name: 'Approved matter fixture', editorial: approved, summary: 'Matter fixture summary', practiceIds: [expertiseData.practices[0].id], industryIds: [] }],
    publications: [{ id: 'test-publication', slug: 'test-publication', name: 'Approved publication fixture', editorial: approved, authorIds: ['test-lawyer'], practiceIds: [expertiseData.practices[0].id], industryIds: [], publisher: 'Fixture publisher', externalUrl: 'https://example.com/publication' }],
  };
}

test('directories expose all confirmed names once, with meaningful category URLs', () => {
  for (const kind of ['industry', 'practice'] as const) {
    const records = getExpertiseCategories(kind);
    assert.equal(records.length, kind === 'industry' ? 15 : 21);
    const doc = render(h(ExpertiseOverviewPage, { kind })).document;
    assert.equal(doc.querySelectorAll('h1').length, 1);
    assert.equal(doc.querySelectorAll('.expertise-card').length, records.length);
    for (const record of records) {
      const links = doc.querySelectorAll(`a.expertise-card[href="/${kind === 'industry' ? 'industries' : 'practices'}/${record.slug}"]`);
      assert.equal(links.length, 1, record.name);
      assert.ok(links[0].textContent.includes(record.name));
    }
  }
  const ids = practiceGroups.flatMap(group => [...group.practiceIds]);
  assert.equal(new Set(ids).size, 21); assert.equal(ids.length, 21);
});

test('label confirmation never publishes a draft introduction or unapproved relationships', () => {
  const data = fixtures();
  const practice = data.practices[0];
  practice.editorial = { status: 'in-review', source: 'fixture' };
  practice.summary = 'DO NOT EXPOSE DRAFT INTRO';
  practice.relationships = { industryIds: [data.industries[0].id] };
  const detail = getExpertiseDetail('practice', practice.slug, data, now)!;
  assert.ok(detail); assert.equal(detail.summary, null); assert.equal(detail.connected.length, 0);
  const doc = render(h(ExpertiseDetailTemplate, { detail })).document;
  assert.ok(doc.body.textContent.includes('Content pending'));
  assert.ok(!doc.body.textContent.includes('DO NOT EXPOSE DRAFT INTRO'));
  practice.labelApproval = { status: 'pending', source: 'fixture' };
  assert.equal(getExpertiseDetail('practice', practice.slug, data, now), null);
});

test('approved content and populated relationships render without editing templates', () => {
  const data = fixtures();
  data.practices[0].relationships = { industryIds: [data.industries[0].id, 'missing-industry'] };
  const detail = getExpertiseDetail('practice', data.practices[0].slug, data, now)!;
  assert.equal(detail.connected.length, 1);
  assert.equal(detail.lawyers.length, 1); assert.equal(detail.insights.length, 1);
  assert.equal(detail.matters.length, 1); assert.equal(detail.publications.length, 1);
  const doc = render(h(ExpertiseDetailTemplate, { detail })).document;
  assert.ok(doc.body.textContent.includes('APPROVED INTRO FIXTURE'));
  assert.ok(!doc.querySelector('.content-pending'));
  for (const id of ['connected-expertise', 'related-people', 'related-insights', 'selected-matters', 'related-publications']) assert.ok(doc.getElementById(id));
  const inverse = getExpertiseDetail('industry', data.industries[0].slug, data, now)!;
  assert.equal(inverse.connected[0].id, data.practices[0].id);
});

test('unpublished related lawyers, insights, matters and publications remain hidden', () => {
  const data = fixtures();
  for (const list of [data.lawyers, data.insights, data.matters, data.publications]) {
    list[0].editorial = { status: 'draft', source: 'fixture' };
  }
  data.practices[0].relationships = { lawyerIds: ['test-lawyer'], insightIds: ['test-insight'], matterIds: ['test-matter'], publicationIds: ['test-publication'] };
  const detail = getExpertiseDetail('practice', data.practices[0].slug, data, now)!;
  assert.equal(detail.lawyers.length + detail.insights.length + detail.matters.length + detail.publications.length, 0);
  const doc = render(h(ExpertiseDetailTemplate, { detail })).document;
  for (const id of ['related-people', 'related-insights', 'selected-matters', 'related-publications']) assert.equal(doc.getElementById(id), null);
  assert.equal(safeExternalUrl('javascript:alert(1)'), null);
  assert.equal(safeExternalUrl('not-a-url'), null);
});

test('legacy IDs and explicit cross-taxonomy relationships remain compatible', () => {
  const data = fixtures();
  data.practices[0].relatedIds = [data.industries[0].id];
  data.practices[0].relationships = { industryIds: [] };
  assert.equal(getExpertiseDetail('practice', data.practices[0].slug, data, now)!.connected.length, 1);
  data.practices[0].relatedIds = [];
  data.practices[0].relationships = { industryIds: [data.industries[0].id] };
  assert.equal(getExpertiseDetail('industry', data.industries[0].slug, data, now)!.connected.length, 1);
});

test('About narrative is visibly provisional and leadership retains its preview notice', () => {
  const doc = render(h(AboutPage)).document;
  assert.equal(doc.querySelectorAll('h1').length, 1);
  assert.ok(doc.querySelector('.provisional-notice')?.textContent.includes('Provisional copy'));
  assert.ok(doc.body.textContent.includes('Established in 1962'));
  assert.ok(doc.body.textContent.includes('Profile previews. Full biographies are awaiting final approval.'));
  assert.ok(doc.querySelector('a[href="/contact"]'));
  assert.equal(doc.querySelectorAll('.person-preview').length, 3);
});

test('supporting page CSS adapts at mobile, tablet and desktop widths', () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const dom = render(h('div', null, h(AboutPage), h(ExpertiseOverviewPage, { kind: 'industry' }), h(ExpertiseDetailTemplate, { detail: getExpertiseDetail('practice', expertiseData.practices[0].slug)! })), width);
    const style = dom.document.createElement('style'); style.textContent = readFileSync('src/styles/supporting.css', 'utf8'); dom.document.head.append(style);
    const columns = (selector: string) => dom.getComputedStyle(dom.document.querySelector(selector)!).gridTemplateColumns;
    assert.equal(columns('.industry-directory-grid'), width < 768 ? '1fr' : width < 1024 ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))');
    assert.equal(columns('.about-history'), width < 768 ? '1fr' : '0.9fr 1.1fr');
    assert.equal(columns('.about-approach__grid'), width < 768 ? '1fr' : 'repeat(3, minmax(0, 1fr))');
    assert.equal(dom.getComputedStyle(dom.document.querySelector('.expertise-detail-aside')!).position, width < 768 ? 'static' : 'sticky');
  }
});
