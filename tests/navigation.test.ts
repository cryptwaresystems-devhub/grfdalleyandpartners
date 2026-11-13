import { after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

const dom = new Window({ url: 'http://localhost:5173', settings: { disableIframePageLoading: true } });
for (const key of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'PointerEvent', 'navigator'] as const) {
  Object.defineProperty(globalThis, key, { configurable: true, value: key === 'window' ? dom : dom[key] });
}
Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
  requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(0), 0),
});
const { createElement: h, act } = await import('react');
const { createRoot, hydrateRoot } = await import('react-dom/client');
const { MemoryRouter, Routes, Route, createMemoryRouter, createBrowserRouter, RouterProvider, Outlet } = await import('react-router-dom');
const { SiteHeader } = await import('../src/components/SiteHeader');
const { SiteFooter } = await import('../src/components/SiteFooter');
const { RouteEffects } = await import('../src/components/RouteEffects');
const { navigation } = await import('../src/data/navigation');
const { createAppRoutes } = await import('../src/app/routes');
const appRoutes = createAppRoutes('management-preview');
const { PresentationProvider } = await import('../src/lib/presentation');
const { industries } = await import('../src/data/industries');
const { practices } = await import('../src/data/practices');
const { lawyers } = await import('../src/data/lawyers');
const { insights } = await import('../src/data/insights');
const { InsightsPage } = await import('../src/pages/InsightsPage');
const { CookieConsentProvider, useCookieConsent } = await import('../src/components/privacy/CookieConsent');
const { ApprovedVideo } = await import('../src/components/insights/ApprovedVideo');
const { getRouteMetadata } = await import('../src/lib/route-metadata');
let root: ReturnType<typeof createRoot> | undefined;

async function mount() {
  dom.happyDOM.setWindowSize({ width: 1440, height: 900 });
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  await act(async () => root!.render(h(MemoryRouter, null,
    h(PresentationProvider, { mode: 'management-preview' }, h(RouteEffects)), h(SiteHeader), h(Routes, null, ...navigation.map(item => h(Route, { key: item.path, path: item.path, element: h('main', { id: 'main-content', tabIndex: -1, 'data-page': item.path }, item.label) }))), h(SiteFooter),
  )));
}
function required<T extends Element>(selector: string): T {
  const node = document.querySelector<T>(selector);
  assert.ok(node, `Missing ${selector}`);
  return node;
}
async function click(node: Element) { await act(async () => { node.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); }); }
async function escape() { await act(async () => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); }); }
afterEach(async () => { if (root) await act(async () => root!.unmount()); root = undefined; window.localStorage.clear(); });
after(() => dom.happyDOM.close());

async function selectValue(id: string, value: string) {
  const node = required<HTMLSelectElement>(`#${id}`);
  await act(async () => { node.value = value; node.dispatchEvent(new Event('change', { bubbles: true })); });
}
async function searchValue(id: string, value: string) {
  const node = required<HTMLInputElement>(`#${id}`);
  const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
  await act(async () => { setValue.call(node, value); node.dispatchEvent(new Event('input', { bubbles: true })); });
}

test('all desktop primary links navigate and expose the active page', async () => {
  await mount();
  for (const item of navigation) {
    const link = required<HTMLAnchorElement>(`.desktop-navigation .nav-link[href="${item.path}"]`);
    await click(link);
    assert.equal(required('main').getAttribute('data-page'), item.path);
    const metadata = getRouteMetadata(item.path, 'management-preview');
    assert.equal(document.title, metadata.title);
    assert.equal(required<HTMLMetaElement>('meta[name="description"]').content, metadata.description);
    assert.equal(required<HTMLMetaElement>('meta[property="og:title"]').content, metadata.title);
    assert.equal(document.querySelectorAll('meta[name="description"]').length, 1);
    assert.equal(required(`.desktop-navigation .nav-link[href="${item.path}"]`).getAttribute('aria-current'), 'page', `Active state for ${item.path}`);
  }
});

