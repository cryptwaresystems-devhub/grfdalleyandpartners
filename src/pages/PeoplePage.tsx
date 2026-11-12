import { usePresentationMode } from '../lib/presentation';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Container } from '../components/Container';
import { PreviewNotice } from '../components/PreviewNotice';
import { PersonCard } from '../components/people/PersonCard';
import { getVisibleLawyers, searchLawyers } from '../lib/people';
import { isPublished } from '../lib/publication';

export function PeoplePage() {
  const mode = usePresentationMode();
  const [query, setQuery] = useState('');
  const people = getVisibleLawyers(mode);
  const results = searchLawyers(people, query);
  return <><PageHeader title="The people behind our practice." eyebrow="Our people" description="Explore the firm’s supplied professional profiles." breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'People' }]} /><Container>
    {people.some(person => !isPublished(person)) && <PreviewNotice>Information and photographs have been checked against supplied biographies. Profiles remain subject to final publication approval.</PreviewNotice>}
    <section className="people-directory section-space" aria-label="Professional directory"><div className="directory-toolbar"><div className="search-field"><label htmlFor="people-search">Find a professional</label><div><Search size={18} aria-hidden="true" /><input id="people-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name, role or practice" autoComplete="off" /></div></div><p role="status" aria-live="polite">{results.length} {results.length === 1 ? 'professional' : 'professionals'}{query ? ' found' : ''}</p></div>
      {results.length ? <div className="people-directory-grid">{results.map(person => <PersonCard key={person.id} person={person} />)}</div> : <div className="listing-empty"><h2>{people.length ? 'No matching profiles.' : 'Professional profiles forthcoming.'}</h2><p>{people.length ? 'Try another name, role or practice.' : 'Profiles will be available following publication approval. Please contact the firm for further information.'}</p>{people.length > 0 && <button className="button button--outline" type="button" onClick={() => setQuery('')}>Clear search</button>}</div>}
    </section></Container></>;
}
