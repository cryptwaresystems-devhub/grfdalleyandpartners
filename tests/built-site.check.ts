import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { Window } from 'happy-dom';
import { imageVariants } from '../src/data/image-variants';
const manifest = JSON.parse(readFileSync('dist/prerender-manifest.json', 'utf8')) as { paths: string[]; indexing: boolean; origin: string | null };
test('built HTML provides route-specific content and SEO before JavaScript executes', () => {
  const dom = new Window({ settings: { disableJavaScriptFileLoading: true, disableIframePageLoading: true } });
  try {
    for (const path of [...manifest.paths, '/404']) {
      const html = readFileSync(path === '/' ? 'dist/index.html' : `dist${path}.html`, 'utf8');
      dom.document.write(html);
      const doc = dom.document;
      assert.equal(doc.querySelectorAll('h1').length, 1, path);
      assert.ok((doc.querySelector('main')?.textContent.length ?? 0) > 40, path);
      assert.equal(doc.querySelectorAll('meta[name="description"]').length, 1, path);
      assert.equal(doc.querySelectorAll('title').length, 1, path);
      assert.ok(doc.querySelector('meta[property="og:title"]'), path);
      assert.ok(doc.querySelector('meta[name="twitter:card"]'), path);
      if (!manifest.indexing || path === '/404') assert.equal(doc.querySelector('meta[name="robots"]')?.getAttribute('content'), 'noindex,nofollow', path);
      assert.equal(doc.querySelectorAll('script[src*="google"]').length, 0, path);
      let level = 0;
      for (const heading of doc.querySelectorAll('h1,h2,h3,h4,h5,h6')) { const next = Number(heading.tagName.slice(1)); assert.ok(next <= level + 1, `${path}: skipped h${level} to h${next}`); level = next; }
      for (const source of doc.querySelectorAll('source[srcset]')) for (const entry of source.getAttribute('srcset')!.split(',')) assert.ok(existsSync(`public${entry.trim().split(' ')[0]}`), path);
      doc.open(); doc.close();
    }
  } finally { dom.happyDOM.close(); }
});
test('responsive image variants have real dimensions and smaller card-sized alternatives', () => {
  assert.equal(Object.keys(imageVariants).length, 11);
  for (const [original, variant] of Object.entries(imageVariants)) {
    assert.ok(variant.width > 0 && variant.height > 0);
    assert.ok(existsSync(`public${original}`));
    assert.ok(variant.srcSet.includes('w'));
  }
  assert.ok(existsSync('dist/404.html')); assert.ok(existsSync('dist/robots.txt')); assert.ok(existsSync('dist/sitemap.xml')); assert.ok(existsSync('public/assets/social-preview.png'));
});
