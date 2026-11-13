export interface AnalyticsConfiguration { measurementId: string; approvedPolicy: boolean; approvedNotice: boolean; manualPageViewsConfirmed: boolean }
interface PageView { path: string; title: string }
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } }
export function validMeasurementId(value: string | undefined) { return /^G-[A-Z0-9]{5,20}$/.test(value ?? '') ? value! : null; }
export function clearAnalyticsCookies(doc: Document, hostname: string) {
  const names = doc.cookie.split(';').map(value => value.trim().split('=')[0]).filter(name => /^_ga(?:_|$)/.test(name));
  const parts = hostname.split('.');
  const domains = ['', ...parts.map((_, index) => parts.slice(index).join('.')).filter(domain => domain.includes('.')).flatMap(domain => [domain, `.${domain}`])];
  for (const name of names) for (const domain of domains) doc.cookie = `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`;
}
export function createAnalyticsClient(config: AnalyticsConfiguration, win: Window, doc: Document) {
  const id = validMeasurementId(config.measurementId);
  const enabled = Boolean(id && config.approvedPolicy && config.approvedNotice && config.manualPageViewsConfirmed);
  let active = false; let initialized = false; let generation = 0;
  let script: HTMLScriptElement | null = null;
  let lastPath = ''; let pages: PageView[] = [];
  const disableFlag = (disabled: boolean) => { if (id) (win as unknown as Record<string, unknown>)[`ga-disable-${id}`] = disabled; };
  function emit(page: PageView) {
    if (!active || !initialized) return;
    win.gtag?.('event', 'page_view', { send_to: id, page_location: `${win.location.origin}${page.path}`, page_title: page.title, page_referrer: '' });
  }
  return {
    setConsent(allowed: boolean) {
      if (!allowed || !enabled) {
        active = false; generation++; disableFlag(true); pages = []; lastPath = '';
        script?.remove(); script = null;
        // Never send a denied-consent ping: basic consent mode stays silent.
        if (!initialized && win.dataLayer) win.dataLayer.length = 0;
        clearAnalyticsCookies(doc, win.location.hostname);
        return;
      }
      if (active) return;
      active = true; disableFlag(false);
      const granted = { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
      if (initialized) { win.gtag?.('consent', 'update', granted); return; }
      const current = ++generation;
      win.dataLayer ??= [];
      // eslint-disable-next-line prefer-rest-params -- Standard gtag queue uses an arguments object.
      win.gtag ??= function () { win.dataLayer!.push(arguments); };
      win.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      script = doc.createElement('script'); script.async = true; script.referrerPolicy = 'no-referrer'; script.dataset.grfAnalytics = 'true';
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      script.onload = () => {
        if (!active || initialized || current !== generation) return;
        initialized = true;
        win.gtag?.('consent', 'update', granted);
        win.gtag?.('js', new Date());
        win.gtag?.('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_flags: 'SameSite=Lax;Secure', cookie_path: '/', cookie_expires: 15552000, cookie_update: false, page_location: `${win.location.origin}/`, page_referrer: '', ignore_referrer: true });
        pages.forEach(emit); pages = [];
      };
      script.onerror = () => { if (current !== generation) return; active = false; disableFlag(true); pages = []; lastPath = ''; script?.remove(); script = null; };
      doc.head.append(script);
    },
    pageView(path: string, title: string) {
      if (!active || lastPath === path) return;
      lastPath = path;
      const page = { path, title };
      if (initialized) emit(page); else pages.push(page);
    },
  };
}
export type AnalyticsClient = ReturnType<typeof createAnalyticsClient>;
const clients = new Map<AnalyticsClient, number>();
export function registerAnalytics(client: AnalyticsClient) {
  clients.set(client, (clients.get(client) ?? 0) + 1);
  return () => {
    clients.set(client, Math.max(0, (clients.get(client) ?? 1) - 1));
    // React StrictMode immediately re-registers the same instance. Avoid a
    // second script/config/page view during that development-only cycle.
    queueMicrotask(() => { if (clients.get(client) === 0) { client.setConsent(false); clients.delete(client); } });
  };
}
export function revokeAnalytics() { clients.forEach((_count, client) => client.setConsent(false)); }
