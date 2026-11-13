import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { Window } from 'happy-dom';
import { CONSENT_LIFETIME, CONSENT_VERSION, parseConsent, saveConsent } from '../src/lib/consent';
import { createAnalyticsClient, registerAnalytics, type AnalyticsConfiguration } from '../src/lib/analytics';
import { assertProductionPrivacy, isPrivacyPolicyApproved, productionPrivacyIssues } from '../src/lib/privacy';
import { privacyPolicy, type PrivacyPolicy } from '../src/data/privacy';
import { PrivacyPage } from '../src/pages/PrivacyPage';
const config: AnalyticsConfiguration = { measurementId: 'G-TEST123456', approvedPolicy: true, approvedNotice: true, manualPageViewsConfirmed: true };
function analyticsFixture(overrides: Partial<AnalyticsConfiguration> = {}) {
  const dom = new Window({ url: 'https://firm.example.test/contact?email=private@example.test#private', settings: { disableJavaScriptFileLoading: true, disableIframePageLoading: true } });
  const win = dom as unknown as globalThis.Window;
  const doc = dom.document as unknown as Document;
  const append = doc.head.append.bind(doc.head);
  doc.head.append = (...nodes) => { for (const node of nodes) if (typeof node !== 'string' && node.nodeName === 'SCRIPT') (node as HTMLScriptElement).type = 'application/x-test-fixture'; append(...nodes); };
  const client = createAnalyticsClient({ ...config, ...overrides }, win, doc);
  const commands = () => (win.dataLayer ?? []).map(value => Array.from(value as ArrayLike<unknown>));
  const load = () => doc.querySelector<HTMLScriptElement>('script[data-grf-analytics]')!.dispatchEvent(new dom.Event('load') as unknown as Event);
  return { dom, win, doc, client, commands, load };
}
test('consent parsing fails closed for missing, corrupt, expired, future and incompatible records', () => {
  const now = Date.now();
  const valid = { version: CONSENT_VERSION, savedAt: now, analytics: false, media: true };
  assert.deepEqual(parseConsent(JSON.stringify(valid), now), valid);
  for (const value of [null, '{broken', '{}', JSON.stringify({ ...valid, version: 999 }), JSON.stringify({ ...valid, analytics: 'true' }), JSON.stringify({ ...valid, savedAt: now + 1 }), JSON.stringify({ ...valid, savedAt: now - CONSENT_LIFETIME })]) assert.equal(parseConsent(value, now), null);
  let saved = ''; saveConsent({ setItem: (_key, value) => { saved = value; } }, { analytics: false, media: false }, now);
  assert.deepEqual(Object.keys(JSON.parse(saved)).sort(), ['analytics', 'media', 'savedAt', 'version']);
});
test('declining consent creates no Google script, queue or analytics events', () => {
  const f = analyticsFixture();
  try {
    f.client.setConsent(false); f.client.pageView('/contact', 'Contact');
    assert.equal(f.doc.querySelector('script'), null); assert.deepEqual(f.commands(), []);
    assert.equal((f.win as unknown as Record<string, unknown>)['ga-disable-G-TEST123456'], true);
  } finally { f.dom.happyDOM.close(); }
});
test('GA4 fails closed without valid ID, policy/notice approval or manual-pageview confirmation', () => {
  for (const overrides of [{ measurementId: '' }, { measurementId: 'G-invalid<script>' }, { approvedPolicy: false }, { approvedNotice: false }, { manualPageViewsConfirmed: false }]) {
    const f = analyticsFixture(overrides);
    try { f.client.setConsent(true); f.client.pageView('/', 'Home'); assert.equal(f.doc.querySelector('script'), null); assert.deepEqual(f.commands(), []); } finally { f.dom.happyDOM.close(); }
  }
});
test('consented pageviews queue until load and deduplicate repeated renders while allowing return visits', () => {
  const f = analyticsFixture();
  try {
    f.client.setConsent(true); f.client.setConsent(true);
    f.client.pageView('/people', 'People'); f.client.pageView('/people', 'People'); f.client.pageView('/contact', 'Contact');
    assert.equal(f.doc.querySelectorAll('script[data-grf-analytics]').length, 1);
    assert.equal(f.commands().filter(command => command[0] === 'event').length, 0);
    f.load();
    const settings = f.commands().find(command => command[0] === 'config')![2] as Record<string, unknown>;
    assert.equal(settings.send_page_view, false); assert.equal(settings.allow_google_signals, false);
    f.client.pageView('/contact', 'Contact'); f.client.pageView('/people', 'People');
    const views = f.commands().filter(command => command[0] === 'event'); assert.equal(views.length, 3);
    assert.deepEqual(views.map(command => (command[2] as Record<string, unknown>).page_location), ['https://firm.example.test/people', 'https://firm.example.test/contact', 'https://firm.example.test/people']);
    assert.ok(!JSON.stringify(f.commands()).includes('private@example.test')); assert.ok(!JSON.stringify(f.commands()).includes('#private'));
  } finally { f.dom.happyDOM.close(); }
});
test('withdrawing before load discards pending events and ignores a late script response', () => {
  const f = analyticsFixture();
  try {
    f.client.setConsent(true); f.client.pageView('/contact', 'Contact');
    const script = f.doc.querySelector<HTMLScriptElement>('script')!;
    f.client.setConsent(false); script.dispatchEvent(new f.dom.Event('load') as unknown as Event);
    assert.equal(f.doc.querySelector('script'), null); assert.deepEqual(f.commands(), []);
  } finally { f.dom.happyDOM.close(); }
});
test('withdrawal stops new events, clears GA cookies and regrant does not repeat configuration', () => {
  const f = analyticsFixture();
  try {
    f.client.setConsent(true); f.client.pageView('/', 'Home'); f.load();
    f.doc.cookie = '_ga=test; Path=/'; f.doc.cookie = '_ga_TEST123456=test; Path=/'; f.doc.cookie = 'essential=test; Path=/';
    const before = f.commands().length; f.client.setConsent(false); f.client.pageView('/contact', 'Contact');
    assert.equal(f.commands().length, before); assert.ok(!f.doc.cookie.includes('_ga')); assert.ok(f.doc.cookie.includes('essential'));
    f.client.setConsent(true); f.client.pageView('/contact', 'Contact');
    assert.equal(f.commands().filter(command => command[0] === 'config').length, 1);
    assert.equal(f.commands().filter(command => command[0] === 'event').length, 2);
  } finally { f.dom.happyDOM.close(); }
});
test('blocked GA script does not produce a success event', () => {
  const f = analyticsFixture();
  try { f.client.setConsent(true); f.client.pageView('/', 'Home'); f.doc.querySelector('script')!.dispatchEvent(new f.dom.Event('error') as unknown as Event); assert.equal(f.doc.querySelector('script'), null); assert.equal(f.commands().filter(command => command[0] === 'event').length, 0); } finally { f.dom.happyDOM.close(); }
});
test('StrictMode-style re-registration does not repeat script or pageview', async () => {
  const f = analyticsFixture();
  try {
    const unregister = registerAnalytics(f.client); f.client.setConsent(true); f.client.pageView('/', 'Home'); f.load(); unregister();
    const finalCleanup = registerAnalytics(f.client); await Promise.resolve(); f.client.setConsent(true); f.client.pageView('/', 'Home');
    assert.equal(f.commands().filter(command => command[0] === 'event').length, 1);
    finalCleanup(); await Promise.resolve();
  } finally { f.dom.happyDOM.close(); }
});
const approved: PrivacyPolicy = { status: 'approved', source: 'TEST LEGAL FIXTURE ONLY', approvedBy: 'Test reviewer', approvedAt: '2026-01-01', effectiveDate: '2026-01-02', sections: [{ heading: 'Fixture heading', paragraphs: ['TEST APPROVED LEGAL TEXT'] }] };
const notice = { status: 'approved' as const, source: 'TEST FIXTURE', approvedBy: 'Test reviewer', approvedAt: '2026-01-01' };
test('missing, draft and incomplete legal records block launch; requester authorization cannot replace legal approval', () => {
  assert.equal(isPrivacyPolicyApproved(), false); assert.throws(() => assertProductionPrivacy(), /Production launch blocked/);
  for (const policy of [{ ...approved, status: 'draft' as const }, { ...approved, approvedBy: '' }, { ...approved, approvedAt: '2099-01-01' }, { ...approved, effectiveDate: '2026-02-30' }, { ...approved, sections: [] }]) assert.equal(isPrivacyPolicyApproved(policy), false);
  assert.deepEqual(productionPrivacyIssues(approved, notice), []); assert.doesNotThrow(() => assertProductionPrivacy(approved, notice));
});
test('Privacy page suppresses unapproved legal text and renders approved plain text safely', () => {
  const render = (policy: PrivacyPolicy) => renderToStaticMarkup(h(MemoryRouter, null, h(PrivacyPage, { policy })));
  assert.ok(render(privacyPolicy).includes('not a Privacy Policy'));
  assert.ok(!render({ ...approved, status: 'draft' }).includes('TEST APPROVED LEGAL TEXT'));
  const html = render({ ...approved, sections: [{ heading: 'Fixture', paragraphs: ['<script>fixture</script>'] }] });
  assert.ok(html.includes('&lt;script&gt;')); assert.ok(!html.includes('<script>fixture'));
});
