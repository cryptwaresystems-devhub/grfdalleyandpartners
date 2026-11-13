import test from 'node:test';
import assert from 'node:assert/strict';
import { realRoutes, publishedRoutes, routeSeo, seoConfiguration, sitemap, robots, siteOrigin, assertProductionSeo } from '../src/lib/seo';
import { industries } from '../src/data/industries';
const publicConfig = { origin: 'https://firm.example.test', publicIndexing: true };
test('all real routes have unique titles/descriptions; missing privacy text stays out of sitemap', () => {
  assert.equal(realRoutes().length, 55); assert.equal(publishedRoutes().length, 54);
  const records = realRoutes().map(path => routeSeo(path, publicConfig));
  assert.equal(new Set(records.map(item => item.title)).size, 55);
  assert.equal(new Set(records.map(item => item.description)).size, 55);
  assert.ok(!publishedRoutes().includes('/privacy'));
});
test('canonical and social metadata use only a valid configured origin and normalize aliases', () => {
  for (const invalid of ['', 'http://example.test', 'https://user:secret@example.test', 'https://example.test/path', 'https://example.test/?query=x', 'https://example.test/#hash']) assert.equal(siteOrigin(invalid), null);
  assert.throws(() => assertProductionSeo({}), /VITE_SITE_URL/);
  assert.throws(() => assertProductionSeo({ VITE_SITE_URL: publicConfig.origin, VITE_CONTENT_MODE: 'management-preview' }), /management preview/);
  assert.doesNotThrow(() => assertProductionSeo({ VITE_SITE_URL: publicConfig.origin }));
  const page = routeSeo('/industry/', publicConfig);
  assert.equal(page.canonical, 'https://firm.example.test/industries');
  assert.equal(page.image, 'https://firm.example.test/assets/social-preview.png');
  assert.equal(routeSeo('/missing', publicConfig).canonical, null);
  assert.equal(routeSeo('/people', { origin: null, publicIndexing: false }).canonical, null);
});
test('indexing requires explicit opt-in, legal approval, valid origin and public content mode', () => {
  const env = { VITE_SITE_URL: publicConfig.origin, VITE_PUBLIC_INDEXING: 'true' };
  assert.equal(seoConfiguration(env).publicIndexing, false);
  assert.equal(seoConfiguration(env, true).publicIndexing, true);
  assert.equal(seoConfiguration({ ...env, VITE_CONTENT_MODE: 'management-preview' }, true).publicIndexing, false);
  assert.equal(seoConfiguration({ ...env, VITE_SITE_URL: '' }, true).publicIndexing, false);
  assert.equal(routeSeo('/privacy', publicConfig).robots, 'noindex,nofollow');
  assert.equal(routeSeo('/people', publicConfig, 'approved-only', true).robots, 'noindex,follow');
  assert.equal(routeSeo('/about', publicConfig, 'management-preview').robots, 'noindex,nofollow');
  assert.equal(routeSeo('/missing', publicConfig).robots, 'noindex,nofollow');
});
test('draft category text never becomes indexable just because the category label is confirmed', () => {
  const original = industries[0].editorial;
  try {
    industries[0].editorial = { status: 'draft', source: 'TEST FIXTURE' };
    assert.ok(realRoutes().includes(`/industries/${industries[0].slug}`));
    assert.ok(!publishedRoutes().includes(`/industries/${industries[0].slug}`));
    assert.equal(routeSeo(`/industries/${industries[0].slug}`, publicConfig).robots, 'noindex,nofollow');
  } finally { industries[0].editorial = original; }
});
test('sitemap covers every published route exactly once, without filters, aliases or invented lastmod dates', () => {
  const xml = sitemap(publicConfig);
  assert.equal((xml.match(/<loc>/g) ?? []).length, publishedRoutes().length);
  for (const path of publishedRoutes()) assert.ok(xml.includes(`<loc>${publicConfig.origin}${path}</loc>`));
  assert.ok(!xml.includes('lastmod')); assert.ok(!xml.includes('/privacy')); assert.ok([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].every(match => !match[1].includes('?')));
  assert.equal((sitemap({ origin: null, publicIndexing: false }).match(/<loc>/g) ?? []).length, 0);
  assert.equal(robots({ ...publicConfig, publicIndexing: false }), 'User-agent: *\nDisallow: /\n');
  assert.ok(robots(publicConfig).includes('Sitemap: https://firm.example.test/sitemap.xml'));
});
test('structured data only asserts sourced firm facts and excludes uncertain offices and claims', () => {
  const data = routeSeo('/people', publicConfig).structuredData!;
  const text = JSON.stringify(data);
  assert.ok(text.includes('Organization')); assert.ok(text.includes('1962')); assert.ok(text.includes('26 Igbosere Road')); assert.ok(text.includes('13 Finima Street'));
  for (const uncertain of ['Abuja', 'telephone', 'aggregateRating', 'review', 'award']) assert.ok(!text.includes(uncertain));
  assert.ok(text.includes('BreadcrumbList')); assert.equal(routeSeo('/missing', publicConfig).structuredData, null);
});
