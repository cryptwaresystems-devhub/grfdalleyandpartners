import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { Window } from 'happy-dom';
const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4174';
if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(base).hostname)) throw new Error('QA_BASE_URL must be a local preview.');
const manifest = JSON.parse(await readFile('dist/prerender-manifest.json', 'utf8')) as { paths: string[] };
const pages: { path: string; status: number; result: string }[] = [];
const fragments = new Map<string, Set<string>>();
const internal: { from: string; path: string; hash: string }[] = [];
const assets = new Set<string>(); const external = new Set<string>();
const issues: string[] = [];
const dom = new Window({ settings: { disableJavaScriptFileLoading: true, disableIframePageLoading: true } });
try {
  for (const path of manifest.paths) {
    const response = await fetch(base + path, { signal: AbortSignal.timeout(8000) });
    dom.document.body.innerHTML = await response.text();
    const doc = dom.document;
    const ok = response.status === 200 && doc.querySelectorAll('h1').length === 1 && Boolean(doc.querySelector('main'));
    pages.push({ path, status: response.status, result: ok ? 'PASS' : 'FAIL' });
    if (!ok) issues.push(`Invalid page response: ${path}`);
    fragments.set(path, new Set([...doc.querySelectorAll('[id]')].map(node => node.id)));
    for (const anchor of doc.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href')!;
      if (/^(mailto:|tel:)/.test(href)) continue; // Never send email or dial a number.
      const target = new URL(href, base + path);
      if (target.origin === new URL(base).origin) internal.push({ from: path, path: target.pathname.replace(/\/+$/, '') || '/', hash: decodeURIComponent(target.hash.slice(1)) });
      else if (/^https?:$/.test(target.protocol)) external.add(target.href);
      else issues.push(`Unsafe link on ${path}`);
    }
    for (const node of doc.querySelectorAll('img[src],script[src],link[href]')) { const value = node.getAttribute('src') ?? node.getAttribute('href')!; if (value.startsWith('/assets/')) assets.add(value); }
    for (const source of doc.querySelectorAll('source[srcset]')) for (const item of source.getAttribute('srcset')!.split(',')) assets.add(item.trim().split(' ')[0]);
  }
} finally { dom.happyDOM.close(); }
for (const link of internal) {
  if (!fragments.has(link.path)) issues.push(`Missing destination ${link.path} from ${link.from}`);
  else if (link.hash && !fragments.get(link.path)!.has(link.hash)) issues.push(`Missing fragment ${link.path}#${link.hash} from ${link.from}`);
}
const assetResults = [];
for (const path of assets) { const response = await fetch(base + path, { method: 'HEAD', signal: AbortSignal.timeout(8000) }); const ok = response.status === 200 && !response.headers.get('content-type')?.includes('text/html'); assetResults.push({ path, status: response.status, result: ok ? 'PASS' : 'FAIL' }); if (!ok) issues.push(`Missing asset ${path}`); }
const errors = [];
for (const path of ['/qa-not-found', '/people/qa-not-found', '/assets/qa-missing.webp']) { const response = await fetch(base + path); errors.push({ path, status: response.status, result: response.status === 404 ? 'PASS' : 'FAIL' }); if (response.status !== 404) issues.push(`Soft 404: ${path}`); }
const redirect = await fetch(base + '/industry?qa=1', { redirect: 'manual' });
if (redirect.status !== 308 || redirect.headers.get('location') !== '/industries?qa=1') issues.push('Legacy redirect failed.');
const externalResults = [];
for (const url of external) {
  if (!process.argv.includes('--external')) { externalResults.push({ url, result: 'NOT TESTED', reason: 'External HTTP option not requested.' }); continue; }
  try { const response = await fetch(url, { signal: AbortSignal.timeout(8000), redirect: 'follow' }); await response.body?.cancel(); externalResults.push({ url, status: response.status, result: response.ok ? 'PASS' : [401, 403, 429, 999].includes(response.status) ? 'BLOCKED' : 'FAIL', scope: 'HTTP reachability only; no browser, content-rights or login validation.' }); }
  catch { externalResults.push({ url, result: 'NOT TESTED', reason: 'Network/timeout prevented an HTTP result; not evidence of a broken destination.' }); }
}
await mkdir('docs/qa', { recursive: true });
await writeFile('docs/qa/http-results.json', JSON.stringify({ testedAt: new Date().toISOString(), base, pages, internalLinkReferences: internal.length, assets: assetResults, errors, redirect: { status: redirect.status, location: redirect.headers.get('location') }, externalLinks: externalResults, issues, sentEmails: 0, bookingsMade: 0 }, null, 2) + '\n');
console.log(JSON.stringify({ pages: pages.length, internalLinkReferences: internal.length, assets: assets.size, localIssues: issues.length, external: externalResults }, null, 2));
if (issues.length || externalResults.some(result => result.result === 'FAIL')) process.exitCode = 1;
