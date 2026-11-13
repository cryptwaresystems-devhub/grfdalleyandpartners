import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { lawyers } from '../src/data/lawyers';
import { industries } from '../src/data/industries';
import { practices } from '../src/data/practices';
import { insights } from '../src/data/insights';
import { expertiseConnections } from '../src/data/expertise-connections';
import { isPublished } from '../src/lib/publication';
import { getRouteMetadata } from '../src/lib/route-metadata';
import { publishedSeo } from '../src/lib/seo-fields';
import { pageSeoOverrides } from '../src/data/page-seo';
import { PersonCard } from '../src/components/people/PersonCard';
const editorial = { status: 'approved' as const, source: 'QA FIXTURE ONLY', approvedBy: 'QA fixture reviewer', approvedAt: '2026-01-01', publishedAt: '2026-01-02' };
test('FR-11 independent SEO fields can be edited without changing public names and drafts remain hidden', () => {
  const person = lawyers[0]; const previous = person.seo;
  try {
    person.seo = { title: 'QA custom title', description: 'QA custom description', imageAlt: 'QA portrait description', editorial };
    assert.equal(getRouteMetadata(`/people/${person.slug}`).title, 'QA custom title');
    assert.equal(getRouteMetadata(`/people/${person.slug}`).description, 'QA custom description');
    const html = renderToStaticMarkup(h(MemoryRouter, null, h(PersonCard, { person })));
    assert.ok(html.includes('alt="QA portrait description"'));
    person.seo.editorial = { status: 'draft', source: 'QA DRAFT' };
    assert.ok(!getRouteMetadata(`/people/${person.slug}`).title.includes('QA custom'));
    assert.ok(!renderToStaticMarkup(h(MemoryRouter, null, h(PersonCard, { person }))).includes('QA portrait description'));
    assert.equal(publishedSeo({ title: 'FUTURE', editorial: { ...editorial, publishedAt: '2099-01-01' } }), null);
  } finally { person.seo = previous; }
});
test('FR-11 static page overrides require approval and cannot disguise missing legal text or unknown routes', () => {
  try {
    pageSeoOverrides['/contact'] = { title: 'QA Contact', description: 'QA reviewed description', editorial };
    assert.equal(getRouteMetadata('/contact').title, 'QA Contact');
    pageSeoOverrides['/privacy'] = { title: 'FAKE LEGAL APPROVAL', editorial };
    pageSeoOverrides['/missing'] = { title: 'FAKE PAGE', editorial };
    assert.ok(!getRouteMetadata('/privacy').title.includes('FAKE'));
    assert.ok(!getRouteMetadata('/missing').title.includes('FAKE'));
  } finally { delete pageSeoOverrides['/contact']; delete pageSeoOverrides['/privacy']; delete pageSeoOverrides['/missing']; }
});
test('all supplied relationship identifiers resolve and each insight author can expose the same insight', () => {
  const known = (ids: string[], records: { id: string }[]) => ids.every(id => records.some(record => record.id === id));
  for (const insight of insights.filter(item => isPublished(item))) {
    assert.ok(known(insight.authorIds, lawyers)); assert.ok(known(insight.practiceIds, practices)); assert.ok(known(insight.industryIds, industries));
    for (const author of lawyers.filter(person => insight.authorIds.includes(person.id))) assert.ok(insights.filter(record => record.authorIds.includes(author.id)).some(record => record.id === insight.id));
  }
  for (const person of lawyers) assert.ok(known(person.practiceIds, practices));
  for (const connection of expertiseConnections) { assert.ok(industries.some(record => record.id === connection.industryId)); assert.ok(practices.some(record => record.id === connection.practiceId)); }
});
