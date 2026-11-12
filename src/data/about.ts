import { firm } from './firm';
import type { AboutContent } from '../types/content';

// Profile-grounded narrative published under the requester's delegated-copy instruction.
export const about: AboutContent = {
  id: 'about-narrative', slug: 'about', name: 'About Us',
  editorial: {"status": "authorized", "source": "Updated Firm Profile pp. 2, 5 and 12; edited firm introduction and service approach; wording adapted or composed under the requester's explicit delegated-copy instruction. Final firm legal review remains separate.", "authorizedBy": "Project requester - Prompt 7 follow-up instruction", "authorizedAt": "2026-11-12", "publishedAt": "2026-11-12"},
  established: firm.foundedYear,
  introduction: 'A Nigerian legal practice with a long perspective and a commercial focus.',
  history: [
    'Established in 1962, the firm now known as G.R.F. Dalley & Partners has evolved into a contemporary Nigerian law practice.',
    'The firm brings together generations of lawyers and experience across corporate and commercial law, dispute resolution, banking and finance, and intellectual property.',
  ],
  service: 'Our aim is to provide efficient, timely legal services shaped around the needs of our clients. We recognise that businesses operate in increasingly competitive and complex markets, and approach legal questions with those realities in view.',
  approach: [
    { title: 'Understand the business', text: 'Begin with the commercial context, the sector and the objectives behind the legal question.' },
    { title: 'Bring the right perspectives', text: 'Draw on the experience of senior and emerging lawyers, and connect the relevant areas of practice.' },
    { title: 'Keep the objective in view', text: 'Focus on useful, timely advice that responds to the needs of the client.' },
  ],
};