test('About disclosure supports click, Escape, Arrow Down, focus exit and outside click', async () => {
  await mount();
  const toggle = required<HTMLButtonElement>('[aria-controls="about-submenu"]');
  const panel = required<HTMLDivElement>('#about-submenu');
  assert.equal(panel.hidden, true);
  await click(toggle);
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(panel.hidden, false);
  await escape();
  assert.equal(panel.hidden, true);
  assert.equal(document.activeElement, toggle);
  await act(async () => {
    toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 10));
  });
  assert.equal(document.activeElement, panel.querySelector('a'));
  await act(async () => required<HTMLAnchorElement>('.desktop-navigation a[href="/industries"]').focus());
  assert.equal(panel.hidden, true);
  await click(toggle);
  await act(async () => document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  assert.equal(panel.hidden, true);
});

test('About submenu links navigate and close the disclosure', async () => {
  await mount();
  for (const to of ['/about', '/people', '/contact#offices']) {
    await click(required('[aria-controls="about-submenu"]'));
    await click(required(`#about-submenu a[href="${to}"]`));
    assert.equal(required('main').getAttribute('data-page'), to.split('#')[0]);
    assert.equal(required<HTMLDivElement>('#about-submenu').hidden, true);
  }
});

test('mobile disclosure moves focus, navigates every route, and returns focus on Escape', async () => {
  await mount();
  const toggle = required<HTMLButtonElement>('[aria-controls="mobile-navigation"]');
  const panel = required<HTMLDivElement>('#mobile-navigation');
  for (const item of navigation) {
    await click(toggle);
    assert.equal(panel.hidden, false);
    assert.equal(document.activeElement, panel.querySelector('a'));
    await click(required(`#mobile-navigation nav a[href="${item.path}"]`));
    assert.equal(required('main').getAttribute('data-page'), item.path);
    assert.equal(panel.hidden, true);
    assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  }
  await click(toggle);
  await escape();
  assert.equal(panel.hidden, true);
  assert.equal(document.activeElement, toggle);
  await click(toggle);
  await click(toggle);
  assert.equal(panel.hidden, true);
});

test('mobile menu closes when focus leaves or desktop breakpoint changes', async () => {
  await mount();
  dom.happyDOM.setWindowSize({ width: 390, height: 844 });
  const panel = required<HTMLDivElement>('#mobile-navigation');
  await click(required('[aria-controls="mobile-navigation"]'));
  await act(async () => required<HTMLAnchorElement>('.footer-email').focus());
  assert.equal(panel.hidden, true);
  await click(required('[aria-controls="mobile-navigation"]'));
  await act(async () => dom.happyDOM.setWindowSize({ width: 1440, height: 900 }));
  assert.equal(panel.hidden, true);
});

test('all conversation CTAs and footer navigation reach their destinations', async () => {
  await mount();
  const ctas = document.querySelectorAll<HTMLAnchorElement>('a.button');
  assert.equal(ctas.length, 3);
  for (const cta of ctas) { await click(cta); assert.equal(required('main').getAttribute('data-page'), '/contact'); }
  for (const item of navigation) {
    await click(required(`nav[aria-label="Footer navigation"] a[href="${item.path}"]`));
    assert.equal(required('main').getAttribute('data-page'), item.path);
  }
  assert.equal(required('.footer-email').getAttribute('href'), 'mailto:inq@grfdalleyandpartners.com');
  assert.equal(required('.footer-phone').getAttribute('href'), 'tel:+23414549824');
  assert.ok(required('.footer-approval').textContent?.includes('reconfirmation'));
  assert.ok(required('.office-pending').textContent?.includes('pending confirmation'));
  assert.equal(required('.back-to-top').getAttribute('href'), '#top');
});

test('office deep link moves focus to the office details', async () => {
  await mount();
  await click(required('[aria-controls="about-submenu"]'));
  await click(required('#about-submenu a[href="/contact#offices"]'));
  assert.equal(document.activeElement, required('#offices'));
  assert.equal(document.title, 'Contact | G.R.F. Dalley & Partners');
});

