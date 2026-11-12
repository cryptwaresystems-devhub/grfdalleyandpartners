import { ExternalLink } from 'lucide-react';
import { Container } from '../Container';
import { SectionHeading } from '../SectionHeading';
import { ButtonLink } from '../Button';
import { Reveal } from './Reveal';
import { verifiedPublications } from '../../data/homepage';

export function InsightsPreview() {
  return <section className="home-section home-insights" aria-labelledby="insights-heading"><Container>
    <Reveal className="home-section-heading"><SectionHeading id="insights-heading" eyebrow="Insights & perspectives" title="Thinking beyond the immediate."><p>Selected writing from our publication archive.</p></SectionHeading><ButtonLink to="/insights" variant="outline" arrow>Explore Insights</ButtonLink></Reveal>
    <div className="publication-grid">{verifiedPublications.map((publication, index) => <Reveal key={publication.id}><article className={`publication-card publication-card--${index + 1}`}><div className="publication-card__meta"><span>{publication.category}</span><span>Archive · {publication.year}</span></div><h3><a href={publication.url} target="_blank" rel="noopener noreferrer">{publication.title}<span className="sr-only"> (opens publisher in a new tab)</span></a></h3>{publication.subtitle && <p className="publication-card__subtitle">{publication.subtitle}</p>}<div className="publication-card__footer"><div><p>{publication.author}</p><span>{publication.publisher}</span></div><a href={publication.url} target="_blank" rel="noopener noreferrer" className="publication-card__external" aria-label={`Read ${publication.title} at ${publication.publisher} (opens in a new tab)`}><ExternalLink size={19} aria-hidden="true" /></a></div><p className="publication-card__note">{publication.publisherNote}</p></article></Reveal>)}</div>
    <p className="home-section-note">Archive publications reflect the law at the time of writing.</p>
  </Container></section>;
}
