import { ResponsiveImage } from '../ResponsiveImage';
import { linkedinProfileUrl, professionalEmailHref } from '../../lib/people';
import { usePresentationMode } from '../../lib/presentation';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import type { Lawyer } from '../../types/content';
import { PageHeader } from '../PageHeader';
import { Container } from '../Container';
import { ButtonLink } from '../Button';
import { PreviewNotice } from '../PreviewNotice';
import { isPublished } from '../../lib/publication';
import { getExpertiseCategories } from '../../lib/expertise';
import { getVisibleInsights, insightDateLabel } from '../../lib/insights';

export function LawyerProfileTemplate({ person }: { person: Lawyer }) {
  const mode = usePresentationMode();
  const practices = getExpertiseCategories('practice').filter(item => person.practiceIds.includes(item.id));
  const writing = getVisibleInsights(mode).filter(item => item.authorIds.includes(person.id));
  const linkedin = linkedinProfileUrl(person.linkedin);
  const emailHref = professionalEmailHref(person.email);
  const bibliography = person.suppliedPublications?.filter(item => !item.insightId || !writing.some(insight => insight.id === item.insightId)) ?? [];
  return <><PageHeader title={person.name} eyebrow="Our people" description={person.role} breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'People', to: '/people' }, { label: person.name }]} /><Container>
    {!isPublished(person) && <PreviewNotice>Details are drawn from the supplied biography and remain subject to final publication approval. Affiliations and credentials are shown as supplied.</PreviewNotice>}
    <div className="lawyer-profile-layout section-space"><aside className="lawyer-profile-aside" aria-label="Portrait and professional contact">{person.portrait && <ResponsiveImage className="lawyer-profile-portrait" src={person.portrait} alt={`Portrait of ${person.name}`} width="600" height="750" decoding="async" sizes="(min-width: 768px) 380px, 100vw" />}
      <dl className="profile-key-details">{person.yearOfCall !== null && <div><dt>Year of call</dt><dd>{person.yearOfCall}</dd></div>}{person.officeId && <div><dt>Office</dt><dd>{person.officeId === 'abuja' ? 'Abuja' : person.officeId === 'port-harcourt' ? 'Port Harcourt' : 'Lagos'}</dd></div>}</dl>
      <ButtonLink to="/contact" arrow>Contact the Firm</ButtonLink>{linkedin && <a className="profile-linkedin" href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
      {emailHref && <a className="profile-email" href={emailHref}>{person.email}</a>}
    </aside><div className="lawyer-profile-main">
      {person.biography && isPublished(person) && <section className="profile-section" aria-labelledby="biography-heading"><h2 id="biography-heading">Profile</h2>{person.biography.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>}
      {(!!person.practiceNames?.length || practices.length > 0) && <section className="profile-section" aria-labelledby="profile-practices"><p className="eyebrow">Professional focus</p><h2 id="profile-practices">Practices</h2><ul className="profile-tag-list">{(person.practiceNames ?? []).map(name => <li key={name}>{name}</li>)}</ul>{practices.length > 0 && <div className="profile-related-practices"><p>Explore related practice areas</p>{practices.map(item => <Link key={item.id} to={`/practices/${item.slug}`}>{item.name}</Link>)}</div>}</section>}
      {person.education.length > 0 && <section className="profile-section" aria-labelledby="education-heading"><h2 id="education-heading">Education</h2><ul className="profile-text-list">{person.education.map(item => <li key={item}>{item}</li>)}</ul></section>}
      {person.memberships.length > 0 && <section className="profile-section" aria-labelledby="memberships-heading"><h2 id="memberships-heading">Professional memberships</h2><ul className="profile-text-list">{person.memberships.map(item => <li key={item}>{item}</li>)}</ul></section>}
      {!!person.certifications?.length && <section className="profile-section" aria-labelledby="certifications-heading"><h2 id="certifications-heading">Certifications</h2><ul className="profile-text-list">{person.certifications.map(item => <li key={item}>{item}</li>)}</ul></section>}
      {writing.length > 0 && <section className="profile-section" aria-labelledby="writing-heading"><p className="eyebrow">Verified archive</p><h2 id="writing-heading">Published perspectives</h2><ul className="profile-writing-list">{writing.map(item => <li key={item.id}><span>{item.publisher} · {insightDateLabel(item)}</span><Link to={`/insights/${item.slug}`}>{item.name}</Link></li>)}</ul></section>}
      {bibliography.length > 0 && <section className="profile-section" aria-labelledby="bibliography-heading"><h2 id="bibliography-heading">Selected bibliography</h2><p className="profile-section-note">Historical entries supplied in the biography; publication details await final review.</p><ul className="profile-writing-list">{bibliography.map((item, index) => <li key={`${item.title}-${index}`}><span>{item.year}</span><p>{item.title}</p></li>)}</ul></section>}
      <Link className="detail-back" to="/people">Return to all people</Link>
    </div></div>
  </Container></>;
}
