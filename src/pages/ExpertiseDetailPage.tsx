import { useParams } from 'react-router-dom';
import type { ExpertiseKind } from '../types/content';
import { getExpertiseDetail } from '../lib/expertise';
import { ExpertiseDetailTemplate } from '../components/expertise/ExpertiseDetailTemplate';
import { NotFoundPage } from './NotFoundPage';

export function ExpertiseDetailPage({ kind }: { kind: ExpertiseKind }) {
  const { slug } = useParams();
  const detail = getExpertiseDetail(kind, slug ?? '');
  return detail ? <ExpertiseDetailTemplate detail={detail} /> : <NotFoundPage />;
}