test('real app routes render About, both directories and all 36 category detail pages', async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/about'] });
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    assert.ok(required('.about-history'));
    for (const [base, records] of [['/industries', industries], ['/practices', practices]] as const) {
      await act(async () => { await router.navigate(base); });
      assert.equal(document.querySelectorAll('.expertise-card').length, records.length);
      await click(required(`.expertise-card[href="${base}/${records[0].slug}"]`));
      assert.equal(required('main h1').textContent, records[0].name);
      for (const record of records) {
        await act(async () => { await router.navigate(`${base}/${record.slug}`); });
        assert.equal(required('main h1').textContent, record.name);
        assert.ok(required('.detail-summary'));
        assert.equal(document.querySelectorAll('.content-pending').length, 0);
        assert.equal(document.title, `${record.name} | G.R.F. Dalley & Partners`);
        assert.equal(required(`.desktop-navigation .nav-link[href="${base}"]`).getAttribute('aria-current'), 'page');
        assert.equal(required('nav[aria-label="Breadcrumb"] [aria-current="page"]').textContent, record.name);
      }
    }
    await act(async () => { await router.navigate('/industries/not-a-confirmed-category'); });
    assert.equal(required('main h1').textContent, 'Page not found');
    assert.equal(document.title, 'Page not found | G.R.F. Dalley & Partners');
  } finally { router.dispose(); }
});

test('legacy singular URLs redirect and preserve query strings and section anchors', async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/industry'] });
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    assert.equal(router.state.location.pathname, '/industries');
    for (const [oldBase, newBase, record] of [['/industry', '/industries', industries[0]], ['/practice', '/practices', practices[0]]] as const) {
      await act(async () => { await router.navigate(`${oldBase}/${record.slug}?from=legacy#overview`); });
      assert.equal(router.state.location.pathname, `${newBase}/${record.slug}`);
      assert.equal(router.state.location.search, '?from=legacy');
      assert.equal(router.state.location.hash, '#overview');
      assert.equal(document.activeElement, document.getElementById('overview'));
      await act(async () => { await router.navigate(oldBase); });
      assert.equal(router.state.location.pathname, newBase);
    }
  } finally { router.dispose(); }
});

test('People directory searches, clears empty results and links to all eight real profile routes', async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/people'] });
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    assert.equal(document.querySelectorAll('.directory-person').length, 8);
    const input = required<HTMLInputElement>('#people-search');
    const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
    await act(async () => { setValue.call(input, 'Faith'); input.dispatchEvent(new Event('input', { bubbles: true })); });
    assert.equal(document.querySelectorAll('.directory-person').length, 1);
    await click(required('.directory-person__link'));
    assert.equal(required('main h1').textContent, 'Faith Izegboya Adebo');
    await act(async () => { await router.navigate('/people'); });
    const search = required<HTMLInputElement>('#people-search');
    await act(async () => { setValue.call(search, 'no matching professional'); search.dispatchEvent(new Event('input', { bubbles: true })); });
    assert.ok(required('.listing-empty'));
    await click(required('.listing-empty button'));
    assert.equal(document.querySelectorAll('.directory-person').length, 8);
    for (const person of lawyers) {
      await click(required(`a[href="/people/${person.slug}"]`));
      assert.equal(required('main h1').textContent, person.name);
      assert.equal(document.title, `${person.name} | G.R.F. Dalley & Partners`);
      assert.ok(required('.lawyer-profile-portrait'));
      await act(async () => { await router.navigate('/people'); });
    }
    await act(async () => { await router.navigate('/people/unknown-person'); });
    assert.equal(required('main h1').textContent, 'Page not found');
  } finally { router.dispose(); }
});

test('Insights filters show honest empty categories and archive detail/author routes work', async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/insights'] });
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    const buttons = document.querySelectorAll<HTMLButtonElement>('.insight-category-filters button');
    for (let index = 0; index < buttons.length; index++) {
      await click(buttons[index]);
      assert.equal(buttons[index].getAttribute('aria-pressed'), 'true');
      assert.equal(document.querySelectorAll('.insight-list-card').length, [0, 3].includes(index) ? 3 : 0);
    }
    await click(required('.listing-empty button'));
    assert.equal(document.querySelectorAll('.insight-list-card').length, 3);
    for (const insight of insights) {
      await click(required(`.insight-list-card h2 a[href="/insights/${insight.slug}"]`));
      assert.equal(required('main h1').textContent, insight.name);
      assert.equal(document.title, `${insight.name} | G.R.F. Dalley & Partners`);
      assert.ok(required(`main a[href="${insight.externalUrl}"]`));
      await click(required('.insight-detail-aside a[href^="/people/"]'));
      assert.equal(required('main h1').textContent, lawyers[1].name);
      await act(async () => { await router.navigate('/insights'); });
    }
    await act(async () => { await router.navigate('/insights/unknown-publication'); });
    assert.equal(required('main h1').textContent, 'Page not found');
  } finally { router.dispose(); }
});

