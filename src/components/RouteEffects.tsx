import { usePresentationMode } from '../lib/presentation';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMetadata } from '../lib/route-metadata';
export function RouteEffects() {
 const { pathname, hash } = useLocation();
 const mode = usePresentationMode();
 useEffect(() => {
   const metadata = getRouteMetadata(pathname, mode);
   document.title = metadata.title;
   for (const [attribute, key, content] of [
     ['name', 'description', metadata.description],
     ['property', 'og:title', metadata.title],
     ['property', 'og:description', metadata.description],
     ['property', 'og:type', 'website'],
     ['name', 'twitter:card', 'summary'],
     ['name', 'twitter:title', metadata.title],
     ['name', 'twitter:description', metadata.description],
   ]) {
     let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
     if (!meta) { meta = document.createElement('meta'); meta.setAttribute(attribute, key); document.head.append(meta); }
     meta.content = content;
   }
   const target = hash ? document.getElementById(hash.slice(1)) : null;
   if (target) {
     target.scrollIntoView({ block: 'start' });
     target.focus({ preventScroll: true });
   } else {
     window.scrollTo(0, 0);
     document.getElementById('main-content')?.focus();
   }
 }, [pathname, hash, mode]);
 return null;
}
