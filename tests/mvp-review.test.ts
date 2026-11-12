import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, useRoutes } from 'react-router-dom';
import { Window } from 'happy-dom';
import { createAppRoutes } from '../src/app/routes';
const routes = createAppRoutes('management-preview');
import { industries } from '../src/data/industries';
import { practices } from '../src/data/practices';
import { getVisibleLawyers } from '../src/lib/people';
import { getVisibleInsights } from '../src/lib/insights';
import { getRouteMetadata } from '../src/lib/route-metadata';
import { getRouteTitle } from '../src/lib/route-title';

const paths = ['/', '/about', '/industries', '/practices', '/people', '/insights', '/contact',
  ...industries.map(item => `/industries/${item.slug}`), ...practices.map(item => `/practices/${item.slug}`),
  ...getVisibleLawyers('management-preview').map(item => `/people/${item.slug}`),
  ...getVisibleInsights('management-preview').map(item => `/insights/${item.slug}`)];
function App() { return useRoutes(routes); }

test('all 53 MVP routes render landmarks, unique IDs, valid links, labels and local images', () => {
  assert.equal(paths.length, 53);
  const dom = new Window();
  try {
    for (const path of paths) {
      const doc = dom.document;
      doc.body.innerHTML = renderToStaticMarkup(h(MemoryRouter, { initialEntries: [path] }, h(App)));
      assert.equal(doc.querySelectorAll('h1').length, 1, path);
      assert.equal(doc.querySelectorAll('main').length, 1, path);
      const ids = [...doc.querySelectorAll('[id]')].map(node => node.id);
      assert.equal(new Set(ids).size, ids.length, `Duplicate IDs: ${path}`);
      for (const link of doc.querySelectorAll('a')) {
        const href = link.getAttribute('href') ?? '';
        assert.ok(href && href !== '#' && !href.startsWith('javascript:'), `${path}: empty/unsafe destination`);
        assert.ok(link.textContent.trim() || link.getAttribute('aria-label') || link.querySelector('img[alt]'), `${path}: unnamed link`);
        if (href.startsWith('/') && !href.startsWith('//')) {
          assert.notEqual(getRouteTitle(new URL(href, 'https://preview.invalid').pathname, 'management-preview'), 'Page not found', `${path}: ${href}`);
        } else if (href.startsWith('#')) assert.ok(doc.getElementById(href.slice(1)), `${path}: missing ${href}`);
      }
      for (const image of doc.querySelectorAll('img')) {
        assert.ok(image.hasAttribute('alt'), `${path}: missing alt`);
        assert.ok(Number(image.getAttribute('width')) > 0 && Number(image.getAttribute('height')) > 0, `${path}: missing image dimensions`);
        assert.ok(existsSync(`public${image.getAttribute('src')}`), `${path}: missing image`);
      }
      for (const control of doc.querySelectorAll('input, select, textarea')) {
        assert.ok(doc.querySelector(`label[for="${control.id}"]`) || control.getAttribute('aria-label'), `${path}: unlabelled control`);
      }
      const metadata = getRouteMetadata(path, 'management-preview');
      assert.ok(metadata.title.includes(getRouteTitle(path, 'management-preview')));
      assert.ok(metadata.description.length > 50 && metadata.description.length < 300);
    }
  } finally { dom.happyDOM.close(); }
});

function luminance(hex: string) {
  const rgb = hex.match(/[a-f\d]{2}/gi)!.map(value => parseInt(value, 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
test('shared small-text palette meets WCAG AA contrast on its intended backgrounds', () => {
  const css = readFileSync('src/styles/tokens.css', 'utf8');
  const color = (name: string) => css.match(new RegExp(`--color-${name}: (#[a-f\\d]{6})`))![1];
  for (const [foreground, background] of [['ink', 'paper'], ['muted', 'paper'], ['muted', 'surface'], ['accent', 'surface'], ['accent', 'paper'], ['gold', 'plum']]) {
    const values = [luminance(color(foreground)), luminance(color(background))].sort((a, b) => b - a);
    assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5, `${foreground} on ${background}`);
  }
});

test('route metadata normalises legacy URLs and handles missing content without publishing claims', () => {
  assert.deepEqual(getRouteMetadata('/industry/'), getRouteMetadata('/industries'));
  assert.match(getRouteMetadata('/people/missing').title, /Page not found/);
  assert.match(getRouteMetadata(`/practices/${practices[0].slug}`).description, /publication approval/);
});

test('reduced-motion CSS keeps reveal content visible and disables hero movement', () => {
  const dom = new Window({ settings: { device: { prefersReducedMotion: 'reduce' } } });
  try {
    const style = dom.document.createElement('style');
    style.textContent = readFileSync('src/styles/home.css', 'utf8');
    dom.document.head.append(style);
    dom.document.body.innerHTML = '<div class="reveal" data-reveal="pending">Readable content</div><div class="home-hero__content">Hero</div>';
    assert.ok(dom.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const reveal = dom.getComputedStyle(dom.document.querySelector('.reveal')!);
    assert.equal(reveal.opacity, '1');
    assert.equal(reveal.transform, 'none');
    assert.equal(dom.getComputedStyle(dom.document.querySelector('.home-hero__content')!).animation, 'none');
  } finally { dom.happyDOM.close(); }
});