test('Contact validates inputs and prepares an editable email draft without claiming delivery', async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/contact#offices'] });
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    assert.equal(document.querySelectorAll('#offices').length, 1);
    assert.equal(document.activeElement, document.getElementById('offices'));
    const form = required<HTMLFormElement>('.enquiry-form');
    await act(async () => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    assert.equal(document.querySelector('.email-draft-result'), null);
    const setInput = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
    const setTextarea = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')!.set!;
    async function input(id: string, value: string) { await act(async () => { const field = required<HTMLInputElement>(`#${id}`); setInput.call(field, value); field.dispatchEvent(new Event('input', { bubbles: true })); }); }
    await input('enquiry-name', 'MVP Tester'); await input('enquiry-email', 'not-an-email');
    await act(async () => { const field = required<HTMLSelectElement>('#enquiry-nature'); field.value = 'General enquiry'; field.dispatchEvent(new Event('change', { bubbles: true })); const message = required<HTMLTextAreaElement>('#enquiry-message'); setTextarea.call(message, 'Please contact me.'); message.dispatchEvent(new Event('input', { bubbles: true })); });
    await act(async () => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    assert.equal(document.querySelector('.email-draft-result'), null);
    await input('enquiry-email', 'tester@example.com');
    await act(async () => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    assert.ok(required('.email-draft-result').textContent?.includes('Nothing has been sent'));
    const href = required('.email-draft-result a').getAttribute('href')!;
    assert.ok(href.startsWith('mailto:inq@grfdalleyandpartners.com?'));
    assert.ok(new URLSearchParams(href.split('?')[1]).get('body')?.includes('MVP Tester'));
    await input('enquiry-name', 'Edited draft');
    assert.equal(document.querySelector('.email-draft-result'), null);
    await click(required('.form-clear'));
    assert.equal(required<HTMLInputElement>('#enquiry-name').value, '');
    assert.ok(required('.booking-pending').textContent?.includes('forthcoming'));
    assert.equal(document.querySelector('iframe'), null);
  } finally { router.dispose(); }
});

test('People URL search and practice filters combine, survive profile navigation and clear together', async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/people?q=Faith&practice=corporate-and-commercial'] });
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    assert.equal(document.querySelectorAll('.directory-person').length, 1);
    assert.equal(required<HTMLSelectElement>('#people-practice').value, 'corporate-and-commercial');
    await click(required('.directory-person__link'));
    assert.equal(required('main h1').textContent, 'Faith Izegboya Adebo');
    await act(async () => { await router.navigate(-1); });
    assert.equal(required<HTMLInputElement>('#people-search').value, 'Faith');
    assert.equal(document.querySelectorAll('.directory-person').length, 1);
    await selectValue('people-practice', 'arbitration-mediation');
    assert.equal(document.querySelectorAll('.directory-person').length, 0);
    assert.ok(required('.listing-empty'));
    await click(required('.listing-empty button'));
    assert.equal(document.querySelectorAll('.directory-person').length, 8);
    assert.equal(required<HTMLSelectElement>('#people-practice').value, 'all');
    assert.equal(router.state.location.search, '');
    await act(async () => { await router.navigate('/people?practice=unavailable'); });
    assert.equal(document.querySelectorAll('.directory-person').length, 0);
    assert.equal(required<HTMLSelectElement>('#people-practice').value, 'unavailable');
  } finally { router.dispose(); }
});

