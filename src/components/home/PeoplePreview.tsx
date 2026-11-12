import { Container } from '../Container';
import { SectionHeading } from '../SectionHeading';
import { ButtonLink } from '../Button';
import { Reveal } from './Reveal';
import type { HomepagePerson } from '../../data/homepage';
import { isPublished } from '../../lib/publication';

export function PeoplePreview({ people, mode = 'approved-only', eyebrow = 'Our people', title = 'Experience is personal.' }: { people: HomepagePerson[]; mode?: 'approved-only' | 'management-preview'; eyebrow?: string; title?: string }) {
  const visiblePeople = people.filter(person => isPublished(person) || (mode === 'management-preview' && person.editorial.status === 'in-review'));
  const hasPreviews = visiblePeople.some(person => !isPublished(person));
  return <section className="home-section home-people" aria-labelledby="people-heading"><Container>
    <Reveal className="home-section-heading"><SectionHeading id="people-heading" eyebrow={eyebrow} title={title}><p>Meet the people behind our practice.</p></SectionHeading><ButtonLink to="/people" variant="outline" arrow>Meet Our People</ButtonLink></Reveal>
    {visiblePeople.length > 0 ? <div className="people-preview-grid">{visiblePeople.map(person => <Reveal key={person.image}><article className="person-preview"><div className="person-preview__image"><img src={person.image} alt={`Portrait of ${person.name}`} width="600" height="750" loading="lazy" decoding="async" style={{ objectPosition: person.objectPosition }} /></div><div className="person-preview__caption"><h3>{person.name}</h3><p>{person.role}</p></div></article></Reveal>)}</div> : <p className="home-section-note">Professional profiles will be available following final approval.</p>}
    {hasPreviews && <p className="home-section-note">Profile previews. Full biographies are awaiting final approval.</p>}
  </Container></section>;
}
