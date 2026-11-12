import { navigation } from '../data/navigation';
import { getExpertiseDetail } from './expertise';
import { getVisibleLawyers } from './people';
import { getVisibleInsights } from './insights';

export function getRouteTitle(pathname: string): string {
  const path = (pathname.replace(/\/+$/, '') || '/').replace(/^\/industry(?=\/|$)/, '/industries').replace(/^\/practice(?=\/|$)/, '/practices');
  const known = navigation.find(item => item.path === path);
  if (known) return known.label;
  const contentMatch = /^\/(people|insights)\/([^/]+)$/.exec(path);
  if (contentMatch) {
    try {
      const records = contentMatch[1] === 'people' ? getVisibleLawyers('management-preview') : getVisibleInsights('management-preview');
      return records.find(record => record.slug === decodeURIComponent(contentMatch[2]))?.name ?? 'Page not found';
    } catch { return 'Page not found'; }
  }
  const match = /^\/(industries|practices)\/([^/]+)$/.exec(path);
  if (match) {
    try { return getExpertiseDetail(match[1] === 'industries' ? 'industry' : 'practice', decodeURIComponent(match[2]))?.record.name ?? 'Page not found'; } catch { return 'Page not found'; }
  }
  return 'Page not found';
}