test('Insights URL filters combine author, practice, industry and search and reset honest empty states', async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/insights?industry=aviation-and-airlines'] });
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    assert.equal(document.querySelectorAll('.insight-list-card').length, 1);
    assert.ok(required('.insight-list-card h2').textContent?.includes('Warsaw Convention'));
    await selectValue('insights-author', lawyers[1].id);
    await searchValue('insights-search', '2006 Dalley');
    assert.equal(document.querySelectorAll('.insight-list-card').length, 1);
    assert.ok(router.state.location.search.includes('q=2006'));
    await selectValue('insights-practice', 'arbitration-mediation');
    assert.equal(document.querySelectorAll('.insight-list-card').length, 0);
    await click(required('.listing-empty button'));
    assert.equal(document.querySelectorAll('.insight-list-card').length, 3);
    assert.equal(required<HTMLInputElement>('#insights-search').value, '');
    assert.equal(required<HTMLSelectElement>('#insights-industry').value, 'all');
    const events = [...document.querySelectorAll('.insight-category-filters button')].find(button => button.textContent === 'Events')!;
    await click(events);
    assert.equal(document.querySelectorAll('.insight-list-card').length, 0);
    assert.equal(document.querySelectorAll('iframe').length, 0);
    await click(required('.listing-empty button'));
    assert.equal(document.querySelectorAll('.insight-list-card').length, 3);
    await act(async () => { await router.navigate('/insights?author=unavailable'); });
    assert.equal(document.querySelectorAll('.insight-list-card').length, 0);
    assert.equal(required<HTMLSelectElement>('#insights-author').value, 'unavailable');
  } finally { router.dispose(); }
});

test('Insights pagination browses real records and changing filters resets the page and focus', async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter([{ path: '/insights', element: h(InsightsPage, { pageSize: 1 }) }], { initialEntries: ['/insights?page=2'] });
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    assert.equal(document.querySelectorAll('.insight-list-card').length, 1);
    assert.ok(required('.insight-list-card h2').textContent?.includes('Continental free trade'));
    assert.ok(required('.listing-pagination').textContent?.includes('Page 2 of 3'));
    await click(required('.listing-pagination button:last-child'));
    assert.ok(required('.insight-list-card h2').textContent?.includes('Warsaw Convention'));
    assert.equal(required<HTMLButtonElement>('.listing-pagination button:last-child').disabled, true);
    assert.equal(document.activeElement?.id, 'insights-results-status');
    await click(required('.listing-pagination button:first-child'));
    assert.ok(required('.listing-pagination').textContent?.includes('Page 2 of 3'));
    await selectValue('insights-practice', 'arbitration-mediation');
    assert.ok(required('.insight-list-card h2').textContent?.includes('Non-Interventionist'));
    assert.equal(document.querySelector('.listing-pagination'), null);
    assert.equal(new URLSearchParams(router.state.location.search).has('page'), false);
    await click(required('.directory-reset'));
    assert.ok(required('.listing-pagination').textContent?.includes('Page 1 of 3'));
    await act(async () => { await router.navigate('/insights?page=999'); });
    assert.ok(required('.listing-pagination').textContent?.includes('Page 3 of 3'));
  } finally { router.dispose(); }
});

test('approved video loads an allowlisted iframe only after a click and disappears when permission is withdrawn', async () => {
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  const editorial = { status: 'approved' as const, source: 'TEST FIXTURE ONLY', approvedBy: 'Test reviewer', approvedAt: '2026-11-01', publishedAt: '2026-11-02' };
  const video = { provider: 'youtube' as const, id: 'TESTvideo01', title: 'TEST VIDEO FIXTURE', editorial };
  window.localStorage.setItem('grf-cookie-preferences', JSON.stringify({ version: 1, savedAt: Date.now(), analytics: false, media: true }));
  await act(async () => root!.render(h(MemoryRouter, null, h(CookieConsentProvider, null, h(ApprovedVideo, { insight: { ...insights[0], video } })))));
  assert.equal(document.querySelector('iframe'), null);
  await click(required('.insight-video button'));
  const iframe = required<HTMLIFrameElement>('iframe');
  assert.equal(iframe.getAttribute('src'), 'https://www.youtube-nocookie.com/embed/TESTvideo01');
  assert.equal(iframe.title, 'TEST VIDEO FIXTURE');
  assert.equal(iframe.getAttribute('loading'), 'lazy');
  await act(async () => root!.render(h(MemoryRouter, null, h(CookieConsentProvider, null, h(ApprovedVideo, { insight: { ...insights[0], video: { ...video, editorial: { status: 'draft', source: 'TEST FIXTURE' } } } })))));
  assert.equal(document.querySelector('iframe'), null);
  assert.equal(document.querySelector('.insight-video'), null);
});


