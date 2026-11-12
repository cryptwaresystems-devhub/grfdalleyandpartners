import { after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

const dom = new Window({ url: 'http://localhost:5173' });
for (const key of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'PointerEvent', 'navigator'] as const) {
  Object.defineProperty(globalThis, key, { configurable: true, value: key === 'window' ? dom : dom[key] });
}
Object.assign(globalThis, {
  IS_REACT_ACT_ENVIRONMENT: true,
  requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(0), 0),
});
const { createElement: h, act } = await import('react');
const { createRoot } = await import('react-dom/client');
const { MemoryRouter, Routes, Route, createMemoryRouter, RouterProvider } = await import('react-router-dom');
const { SiteHeader } = await import('../src/components/SiteHeader');
const { SiteFooter } = await import('../src/components/SiteFooter');
const { RouteEffects } = await import('../src/components/RouteEffects');
const { navigation } = await import('../src/data/navigation');
const { routes: appRoutes } = await import('../src/app/routes');
const { industries } = await import('../src/data/industries');
const { practices } = await import('../src/data/practices');
const { lawyers } = await import('../src/data/lawyers');
const { insights } = await import('../src/data/insights');
const { getRouteMetadata } = await import('../src/lib/route-metadata');
let root: ReturnType<typeof createRoot> | undefined;

async function mount() {
  dom.happyDOM.setWindowSize({ width: 1440, height: 900 });
  document.body.innerHTML = '<div id="app"></div>';
  root = createRoot(document.getElementById('app')!);
  await act(async () => root!.render(h(MemoryRouter, null,
    h(RouteEffects), h(SiteHeader), h(Routes, null, ...navigation.map(item => h(Route, { key: item.path, path: item.path, element: h('main', { id: 'main-content', tabIndex: -1, 'data-page': item.path }, item.label) }))), h(SiteFooter),
  )));
}
function required<T extends Element>(selector: string): T {
  const node = document.querySelector<T>(selector);
  assert.ok(node, `Missing ${selector}`);
  return node;
}
async function click(node: Element) { await act(async () => { node.dispatchEvent(new MouseEvent('click', { bubbles: true, button: 0 })); }); }
async function escape() { await act(async () => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); }); }
afterEach(async () => { if (root) await act(async () => root!.unmount()); root = undefined; });
after(() => dom.happyDOM.close());

test('all desktop primary links navigate and expose the active page', async () => {
  await mount();
  for (const item of navigation) {
    const link = required<HTMLAnchorElement>(`.desktop-navigation .nav-link[href="${item.path}"]`);
    await click(link);
    assert.equal(required('main').getAttribute('data-page'), item.path);
    const metadata = getRouteMetadata(item.path);
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
    assert.ok(required('.provisional-notice'));
    for (const [base, records] of [['/industries', industries], ['/practices', practices]] as const) {
      await act(async () => { await router.navigate(base); });
      assert.equal(document.querySelectorAll('.expertise-card').length, records.length);
      await click(required(`.expertise-card[href="${base}/${records[0].slug}"]`));
      assert.equal(required('main h1').textContent, records[0].name);
      for (const record of records) {
        await act(async () => { await router.navigate(`${base}/${record.slug}`); });
        assert.equal(required('main h1').textContent, record.name);
        assert.ok(required('.content-pending'));
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
      assert.equal(document.querySelectorAll('.insight-list-card').length, [0, 3].includes(index) ? 2 : 0);
    }
    await click(required('.listing-empty button'));
    assert.equal(document.querySelectorAll('.insight-list-card').length, 2);
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
