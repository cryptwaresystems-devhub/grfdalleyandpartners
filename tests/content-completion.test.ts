import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { Window } from 'happy-dom';
import { createAppRoutes } from '../src/app/routes';
import { PresentationProvider, resolvePresentationMode, type PresentationMode } from '../src/lib/presentation';
import { getExpertiseDetail, expertiseData, type ExpertiseData } from '../src/lib/expertise';
import { getAboutContent } from '../src/lib/about';
import { getRouteTitle } from '../src/lib/route-title';
import { getRouteMetadata } from '../src/lib/route-metadata';
import { ExpertiseDetailTemplate } from '../src/components/expertise/ExpertiseDetailTemplate';
import { AboutPage } from '../src/pages/AboutPage';
import { about } from '../src/data/about';
import { lawyers } from '../src/data/lawyers';
import { insights } from '../src/data/insights';
import { renderContentReport, type ContentReview } from '../scripts/content-report';
import type { Editorial } from '../src/types/content';

const approved: Editorial = { status: 'approved', source: 'TEST FIXTURE ONLY', approvedBy: 'Fixture reviewer', approvedAt: '2026-11-01', publishedAt: '2026-11-02' };
const now = new Date('2026-11-12');
function App({ mode }: { mode: PresentationMode }) { return useRoutes(createAppRoutes(mode)); }
function render(element: Parameters<typeof renderToStaticMarkup>[0]) {
  const dom = new Window();
  dom.document.body.innerHTML = renderToStaticMarkup(h(MemoryRouter, null, element));
  return dom;
}

test('public presentation fails closed; preview requires an explicit valid build option', () => {
  for (const value of [undefined, '', 'preview', 'true', 'management-preview?']) assert.equal(resolvePresentationMode(value), 'approved-only');
  assert.equal(resolvePresentationMode('management-preview'), 'management-preview');
  for (const mode of ['approved-only', 'management-preview'] as const) {
    for (const path of ['/', '/about', '/people', '/insights', `/people/${lawyers[0].slug}`, `/insights/${insights[0].slug}`]) {
      const dom = new Window();
      try {
        dom.document.body.innerHTML = renderToStaticMarkup(h(MemoryRouter, { initialEntries: [path] }, h(App, { mode })));
        const doc = dom.document;
        assert.equal(doc.querySelectorAll('main').length, 1);
        assert.equal(doc.querySelectorAll('h1').length, 1);
        if (mode === 'approved-only') {
          assert.ok(!doc.querySelector('.management-preview-banner'));
          assert.ok(!doc.querySelector('.content-pending'));
          if (path === '/about') assert.ok(doc.body.textContent.includes(about.service));
          if (path.startsWith('/people/') || path.startsWith('/insights/')) assert.notEqual(getRouteTitle(path, mode), 'Page not found');
        } else assert.ok(doc.querySelector('.management-preview-banner'));
      } finally { dom.happyDOM.close(); }
    }
  }
});

test('About approval changes visibility without rewriting its page template', () => {
  const pending = { ...about, editorial: { status: 'in-review' as const, source: 'TEST FIXTURE ONLY' } };
  assert.equal(getAboutContent(pending), null);
  assert.equal(getAboutContent(pending, 'management-preview'), pending);
  assert.equal(getAboutContent(about), about);
  const content = { ...about, editorial: approved, introduction: 'APPROVED INTRO FIXTURE', service: 'APPROVED SERVICE FIXTURE' };
  assert.equal(getAboutContent(content, 'approved-only', now), content);
  const dom = render(h(PresentationProvider, { mode: 'approved-only' }, h(AboutPage, { content })));
  try {
    assert.ok(dom.document.body.textContent.includes('APPROVED SERVICE FIXTURE'));
    assert.ok(!dom.document.querySelector('.provisional-notice'));
    assert.equal(dom.document.querySelectorAll('.person-preview').length, 3);
  } finally { dom.happyDOM.close(); }
  assert.equal(getAboutContent({ ...content, editorial: { ...approved, publishedAt: '2099-01-01' } }, 'approved-only', now), null);
  assert.equal(getAboutContent({ ...about, editorial: { ...about.editorial, status: 'archived' } }, 'management-preview', now), null);
});

