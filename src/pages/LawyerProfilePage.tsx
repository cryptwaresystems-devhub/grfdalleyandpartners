import { usePresentationMode } from '../lib/presentation';
import { useParams } from 'react-router-dom';
import { getVisibleLawyers } from '../lib/people';
import { LawyerProfileTemplate } from '../components/people/LawyerProfileTemplate';
import { NotFoundPage } from './NotFoundPage';
export function LawyerProfilePage() {
  const mode = usePresentationMode();
  const { slug } = useParams();
  const person = getVisibleLawyers(mode).find(item => item.slug === slug);
  return person ? <LawyerProfileTemplate person={person} /> : <NotFoundPage />;
}
