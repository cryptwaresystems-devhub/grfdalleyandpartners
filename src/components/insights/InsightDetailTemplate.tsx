import { usePresentationMode } from '../../lib/presentation';
import { Link } from 'react-router-dom';
import type { Insight } from '../../types/content';
import { PageHeader } from '../PageHeader';
import { Container } from '../Container';
import { PreviewNotice } from '../PreviewNotice';
import { getVisibleLawyers } from '../../lib/people';
import { insightDateLabel } from '../../lib/insights';
import { getExpertiseCategories, safeExternalUrl } from '../../lib/expertise';
import { isPublished } from '../../lib/publication';
import { insightCategoryLabel } from '../../data/insight-categories';
export function InsightDetailTemplate({ insight }: { insight: Insight }) {
  const mode = usePresentationMode();
  const authors = getVisibleLawyers(mode).filter(person => insight.authorIds.includes(person.id));
  const practices = getExpertiseCategories('practice').filter(item => insight.practiceIds.includes(item.id));
  const industries = getExpertiseCategories('industry').filter(item => insight.industryIds.includes(item.id));
  const url = safeExternalUrl(insight.externalUrl);
  const bodyPublished = Boolean(insight.bodyEditorial && isPublished({ ...insight, editorial: insight.bodyEditorial }));
  return <><PageHeader title={insight.name} eyebrow={insightCategoryLabel(insight.type)} breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Insights', to: '/insights' }, { label: insight.name }]} /><Container>
    {!isPublished(insight) && <PreviewNotice title="Archive preview">Publisher-verified metadata is shown for review. No unapproved article body is reproduced.</PreviewNotice>}
    <div className="insight-detail-layout section-space"><article className="insight-detail-body"><p className="eyebrow">Archive · <time dateTime={insight.date}>{insightDateLabel(insight)}</time></p>{insight.subtitle && <h2>{insight.subtitle}</h2>}
      {isPublished(insight) && bodyPublished && insight.body ? <div className="insight-body-copy">{insight.body.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div> : <><h2>Read the original publication.</h2><p>This archive entry links to the original publisher. It reflects the law at the time of writing.</p></>}
      {url && <a className="button button--primary" href={url} target="_blank" rel="noopener noreferrer">Read at {insight.publisher ?? 'the publisher'}<span className="sr-only"> (opens in a new tab)</span></a>}{insight.publisherNote && <p className="directory-note">{insight.publisherNote}</p>}<Link to="/insights" className="detail-back">Return to all insights</Link>
    </article><aside className="insight-detail-aside" aria-label="Publication context">{authors.length > 0 && <section><h2>Author{authors.length > 1 ? 's' : ''}</h2>{authors.map(person => <Link key={person.id} to={`/people/${person.slug}`}>{person.name}</Link>)}</section>}{practices.length > 0 && <section><h2>Related practices</h2>{practices.map(item => <Link key={item.id} to={`/practices/${item.slug}`}>{item.name}</Link>)}</section>}{industries.length > 0 && <section><h2>Related industries</h2>{industries.map(item => <Link key={item.id} to={`/industries/${item.slug}`}>{item.name}</Link>)}</section>}<section><h2>Discuss an enquiry</h2><Link to="/contact">Contact the firm</Link></section></aside></div>
  </Container></>;
}