function fixtures(): ExpertiseData {
  return { ...expertiseData, industries: [{ ...expertiseData.industries[0], editorial: { status: 'in-review', source: 'fixture' } }], practices: [{ ...expertiseData.practices[0], editorial: { status: 'in-review', source: 'fixture' } }], lawyers: [], insights: [], matters: [], publications: [], connections: [] };
}
test('independently approved taxonomy links are reciprocal, deduplicated and do not publish narrative', () => {
  const data = fixtures();
  const link = { id: 'fixture-link', industryId: data.industries[0].id, practiceId: data.practices[0].id, editorial: approved };
  data.connections = [link, { ...link, id: 'duplicate-link' }, { ...link, id: 'dangling-link', industryId: 'absent' }];
  const practice = getExpertiseDetail('practice', data.practices[0].slug, data, now)!;
  const industry = getExpertiseDetail('industry', data.industries[0].slug, data, now)!;
  assert.equal(practice.connected.length, 1);
  assert.equal(industry.connected.length, 1);
  assert.equal(practice.summary, null);
  for (const editorial of [{ status: 'in-review' as const, source: 'fixture' }, { ...approved, approvedBy: '' }, { ...approved, publishedAt: '2099-01-01' }]) {
    data.connections = [{ ...link, editorial }];
    assert.equal(getExpertiseDetail('practice', data.practices[0].slug, data, now)!.connected.length, 0);
    assert.equal(getExpertiseDetail('industry', data.industries[0].slug, data, now)!.connected.length, 0);
  }
  data.connections = [link];
  data.industries[0].labelApproval = { status: 'pending', source: 'fixture' };
  assert.equal(getExpertiseDetail('practice', data.practices[0].slug, data, now)!.connected.length, 0);
});

test('approved expertise sections render paragraphs, services and accessible section anchors; drafts remain hidden', () => {
  const data = fixtures();
  data.practices[0] = { ...data.practices[0], editorial: approved, summary: 'APPROVED INTRO FIXTURE', sections: [{ heading: 'Services fixture', paragraphs: ['APPROVED PARAGRAPH FIXTURE'], items: ['APPROVED SERVICE FIXTURE', '<script>literal fixture</script>'] }] };
  const detail = getExpertiseDetail('practice', data.practices[0].slug, data, now)!;
  const dom = render(h(ExpertiseDetailTemplate, { detail }));
  try {
    const doc = dom.document;
    assert.ok(doc.body.textContent.includes('APPROVED PARAGRAPH FIXTURE'));
    assert.equal(doc.querySelectorAll('.detail-services li').length, 2);
    assert.equal(doc.querySelectorAll('script').length, 0);
    const anchor = doc.querySelector('a[href="#expertise-section-1"]')!;
    assert.ok(doc.getElementById(anchor.getAttribute('href')!.slice(1)));
    assert.ok(doc.getElementById('expertise-heading-1'));
  } finally { dom.happyDOM.close(); }
  data.practices[0].editorial = { status: 'in-review', source: 'fixture' };
  const pending = getExpertiseDetail('practice', data.practices[0].slug, data, now)!;
  assert.equal(pending.summary, null);
  assert.deepEqual(pending.sections, []);
});

test('all 36 populated expertise routes have body copy, breadcrumbs and connected expertise', () => {
  for (const kind of ['industry', 'practice'] as const) {
    for (const record of kind === 'industry' ? expertiseData.industries : expertiseData.practices) {
      const detail = getExpertiseDetail(kind, record.slug)!;
      const dom = render(h(ExpertiseDetailTemplate, { detail }));
      try {
        const doc = dom.document;
        assert.equal(doc.querySelector('h1')?.textContent, record.name);
        assert.ok(doc.querySelector(`.breadcrumbs a[href="/${kind === 'industry' ? 'industries' : 'practices'}"]`));
        assert.equal(doc.querySelectorAll('.content-pending').length, 0);
        assert.ok(doc.querySelector('.detail-summary')?.textContent);
        assert.ok(doc.querySelectorAll('.detail-services li').length >= 4);
        assert.ok(doc.getElementById('connected-expertise'));
        assert.equal(detail.sections.length, 2);
      } finally { dom.happyDOM.close(); }
    }
  }
});

test('public metadata resolves requester-authorized records and rejects unknown URLs', () => {
  for (const path of [`/people/${lawyers[0].slug}`, `/insights/${insights[0].slug}`]) {
    assert.doesNotMatch(getRouteMetadata(path, 'approved-only').title, /Page not found/);
    assert.match(getRouteMetadata(`${path}-missing`, 'approved-only').title, /Page not found/);
    assert.doesNotMatch(getRouteMetadata(path, 'management-preview').title, /Page not found/);
  }
});

test('missing-content inventory covers all 36 routes and generated report stays in sync', () => {
  const review = JSON.parse(readFileSync('docs/content-review.json', 'utf8')) as ContentReview;
  const report = renderContentReport(review, now);
  assert.equal(report, readFileSync('docs/missing-content-report.md', 'utf8'));
  assert.equal(review.pages.filter(item => item.kind === 'industry').length, 15);
  assert.equal(review.pages.filter(item => item.kind === 'practice').length, 21);
  for (const page of review.pages) assert.ok(report.includes(page.route));
  assert.throws(() => renderContentReport({ ...review, pages: review.pages.slice(1) }, now), /every confirmed category/);
});
