import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Window } from 'happy-dom';
import { HomePage } from '../src/pages/HomePage';
import { PeoplePreview } from '../src/components/home/PeoplePreview';
import { featuredPractices, featuredIndustries, managementPeople, verifiedPublications } from '../src/data/homepage';
import { practices } from '../src/data/practices';
import { industries } from '../src/data/industries';

const windows: Window[] = [];
afterEach(() => { for (const dom of windows.splice(0)) dom.happyDOM.close(); });
function home(width = 1440) {
  const dom = new Window({ url: 'http://localhost:5173', width, height: 900 });
  windows.push(dom);
  dom.document.body.innerHTML = renderToStaticMarkup(h(MemoryRouter, null, h(HomePage)));
  return dom;
}
test('homepage has one heading, named sections, useful image alternatives and real destinations', () => {
  const dom = home();
  const doc = dom.document;
  assert.equal(doc.querySelectorAll('h1').length, 1);
  assert.equal(doc.querySelector('h1')?.textContent, 'Established in Experience.Focused on Your Future.');
  assert.ok(doc.body.textContent.includes('ESTABLISHED 1962'));
  assert.equal(doc.querySelectorAll('section').length, 7);
  for (const section of doc.querySelectorAll('section')) assert.ok(doc.getElementById(section.getAttribute('aria-labelledby')!));
  for (const img of doc.querySelectorAll('img')) {
    assert.ok(img.hasAttribute('alt'));
    if (!img.closest('[aria-hidden="true"]')) assert.ok(img.getAttribute('alt'));
    assert.ok(existsSync(`public${img.getAttribute('src')}`));
    assert.ok(img.hasAttribute('width') && img.hasAttribute('height'));
  }
  const allowed = new Set(['/about', '/industries', '/practices', '/people', '/insights', '/contact']);
  for (const link of doc.querySelectorAll('a')) {
    const href = link.getAttribute('href')!;
    assert.ok(allowed.has(href) || verifiedPublications.some(item => item.url === href) || (href.startsWith('#') && doc.getElementById(href.slice(1))), href);
    assert.ok(link.textContent.trim() || link.getAttribute('aria-label'));
    if (link.target === '_blank') assert.ok(link.rel.includes('noopener'));
  }
  assert.equal(doc.querySelectorAll('.practice-preview').length, 6);
  assert.equal(doc.querySelectorAll('.person-preview').length, 3);
  assert.equal(doc.querySelectorAll('.publication-card').length, 2);
});

test('featured services and industries use confirmed taxonomy, and publications stay historical', () => {
  assert.equal(featuredPractices.length, 6);
  for (const item of featuredPractices) assert.ok(practices.some(practice => practice.name === item.name));
  for (const item of featuredIndustries) assert.ok(industries.some(industry => industry.name === item));
  for (const item of verifiedPublications) { assert.equal(item.year, '2019'); assert.ok(item.source); }
  const text = home().document.body.textContent;
  assert.ok(text.includes('Archive publications reflect the law at the time of writing.'));
  assert.ok(text.includes('Profile previews. Full biographies are awaiting final approval.'));
  assert.ok(!text.includes('Latest news'));
});

test('People preview defaults to the central approval gate and never exposes drafts', () => {
  const render = (people: typeof managementPeople, mode?: 'management-preview') => renderToStaticMarkup(h(MemoryRouter, null, h(PeoplePreview, { people, mode })));
  assert.ok(!render(managementPeople).includes('person-preview__image'));
  assert.ok(render(managementPeople, 'management-preview').includes('person-preview__image'));
  const draft = { ...managementPeople[0], editorial: { ...managementPeople[0].editorial, status: 'draft' as const } };
  assert.ok(!render([draft], 'management-preview').includes('person-preview__image'));
  const incompleteApproval = { ...draft, editorial: { ...draft.editorial, status: 'approved' as const } };
  assert.ok(!render([incompleteApproval]).includes('person-preview__image'));
});

test('responsive CSS selects mobile, tablet and desktop compositions', () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const dom = home(width);
    const style = dom.document.createElement('style');
    style.textContent = readFileSync('src/styles/home.css', 'utf8');
    dom.document.head.append(style);
    const columns = (selector: string) => dom.getComputedStyle(dom.document.querySelector(selector)!).gridTemplateColumns;
    assert.equal(columns('.practice-preview-grid'), width < 480 ? '1fr' : width < 1024 ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))', `practice columns at ${width}`);
    assert.equal(columns('.publication-grid'), width < 768 ? '1fr' : '1fr 1fr', `publication columns at ${width}`);
    assert.equal(columns('.home-industry'), width < 768 ? '1fr' : '1fr 1fr', `industry columns at ${width}`);
    assert.equal(columns('.people-preview-grid'), width < 768 ? '1fr' : 'repeat(3, minmax(0, 1fr))', `people columns at ${width}`);
  }
});
