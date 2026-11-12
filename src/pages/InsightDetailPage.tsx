import { usePresentationMode } from '../lib/presentation';
import { useParams } from 'react-router-dom';
import { getVisibleInsights } from '../lib/insights';
import { InsightDetailTemplate } from '../components/insights/InsightDetailTemplate';
import { NotFoundPage } from './NotFoundPage';
export function InsightDetailPage() {
  const mode = usePresentationMode();
  const { slug } = useParams();
  const insight = getVisibleInsights(mode).find(item => item.slug === slug);
  return insight ? <InsightDetailTemplate insight={insight} /> : <NotFoundPage />;
}
