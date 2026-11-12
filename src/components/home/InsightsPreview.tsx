import { ExternalLink } from 'lucide-react';
import { Container } from '../Container';
import { SectionHeading } from '../SectionHeading';
import { ButtonLink } from '../Button';
import { Reveal } from './Reveal';
import { usePresentationMode } from '../../lib/presentation';
import { getVisibleInsights, insightDateLabel } from '../../lib/insights';
import { getVisibleLawyers } from '../../lib/people';
import { safeExternalUrl } from '../../lib/expertise';
import { insightCategoryLabel } from '../../data/insight-categories';

export function InsightsPreview() {
  const mode = usePresentationMode();
  const publications = getVisibleInsights(mode).slice(0, 2);
  const people = getVisibleLawyers(mode);
  return <section className="home-section home-insights" aria-labelledby="insights-heading"><Container>
    <Reveal className="home-section-heading"><SectionHeading id="insights-heading" eyebrow="Insights & perspectives" title="Thinking beyond the immediate."><p>Selected writing from our publication archive.</p></SectionHeading><ButtonLink to="/insights" variant="outline" arrow>Explore Insights</ButtonLink></Reveal>
    {publications.length > 0 ? <div className="publication-grid">{publications.map((publication, index) => {
      const url = safeExternalUrl(publication.externalUrl);
      const authors = people.filter(person => publication.authorIds.includes(person.id));
      return <Reveal key={publication.id}><article className={`publication-card publication-card--${index + 1}`}><div className="publication-card__meta"><span>{insightCategoryLabel(publication.type)}</span><span>Archive · {insightDateLabel(publication)}</span></div><h3>{url ? <a href={url} target="_blank" rel="noopener noreferrer">{publication.name}<span className="sr-only"> (opens publisher in a new tab)</span></a> : publication.name}</h3>{publication.subtitle && <p className="publication-card__subtitle">{publication.subtitle}</p>}<div className="publication-card__footer"><div>{authors.map(person => <p key={person.id}>{person.name}</p>)}<span>{publication.publisher}</span></div>{url && <a href={url} target="_blank" rel="noopener noreferrer" className="publication-card__external" aria-label={`Read ${publication.name} at ${publication.publisher ?? 'the publisher'} (opens in a new tab)`}><ExternalLink size={19} aria-hidden="true" /></a>}</div><p className="publication-card__note">{publication.publisherNote}</p></article></Reveal>;
    })}</div> : <p className="home-section-note">Publications will appear here following publication approval.</p>}
    {publications.length > 0 && <p className="home-section-note">Archive publications reflect the law at the time of writing.</p>}
  </Container></section>;
}
