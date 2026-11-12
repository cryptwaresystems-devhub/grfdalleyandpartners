import { useParams } from 'react-router-dom';
import { getVisibleInsights } from '../lib/insights';
import { InsightDetailTemplate } from '../components/insights/InsightDetailTemplate';
import { NotFoundPage } from './NotFoundPage';
export function InsightDetailPage() {
  const { slug } = useParams();
  const insight = getVisibleInsights('management-preview').find(item => item.slug === slug);
  return insight ? <InsightDetailTemplate insight={insight} /> : <NotFoundPage />;
}
