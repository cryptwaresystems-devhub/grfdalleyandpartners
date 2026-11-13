import { PrivacyPage } from '../pages/PrivacyPage';
import { Navigate, useLocation, useParams, type RouteObject } from 'react-router-dom';
import { FoundationLayout } from './FoundationLayout';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { ExpertiseOverviewPage } from '../pages/ExpertiseOverviewPage';
import { ExpertiseDetailPage } from '../pages/ExpertiseDetailPage';
import { PeoplePage } from '../pages/PeoplePage';
import { LawyerProfilePage } from '../pages/LawyerProfilePage';
import { InsightsPage } from '../pages/InsightsPage';
import { InsightDetailPage } from '../pages/InsightDetailPage';
import { ContactPage } from '../pages/ContactPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PresentationProvider, sitePresentationMode, type PresentationMode } from '../lib/presentation';

function LegacyExpertiseRedirect({ base }: { base: string }) {
  const { slug } = useParams();
  const { search, hash } = useLocation();
  return <Navigate replace to={{ pathname: slug ? `${base}/${encodeURIComponent(slug)}` : base, search, hash }} />;
}
// Shared with route tests so aliases and details exercise the real app tree.
export function createAppRoutes(mode: PresentationMode = sitePresentationMode): RouteObject[] { return [{ element: <PresentationProvider mode={mode}><FoundationLayout /></PresentationProvider>, children: [
  { index: true, element: <HomePage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/industries', element: <ExpertiseOverviewPage kind="industry" /> },
  { path: '/industries/:slug', element: <ExpertiseDetailPage kind="industry" /> },
  { path: '/practices', element: <ExpertiseOverviewPage kind="practice" /> },
  { path: '/practices/:slug', element: <ExpertiseDetailPage kind="practice" /> },
  { path: '/industry', element: <LegacyExpertiseRedirect base="/industries" /> },
  { path: '/industry/:slug', element: <LegacyExpertiseRedirect base="/industries" /> },
  { path: '/practice', element: <LegacyExpertiseRedirect base="/practices" /> },
  { path: '/practice/:slug', element: <LegacyExpertiseRedirect base="/practices" /> },
  { path: '/people', element: <PeoplePage /> },
  { path: '/people/:slug', element: <LawyerProfilePage /> },
  { path: '/insights', element: <InsightsPage /> },
  { path: '/insights/:slug', element: <InsightDetailPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '*', element: <NotFoundPage /> },
] }]; }
export const routes = createAppRoutes();
