import { isPrivacyPolicyApproved } from './privacy';
import { sitePresentationMode, type PresentationMode } from './presentation';
import { getRouteTitle } from './route-title';
import { getExpertiseDetail } from './expertise';
import { about } from '../data/about';
import { isPublished } from './publication';
import { getVisibleLawyers } from './people';
import { getVisibleInsights, insightDateLabel } from './insights';

const descriptions: Record<string, string> = {
  '/': 'Discover G.R.F. Dalley & Partners, established in 1962. Explore the firm, its people and commercial legal services in this design preview.',
  '/about': 'Explore the history and client-service approach of G.R.F. Dalley & Partners. Firm-profile copy is presented for management review.',
  '/industries': 'Explore the 15 confirmed industry categories of G.R.F. Dalley & Partners. Read sector overviews and explore connected practice areas.',
  '/practices': 'Explore the 21 confirmed practice areas of G.R.F. Dalley & Partners. Read practice introductions and explore connected industries.',
  '/people': 'Meet the professionals of G.R.F. Dalley & Partners. Search supplied professional profiles by name and practice area.',
  '/insights': 'Browse verified historic publication references from G.R.F. Dalley & Partners, with links to their original publishers.',
  '/privacy': isPrivacyPolicyApproved() ? 'Read the firm-approved Privacy Policy for G.R.F. Dalley & Partners.' : 'Privacy Policy for G.R.F. Dalley & Partners. Firm-approved legal text is pending; the website remains a design preview.',
  '/contact': 'Contact G.R.F. Dalley & Partners in Lagos and Port Harcourt. Find office details and prepare an enquiry for your email app.',
};

export function getRouteMetadata(pathname: string, mode: PresentationMode = sitePresentationMode) {
  const path = (pathname.replace(/\/+$/, '') || '/').replace(/^\/industry(?=\/|$)/, '/industries').replace(/^\/practice(?=\/|$)/, '/practices');
  const label = getRouteTitle(path, mode);
  const publicDescriptions: Record<string, string> = {
    '/': 'G.R.F. Dalley & Partners, established in 1962. Explore the firm, confirmed practice and industry categories, and contact information.',
    '/about': isPublished(about) ? about.introduction : 'Learn about G.R.F. Dalley & Partners and contact the firm. The detailed firm overview will be available following publication approval.',
    '/people': 'Find professional profiles at G.R.F. Dalley & Partners. Explore supplied biographies, professional backgrounds and practice connections.',
    '/insights': 'Explore verified publication references, authors and connected expertise at G.R.F. Dalley & Partners.',
  };
  const expertiseMatch = /^\/(industries|practices)\/([^/]+)$/.exec(path);
  let approvedSummary: string | null = null;
  const person = getVisibleLawyers(mode).find(item => path === `/people/${item.slug}`);
  const insight = getVisibleInsights(mode).find(item => path === `/insights/${item.slug}`);
  const recordDescription = person?.biography ?? (insight ? `${insight.name}. ${insight.publisher ?? 'G.R.F. Dalley & Partners'} · ${insightDateLabel(insight)}. Explore its author and connected expertise.` : null);
  if (expertiseMatch && label !== 'Page not found') {
    try { approvedSummary = getExpertiseDetail(expertiseMatch[1] === 'industries' ? 'industry' : 'practice', decodeURIComponent(expertiseMatch[2]))?.summary ?? null; } catch { /* Unknown slugs use not-found metadata. */ }
  }
  const description = recordDescription ?? approvedSummary ?? (mode === 'approved-only' ? publicDescriptions[path] : undefined) ?? descriptions[path] ?? (label === 'Page not found'
    ? 'The requested page could not be found. Explore G.R.F. Dalley & Partners using the website navigation.'
    : mode === 'management-preview' ? `${label} — G.R.F. Dalley & Partners. View this management-review preview; detailed content and publication approval may be pending.`
      : `${label} — G.R.F. Dalley & Partners. Contact the firm for further information. Detailed information is displayed following publication approval.`);
  const conciseDescription = description.replace(/\s+/g, ' ').trim();
  return { title: `${label === 'Home' ? 'Home - Nigerian Commercial Legal Services' : label} | G.R.F. Dalley & Partners`, description: conciseDescription.length > 200 ? `${conciseDescription.slice(0, 197).trimEnd()}...` : conciseDescription };
}
