import { Search } from 'lucide-react';
import { usePresentationMode } from '../lib/presentation';
import { useDirectoryQuery } from '../lib/directory-query';
import { PageHeader } from '../components/PageHeader';
import { Container } from '../components/Container';
import { PreviewNotice } from '../components/PreviewNotice';
import { DirectorySelect } from '../components/DirectorySelect';
import { PersonCard } from '../components/people/PersonCard';
import { filterLawyers, getVisibleLawyers } from '../lib/people';
import { getExpertiseCategories } from '../lib/expertise';
import { isPublished } from '../lib/publication';

export function PeoplePage() {
  const mode = usePresentationMode();
  const { params, update, reset } = useDirectoryQuery();
  const query = params.get('q') ?? '';
  const practiceId = params.get('practice') ?? 'all';
  const people = getVisibleLawyers(mode);
  const practices = getExpertiseCategories('practice');
  const options = practices.map(practice => ({ id: practice.id, name: practice.name, count: people.filter(person => person.practiceIds.includes(practice.id)).length })).filter(option => option.count > 0);
  const results = filterLawyers(people, query, practiceId, practices);
  const active = Boolean(query || practiceId !== 'all');
  return <><PageHeader title="The people behind our practice." eyebrow="Our people" description="Explore the firm's professional profiles and areas of practice." breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'People' }]} /><Container>
    {people.some(person => !isPublished(person)) && <PreviewNotice>Information and photographs have been checked against supplied biographies. Profiles remain subject to final publication approval.</PreviewNotice>}
    <section className="people-directory section-space" aria-label="Professional directory"><div className="directory-controls"><div className="search-field"><label htmlFor="people-search">Find a professional</label><div><Search size={18} aria-hidden="true" /><input id="people-search" type="search" value={query} onChange={event => update({ q: event.target.value })} placeholder="Search by name, role or practice" autoComplete="off" /></div></div><DirectorySelect id="people-practice" label="Practice area" allLabel="All practice areas" value={practiceId} options={options} onChange={value => update({ practice: value })} />{active && <button className="directory-reset" type="button" onClick={reset}>Clear filters</button>}</div><p className="listing-count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'professional' : 'professionals'}{active ? ' found' : ''}</p>
      {results.length ? <div className="people-directory-grid">{results.map(person => <PersonCard key={person.id} person={person} />)}</div> : <div className="listing-empty"><h2>{people.length ? 'No matching profiles.' : 'Professional profiles forthcoming.'}</h2><p>{people.length ? 'Try another name or practice area, or clear the filters.' : 'Profiles will be available following publication approval. Please contact the firm for further information.'}</p>{people.length > 0 && <button className="button button--outline" type="button" onClick={reset}>Clear search and filters</button>}</div>}
    </section></Container></>;
}
