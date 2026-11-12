import { getRouteTitle } from './route-title';

const descriptions: Record<string, string> = {
  '/': 'Discover G.R.F. Dalley & Partners, established in 1962. Explore the firm, its people and commercial legal services in this design preview.',
  '/about': 'Explore the history and client-service approach of G.R.F. Dalley & Partners. Firm-profile copy is presented for management review.',
  '/industries': 'Explore the 15 confirmed industry categories of G.R.F. Dalley & Partners. Detailed sector content awaits approval.',
  '/practices': 'Explore the 21 confirmed practice areas of G.R.F. Dalley & Partners. Detailed service content awaits approval.',
  '/people': 'Meet the professionals of G.R.F. Dalley & Partners. Search source-checked profile previews awaiting publication approval.',
  '/insights': 'Browse verified historic publication references from G.R.F. Dalley & Partners, with links to their original publishers.',
  '/contact': 'Contact G.R.F. Dalley & Partners in Lagos and Port Harcourt. Find office details and prepare an enquiry for your email app.',
};

export function getRouteMetadata(pathname: string) {
  const path = (pathname.replace(/\/+$/, '') || '/').replace(/^\/industry(?=\/|$)/, '/industries').replace(/^\/practice(?=\/|$)/, '/practices');
  const label = getRouteTitle(path);
  const description = descriptions[path] ?? (label === 'Page not found'
    ? 'The requested page could not be found. Explore G.R.F. Dalley & Partners using the website navigation.'
    : `${label} — G.R.F. Dalley & Partners. View this management-review preview; detailed content and publication approval may be pending.`);
  return { title: `${label} | G.R.F. Dalley & Partners`, description };
}