test('configured contact validates, requires spam verification, prevents duplicates and reports provider acceptance honestly', async () => {
  const originalFetch = globalThis.fetch;
  let tokenCallback: ((token: string) => void) | undefined;
  window.turnstile = { render: (_element, options) => { tokenCallback = (options as { callback: (token: string) => void }).callback; return 'fixture-widget'; }, remove: () => {} };
  let requests = 0;
  let complete: ((response: Response) => void) | undefined;
  globalThis.fetch = async (_url, options) => {
    if (options?.method === 'POST') { requests++; return new Promise<Response>(resolve => { complete = resolve; }); }
    return new Response(JSON.stringify({ deliveryConfigured: true, turnstileSiteKey: 'fixture', bookingUrl: null }), { status: 200 });
  };
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/contact'] });
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    const form = required<HTMLFormElement>('.enquiry-form');
    const submit = () => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await act(async () => { submit(); });
    assert.equal(required('#enquiry-name').getAttribute('aria-invalid'), 'true');
    await searchValue('enquiry-name', 'Contact Tester');
    await searchValue('enquiry-email', 'tester@example.test');
    await selectValue('enquiry-nature', 'General enquiry');
    await act(async () => { submit(); });
    assert.equal(requests, 0);
    assert.ok(form.textContent?.includes('Complete the spam check'));
    await click(Array.from(form.querySelectorAll('button')).find(button => button.textContent === 'Enable spam check')!);
    await act(async () => { tokenCallback!('fixture-token'); });
    await act(async () => { submit(); submit(); });
    assert.equal(requests, 1);
    assert.equal(form.getAttribute('aria-busy'), 'true');
    assert.ok(required<HTMLButtonElement>('.enquiry-form button[type="submit"]').disabled);
    await act(async () => complete!(new Response(JSON.stringify({ status: 'accepted', reference: 'fixture-reference' }), { status: 202 })));
    assert.ok(form.textContent?.includes('accepted for email delivery'));
    assert.ok(form.textContent?.includes('Inbox delivery has not been independently confirmed'));
    assert.equal(form.getAttribute('aria-busy'), 'false');
    assert.ok(document.querySelector('#consultation-name'));
  } finally { globalThis.fetch = originalFetch; delete window.turnstile; router.dispose(); }
});

test('Calendly is click-to-load and loading the frame never confirms a booking', async () => {
  const { ConsultationBooking } = await import('../src/components/contact/ConsultationBooking');
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  window.localStorage.setItem('grf-cookie-preferences', JSON.stringify({ version: 1, savedAt: Date.now(), analytics: false, media: true }));
  await act(async () => root!.render(h(MemoryRouter, null, h(CookieConsentProvider, null, h(ConsultationBooking, { bookingUrl: 'https://calendly.com/test-fixture/consultation' })))));
  assert.equal(document.querySelector('iframe'), null);
  await click(required('button'));
  assert.equal(required('iframe').getAttribute('src'), 'https://calendly.com/test-fixture/consultation');
  await act(async () => required('iframe').dispatchEvent(new Event('load')));
  assert.ok(!document.body.textContent?.includes('Your booking is confirmed'));
});


