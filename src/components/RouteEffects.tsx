import { usePresentationMode } from '../lib/presentation';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routeSeo } from '../lib/seo';
export function RouteEffects() {
 const { pathname, hash, search } = useLocation();
 const mode = usePresentationMode();
 useEffect(() => {
   const metadata = routeSeo(pathname, undefined, mode, Boolean(search));
   document.title = metadata.title;
   for (const [attribute, key, content] of [
     ['name', 'description', metadata.description],
     ['name', 'robots', metadata.robots],
     ['property', 'og:site_name', 'G.R.F. Dalley & Partners'],
     ['property', 'og:locale', 'en_NG'],
     ['property', 'og:title', metadata.title],
     ['property', 'og:description', metadata.description],
     ['property', 'og:type', 'website'],
     ['name', 'twitter:card', 'summary_large_image'],
     ['name', 'twitter:title', metadata.title],
     ['name', 'twitter:description', metadata.description],
   ]) {
     let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
     if (!meta) { meta = document.createElement('meta'); meta.setAttribute(attribute, key); document.head.append(meta); }
     meta.content = content;
   }
   for (const [attribute, key, value] of [['property', 'og:url', metadata.canonical], ['property', 'og:image', metadata.image], ['name', 'twitter:image', metadata.image], ['property', 'og:image:alt', metadata.image ? 'G.R.F. Dalley & Partners - established 1962' : null]] as [string, string, string | null][]) {
     const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
     if (!value) { existing?.remove(); continue; }
     const meta = existing ?? document.createElement('meta'); meta.setAttribute(attribute, key); meta.content = value; if (!existing) document.head.append(meta);
   }
   let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
   if (metadata.canonical) { canonical ??= document.createElement('link'); canonical.rel = 'canonical'; canonical.href = metadata.canonical; document.head.append(canonical); } else canonical?.remove();
   document.getElementById('route-structured-data')?.remove();
   if (metadata.structuredData) { const script = document.createElement('script'); script.id = 'route-structured-data'; script.type = 'application/ld+json'; script.textContent = JSON.stringify(metadata.structuredData); document.head.append(script); }
 }, [pathname, search, mode]);
 useEffect(() => {
   const target = hash ? document.getElementById(hash.slice(1)) : null;
   if (target) {
     target.scrollIntoView({ block: 'start' });
     target.focus({ preventScroll: true });
   } else {
     window.scrollTo(0, 0);
     document.getElementById('main-content')?.focus();
   }
 }, [pathname, hash]);
 return null;
}
