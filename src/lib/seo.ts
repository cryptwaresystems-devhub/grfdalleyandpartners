import type { ContentRecord } from '../types/content';
import { getRouteMetadata } from './route-metadata';
import { getRouteTitle } from './route-title';
import { industries } from '../data/industries';
import { practices } from '../data/practices';
import { lawyers } from '../data/lawyers';
import { insights } from '../data/insights';
import { about } from '../data/about';
import { isPublished } from './publication';
import { isPrivacyPolicyApproved, productionPrivacyIssues } from './privacy';
import { contactDetails } from '../data/contact-details';
import type { PresentationMode } from './presentation';
export interface SeoConfiguration { origin: string | null; publicIndexing: boolean }
export function siteOrigin(value: string | undefined): string | null {
  try { const url = new URL(value ?? ''); return url.protocol === 'https:' && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash && !url.port ? url.origin : null; } catch { return null; }
}
export function seoConfiguration(env: Record<string, string | undefined>, legalReady = productionPrivacyIssues().length === 0): SeoConfiguration {
  const origin = siteOrigin(env.VITE_SITE_URL);
  return { origin, publicIndexing: Boolean(origin && legalReady && env.VITE_PUBLIC_INDEXING === 'true' && env.VITE_CONTENT_MODE !== 'management-preview') };
}
export const defaultSeoConfiguration = seoConfiguration(import.meta.env ?? {});
export function realRoutes(mode: PresentationMode = 'approved-only') {
  const visible = <T extends ContentRecord>(records: T[]) => records.filter(record => isPublished(record) || (mode === 'management-preview' && record.editorial.status === 'in-review'));
  return ['/', '/about', '/industries', '/practices', '/people', '/insights', '/contact', '/privacy',
    ...industries.filter(item => item.labelApproval?.status === 'confirmed' || isPublished(item)).map(item => `/industries/${item.slug}`),
    ...practices.filter(item => item.labelApproval?.status === 'confirmed' || isPublished(item)).map(item => `/practices/${item.slug}`),
    ...visible(lawyers).map(item => `/people/${item.slug}`), ...visible(insights).map(item => `/insights/${item.slug}`)];
}
export function publishedRoutes() {
  return realRoutes().filter(path => {
    if (path === '/privacy') return isPrivacyPolicyApproved();
    if (path === '/about') return isPublished(about);
    const record = [...industries, ...practices, ...lawyers, ...insights].find(item => path.endsWith(`/${item.slug}`));
    return !record || isPublished(record);
  });
}
export function normalizeRoute(pathname: string) { return (pathname.replace(/\/+$/, '') || '/').replace(/^\/industry(?=\/|$)/, '/industries').replace(/^\/practice(?=\/|$)/, '/practices'); }
export function routeSeo(pathname: string, config = defaultSeoConfiguration, mode: PresentationMode = 'approved-only', hasQuery = false) {
  const path = normalizeRoute(pathname);
  const known = getRouteTitle(path, mode) !== 'Page not found';
  const metadata = getRouteMetadata(path, mode);
  const canonical = known && config.origin ? `${config.origin}${path === '/' ? '/' : path}` : null;
  const index = config.publicIndexing && mode === 'approved-only' && !hasQuery && publishedRoutes().includes(path);
  const image = config.origin ? `${config.origin}/assets/social-preview.png` : null;
  const graph: object[] = [];
  if (known && config.origin && mode === 'approved-only') {
    graph.push({ '@type': 'Organization', '@id': `${config.origin}/#firm`, name: 'G.R.F. Dalley & Partners', url: `${config.origin}/`, foundingDate: '1962', email: contactDetails.email, logo: `${config.origin}/assets/grf-logo.jpg`, address: contactDetails.offices.filter(office => office.lines.length).map(office => ({ '@type': 'PostalAddress', streetAddress: office.id === 'lagos' ? office.lines.slice(0, 2).join(', ') : office.lines[0], addressLocality: office.name, addressCountry: 'NG' })) });
    graph.push({ '@type': 'WebPage', '@id': `${canonical}#page`, url: canonical, name: metadata.title, description: metadata.description, publisher: { '@id': `${config.origin}/#firm` } });
    if (path !== '/') {
      const parent = path.split('/').filter(Boolean)[0];
      const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${config.origin}/` }];
      if (path.split('/').filter(Boolean).length > 1) items.push({ '@type': 'ListItem', position: 2, name: getRouteTitle(`/${parent}`, mode), item: `${config.origin}/${parent}` });
      items.push({ '@type': 'ListItem', position: items.length + 1, name: getRouteTitle(path, mode), item: canonical! });
      graph.push({ '@type': 'BreadcrumbList', itemListElement: items });
    }
  }
  return { ...metadata, canonical, image, robots: index ? 'index,follow' : hasQuery && config.publicIndexing ? 'noindex,follow' : 'noindex,nofollow', structuredData: graph.length ? { '@context': 'https://schema.org', '@graph': graph } : null };
}
export function sitemap(config: SeoConfiguration) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${config.origin ? publishedRoutes().map(path => `<url><loc>${config.origin}${path}</loc></url>`).join('') : ''}</urlset>\n`;
}
export function robots(config: SeoConfiguration) { return config.publicIndexing ? `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${config.origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n'; }

export function assertProductionSeo(env: Record<string, string | undefined>) {
  if (!siteOrigin(env.VITE_SITE_URL)) throw new Error('Production launch blocked: configure the approved HTTPS VITE_SITE_URL.');
  if (env.VITE_CONTENT_MODE === 'management-preview') throw new Error('Production launch blocked: management preview is not a public release.');
}