function PreferencesTestShell() {
  const { openPreferences } = useCookieConsent();
  return h('div', { id: 'site-content' }, h('button', { id: 'test-preferences', onClick: openPreferences }, 'Cookie preferences'), h(Outlet));
}
test('cookie rejection blocks GA4; preferences support focus, route views, persistence and withdrawal', async () => {
  const { AnalyticsBridge } = await import('../src/components/AnalyticsBridge');
  dom.happyDOM.settings.disableJavaScriptFileLoading = true;
  delete window.dataLayer; delete window.gtag;
  const append = document.head.append.bind(document.head);
  document.head.append = (...nodes) => { for (const node of nodes) if (typeof node !== 'string' && node.nodeName === 'SCRIPT') (node as HTMLScriptElement).type = 'application/x-test-fixture'; append(...nodes); };
  const config = { measurementId: 'G-TEST123456', approvedPolicy: true, approvedNotice: true, manualPageViewsConfirmed: true };
  document.body.innerHTML = '<div id="app"></div>'; root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter([{ element: h(CookieConsentProvider, null, h(AnalyticsBridge, { config }), h(PreferencesTestShell)), children: ['/', '/people', '/contact', '*'].map(path => ({ path, element: h('h1', null, path) })) }], { initialEntries: ['/'] });
  const events = () => (window.dataLayer ?? []).map(value => Array.from(value as ArrayLike<unknown>)).filter(command => command[0] === 'event');
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    const reject = () => Array.from(document.querySelectorAll<HTMLButtonElement>('.cookie-banner button, .cookie-dialog button')).find(button => button.textContent === 'Reject optional cookies')!;
    assert.equal(document.querySelector('script[data-grf-analytics]'), null);
    await click(reject());
    assert.equal(JSON.parse(window.localStorage.getItem('grf-cookie-preferences')!).analytics, false);
    assert.equal(document.querySelector('script[data-grf-analytics]'), null);
    await act(async () => root!.unmount()); root = createRoot(document.getElementById('app')!);
    await act(async () => root!.render(h(RouterProvider, { router })));
    assert.equal(document.querySelector('.cookie-banner'), null);
    assert.equal(document.querySelector('script[data-grf-analytics]'), null);
    const trigger = required<HTMLButtonElement>('#test-preferences'); trigger.focus(); await click(trigger);
    assert.ok(required('.cookie-dialog')); assert.equal(required<HTMLElement>('#site-content').inert, true);
    const first = required<HTMLButtonElement>('.cookie-close');
    const last = required<HTMLButtonElement>('.cookie-dialog .button--primary');
    last.focus(); await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })));
    assert.equal(document.activeElement, first);
    await escape(); assert.equal(document.querySelector('.cookie-dialog'), null); assert.equal(document.activeElement, trigger);
    await click(trigger); await click(required('#cookie-analytics')); await click(required('.cookie-dialog .button--primary'));
    assert.equal(JSON.parse(window.localStorage.getItem('grf-cookie-preferences')!).analytics, true);
    assert.equal(document.querySelectorAll('script[data-grf-analytics]').length, 1);
    await act(async () => required('script[data-grf-analytics]').dispatchEvent(new Event('load')));
    assert.equal(events().length, 1);
    await act(async () => { await router.navigate('/people?q=private@example.test#private'); });
    assert.equal(events().length, 2);
    await act(async () => { await router.navigate('/people?q=other-private'); });
    assert.equal(events().length, 2);
    await act(async () => { await router.navigate('/contact'); });
    assert.equal(events().length, 3);
    await act(async () => { await router.navigate('/unknown/private@example.test'); });
    assert.equal(events().length, 4);
    assert.equal((events()[3][2] as Record<string, unknown>).page_location, 'http://localhost:5173/not-found');
    assert.ok(!JSON.stringify(events()).includes('private'));
    await click(trigger); await click(reject());
    await act(async () => { await router.navigate('/'); });
    assert.equal(document.querySelector('script[data-grf-analytics]'), null); assert.equal(events().length, 4);
  } finally { router.dispose(); document.head.append = append; delete window.dataLayer; delete window.gtag; }
});

