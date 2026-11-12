import { PageHeader } from '../components/PageHeader';
import { Container } from '../components/Container';
import { ButtonLink } from '../components/Button';
import { ExpertiseCard } from '../components/expertise/ExpertiseCard';
import { getExpertiseCategories } from '../lib/expertise';
import { practiceGroups } from '../data/practice-groups';
import type { ExpertiseKind } from '../types/content';

export function ExpertiseOverviewPage({ kind }: { kind: ExpertiseKind }) {
  const records = getExpertiseCategories(kind);
  const industry = kind === 'industry';
  const title = industry ? 'Industry expertise' : 'Our practice areas';
  const groupedIds = new Set<string>(practiceGroups.flatMap(group => [...group.practiceIds]));
  const groups = [...practiceGroups.map(group => ({ ...group, records: records.filter(record => (group.practiceIds as readonly string[]).includes(record.id)) })), { id: 'other-practices', title: 'Further practice areas', records: records.filter(record => !groupedIds.has(record.id)) }].filter(group => group.records.length);
  return <>
    <PageHeader title={title} eyebrow={industry ? 'Sectors & perspective' : 'Legal services'} description={industry ? 'Explore the firm’s confirmed industry categories.' : 'Browse the firm’s confirmed practice areas.'} breadcrumbs={[{ label: 'Home', to: '/' }, { label: industry ? 'Industry' : 'Practice' }]} />
    <Container><section className="expertise-directory" aria-labelledby="directory-heading"><div className="expertise-directory__intro"><div><p className="eyebrow">{industry ? 'Our industries' : 'Our practices'}</p><h2 id="directory-heading">{industry ? 'Find your sector.' : 'Find your area of focus.'}</h2></div><p>Each category links to its own page. Detailed descriptions and related information will appear following approval.</p></div>
      {industry ? <div className="industry-directory-grid">{records.map((record, index) => <ExpertiseCard key={record.id} record={record} kind={kind} index={index} />)}</div> : <><nav className="practice-jump-links" aria-label="Browse practice groups">{groups.map(group => <a key={group.id} href={`#${group.id}`}>{group.title}</a>)}</nav><p className="directory-note">Grouped for browsing; practice names follow the confirmed specification.</p><div className="practice-directory-groups">{groups.map((group, index) => <section key={group.id} id={group.id} tabIndex={-1} className="practice-group" aria-labelledby={`${group.id}-heading`}><div className="practice-group__heading"><span aria-hidden="true">0{index + 1}</span><h2 id={`${group.id}-heading`}>{group.title}</h2></div><div className="practice-group__list">{group.records.map(record => <ExpertiseCard key={record.id} record={record} kind={kind} index={records.indexOf(record)} />)}</div></section>)}</div></>}
      <div className="directory-contact"><p>Looking for the right point of contact?</p><ButtonLink to="/contact" variant="outline" arrow>Start a Conversation</ButtonLink></div>
    </section></Container>
  </>;
}
