import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../src/pages/HomePage';
import { SectionPage } from '../src/pages/SectionPage';
import { navigation } from '../src/data/navigation';
test('home exposes all prepared section paths', () => {
 const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(HomePage)));
 for (const item of navigation.slice(1)) assert.ok(html.includes(`href="${item.path}"`));
});
test('generic pending template remains reusable for future content', () => {
 for (const item of navigation.filter(item => ['/people', '/insights', '/contact'].includes(item.path))) {
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SectionPage, { title: item.label })));
  assert.ok(html.includes(item.label)); assert.ok(html.includes('once reviewed and approved'));
 }
});