test('optional calendar stays blocked after rejection and is removed when media permission is withdrawn', async () => {
  const { ConsultationBooking } = await import('../src/components/contact/ConsultationBooking');
  window.localStorage.setItem('grf-cookie-preferences', JSON.stringify({ version: 1, savedAt: Date.now(), analytics: false, media: false }));
  document.body.innerHTML = '<div id="app"></div>'; root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter([{ element: h(CookieConsentProvider, null, h(PreferencesTestShell)), children: [{ path: '/', element: h(ConsultationBooking, { bookingUrl: 'https://calendly.com/test-fixture/consultation' }) }] }]);
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    assert.equal(document.querySelector('iframe'), null);
    await click(required('.consultation-preview button')); assert.ok(required('.cookie-dialog'));
    await click(required('#cookie-media')); await click(required('.cookie-dialog .button--primary'));
    await click(required('.consultation-preview button')); assert.ok(required('iframe'));
    await click(required('#test-preferences'));
    await click(Array.from(document.querySelectorAll('.cookie-dialog button')).find(button => button.textContent === 'Reject optional cookies')!);
    assert.equal(document.querySelector('iframe'), null);
  } finally { router.dispose(); }
});


test('blocked preference storage keeps optional services off and exposes a usable warning', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
  Object.defineProperty(window, 'localStorage', { configurable: true, value: { getItem() { throw new Error('Storage blocked'); }, setItem() { throw new Error('Storage blocked'); } } });
  document.body.innerHTML = '<div id="app"></div>'; root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/privacy'] });
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    assert.ok(required('.cookie-storage-note').textContent?.includes('could not save'));
    assert.equal(document.querySelector('script[data-grf-analytics]'), null);
    await click(Array.from(document.querySelectorAll('.cookie-banner button')).find(button => button.textContent === 'Reject optional cookies')!);
    assert.equal(document.querySelector('.cookie-banner'), null);
    assert.ok(document.body.textContent?.includes('not a Privacy Policy'));
    await click(required('.footer-privacy button')); assert.ok(required('.cookie-dialog'));
    assert.equal(required<HTMLInputElement>('#cookie-analytics').checked, false);
    await escape();
  } finally { router.dispose(); if (descriptor) Object.defineProperty(window, 'localStorage', descriptor); else Reflect.deleteProperty(window, 'localStorage'); }
});


test('prerendered data-router markup hydrates representative routes without recoverable errors', async () => {
  const { renderToString } = await import('react-dom/server');
  for (const path of ['/', '/people', '/contact', '/privacy', `/practices/${practices[0].slug}`]) {
    const serverRouter = createMemoryRouter(appRoutes, { initialEntries: [path] });
    const markup = renderToString(h(RouterProvider, { router: serverRouter })); serverRouter.dispose();
    document.body.innerHTML = `<div id="app">${markup}</div>`;
    window.history.replaceState(null, '', path);
    const router = createBrowserRouter(appRoutes);
    const errors: unknown[] = [];
    await act(async () => { root = hydrateRoot(document.getElementById('app')!, h(RouterProvider, { router }), { onRecoverableError: error => errors.push(error) }); });
    assert.deepEqual(errors, [], path); assert.equal(document.querySelectorAll('main h1').length, 1);
    await act(async () => root!.unmount()); root = undefined; router.dispose(); window.localStorage.clear(); window.history.replaceState(null, '', '/');
  }
});


test('directory query updates preserve keyboard focus and mark parameterized views noindex', async () => {
  document.body.innerHTML = '<div id="app"></div>'; root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/people'] });
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    const input = required<HTMLInputElement>('#people-search'); input.focus();
    await searchValue('people-search', 'Faith');
    assert.equal(document.activeElement, input);
    assert.ok(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')?.startsWith('noindex'));
  } finally { router.dispose(); }
});


test('editing a consultation preference invalidates the previous mailto draft', async () => {
  document.body.innerHTML = '<div id="app"></div>'; root = createRoot(document.getElementById('app')!);
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/contact'] });
  try {
    await act(async () => root!.render(h(RouterProvider, { router })));
    await searchValue('consultation-name', 'QA Fixture'); await searchValue('consultation-email', 'qa@example.test');
    await searchValue('consultation-preference', 'Tuesday afternoon');
    const form = required<HTMLInputElement>('#consultation-name').closest('form')!;
    await act(async () => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    assert.ok(form.querySelector('.email-draft-result'));
    await searchValue('consultation-preference', 'Thursday morning');
    assert.equal(Boolean(form.querySelector('.email-draft-result')), false);
  } finally { router.dispose(); }
});
