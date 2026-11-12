import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteTitle } from '../lib/route-title';
export function RouteEffects() {
 const { pathname, hash } = useLocation();
 useEffect(() => {
   const label = getRouteTitle(pathname);
   document.title = `${label} | G.R.F. Dalley & Partners`;
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
