import { usePresentationMode } from '../../lib/presentation';
import { Link } from 'react-router-dom';
import type { Insight } from '../../types/content';
import { PageHeader } from '../PageHeader';
import { Container } from '../Container';
import { PreviewNotice } from '../PreviewNotice';
import { ApprovedVideo } from './ApprovedVideo';
import { approvedVideoUrl, getInsightContext, getVisibleInsights, insightDateLabel } from '../../lib/insights';
import { safeExternalUrl } from '../../lib/expertise';
import { isPublished } from '../../lib/publication';
import { insightCategoryLabel } from '../../data/insight-categories';

function eventTime(value: string) {
  if (!Number.isFinite(Date.parse(value))) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
  if (!/(Z|[+-]\d{2}:\d{2})$/.test(value)) return null;
  return `${new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(value))} UTC`;
}
export function InsightDetailTemplate({ insight }: { insight: Insight }) {
  const mode = usePresentationMode();
  const { authors, practices, industries } = getInsightContext(insight, mode);
  const url = safeExternalUrl(insight.externalUrl);
  const published = isPublished(insight);
  const bodyPublished = Boolean(published && insight.bodyEditorial && isPublished({ ...insight, editorial: insight.bodyEditorial }));
  const event = published && insight.event && eventTime(insight.event.startsAt) ? insight.event : null;
  const registration = event ? safeExternalUrl(event.registrationUrl) : null;
  const related = getVisibleInsights(mode).filter(item => item.id !== insight.id && (item.authorIds.some(id => insight.authorIds.includes(id)) || item.practiceIds.some(id => insight.practiceIds.includes(id)) || item.industryIds.some(id => insight.industryIds.includes(id)))).slice(0, 3);
  return <><PageHeader title={insight.name} eyebrow={insightCategoryLabel(insight.type)} breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Insights', to: '/insights' }, { label: insight.name }]} /><Container>
    {!published && <PreviewNotice title="Archive preview">Publisher-verified metadata is shown for review. No unapproved article body is reproduced.</PreviewNotice>}
    <div className="insight-detail-layout section-space"><article className="insight-detail-body"><p className="eyebrow">{insight.archive ? 'Archive · ' : ''}<time dateTime={insight.date}>{insightDateLabel(insight)}</time></p>{insight.subtitle && <h2>{insight.subtitle}</h2>}
      <ApprovedVideo insight={insight} />
      {event && <section className="insight-event" aria-label="Event details"><h2>Event details</h2><dl><div><dt>Starts</dt><dd><time dateTime={event.startsAt}>{eventTime(event.startsAt)}</time></dd></div>{event.endsAt && eventTime(event.endsAt) && <div><dt>Ends</dt><dd><time dateTime={event.endsAt}>{eventTime(event.endsAt)}</time></dd></div>}{event.location && <div><dt>Location</dt><dd>{event.location}</dd></div>}</dl>{registration && <a href={registration} className="button button--outline" target="_blank" rel="noopener noreferrer">Event registration<span className="sr-only"> (opens in a new tab)</span></a>}</section>}
      {bodyPublished && insight.body ? <div className="insight-body-copy">{insight.body.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div> : url ? <><h2>Read the original publication.</h2><p>{insight.archive ? 'This archive entry links to the original publisher. It reflects the law at the time of writing.' : 'Read the full publication at its original source.'}</p></> : !approvedVideoUrl(insight.video) && !event ? <p>Further publication details will be available when supplied. <Link to="/contact">Contact the firm</Link> for more information.</p> : null}
      {url && <a className="button button--primary" href={url} target="_blank" rel="noopener noreferrer">Read at {insight.publisher ?? 'the publisher'}<span className="sr-only"> (opens in a new tab)</span></a>}{insight.publisherNote && <p className="directory-note">{insight.publisherNote}</p>}<Link to="/insights" className="detail-back">Return to all insights</Link>
    </article><aside className="insight-detail-aside" aria-label="Publication context">{authors.length > 0 && <section><h2>Author{authors.length > 1 ? 's' : ''}</h2>{authors.map(person => <Link key={person.id} to={`/people/${person.slug}`}>{person.name}</Link>)}</section>}{practices.length > 0 && <section><h2>Related practices</h2>{practices.map(item => <Link key={item.id} to={`/practices/${item.slug}`}>{item.name}</Link>)}</section>}{industries.length > 0 && <section><h2>Related industries</h2>{industries.map(item => <Link key={item.id} to={`/industries/${item.slug}`}>{item.name}</Link>)}</section>}<section><h2>Discuss an enquiry</h2><Link to="/contact">Contact the firm</Link></section></aside></div>
    {related.length > 0 && <section className="related-insights-section" aria-labelledby="related-insights-heading"><h2 id="related-insights-heading">Related perspectives</h2><ul>{related.map(item => <li key={item.id}><Link to={`/insights/${item.slug}`}>{item.name}</Link><span>{insightDateLabel(item)}</span></li>)}</ul></section>}
  </Container></>;
}
