import type { ContentRecord } from '../types/content';

// Source-backed excerpts for the Prompt 3 management presentation. The full
// source records keep their publication gates; no biographies are promoted.
export const homepageCopy = {
  established: 'ESTABLISHED 1962',
  headline: 'Established in Experience. Focused on Your Future.',
  introduction: 'Commercially focused legal advice for businesses navigating complex markets. Bringing together experience, sector understanding and a commitment to your objectives.',
  source: 'Firm Profile pages 2, 5 and 12; client-supplied Prompt 3 headline',
};
// Labels confirmed in WRS 6.4; summaries adapted from the supplied profile.
export const featuredPractices = [
  { name: 'Corporate and Commercial', summary: 'Advice on the agreements, transactions and structures behind your business.', source: 'Profile pp. 5–6' },
  { name: 'Commercial Litigation', summary: 'Representation in commercial disputes, with your business interests in view.', source: 'Profile pp. 5, 12' },
  { name: 'Banking & Financial Services', summary: 'Support across financing, restructuring and financial-sector transactions.', source: 'Profile pp. 12–13' },
  { name: 'Arbitration & Mediation', summary: 'Alternative routes to resolving commercial disputes.', source: 'Profile p. 9; WRS 6.4' },
  { name: 'Technology & Intellectual Property', summary: 'Protecting the ideas, brands and intellectual assets that shape your business.', source: 'Profile pp. 3, 7–8' },
  { name: 'Aviation & Transportation', summary: 'Advice on aviation operations, financing, regulation and disputes.', source: 'Profile pp. 18–19' },
] as const;
export const featuredIndustries = ['Aviation and Airlines', 'Banking, Payments and Fintech', 'Energy', 'Technology, Telecom and Internet Competition'] as const;

export interface HomepagePerson extends ContentRecord {
  role: string; image: string; objectPosition?: string;
}
export const managementPeople: HomepagePerson[] = [
  { id: 'aderemi-dalley', slug: 'aderemi-dalley', name: 'Aderemi Dalley', role: 'Founding Partner', image: '/assets/people/aderemi-dalley.jpg', objectPosition: '50% 30%', editorial: { status: 'in-review', source: 'Firm-supplied portrait and Remi Dalley biography' } },
  { id: 'ajibola-dalley', slug: 'ajibola-dalley', name: 'Ajibola Dalley, SAN, FCIArb', role: 'Co-founding Partner', image: '/assets/people/ajibola-dalley.jpg', objectPosition: '50% 30%', editorial: { status: 'in-review', source: 'Firm-supplied portrait and Ajibola Dalley SAN biography' } },
  { id: 'wande-esan', slug: 'wande-esan', name: 'Wande Esan', role: 'Partner (Non-equity)', image: '/assets/people/wande-esan.jpg', objectPosition: '50% 30%', editorial: { status: 'in-review', source: 'Firm-supplied portrait and Wande Esan biography' } },
];
export const verifiedPublications = [
  {
    id: 'non-interventionist-principle', category: 'Arbitration', title: 'The Non-Interventionist Principle',
    subtitle: 'Court intervention in arbitration proceedings', author: 'Ajibola Dalley', year: '2019',
    publisher: 'The Gravitas Review', publisherNote: 'Publisher page · purchase may be required',
    url: 'https://gravitasreview.com.ng/product/non-interventionist-principle-sections-30-and-34/',
    source: 'Publisher confirms title and author; firm biography confirms December 2019, Vol. 10 No. 4',
  },
  {
    id: 'continental-free-trade', category: 'International Trade', title: 'Continental free trade agreement renews hope for Africa’s prosperity',
    subtitle: null, author: 'Ajibola Dalley', year: '2019', publisher: 'The Guardian', publisherNote: 'External publication',
    url: 'https://guardian.ng/features/continental-free-trade-agreement-renews-hope-for-africas-prosperity/',
    source: 'Publisher confirms title, author and 3 September 2019 date',
  },
] as const;
