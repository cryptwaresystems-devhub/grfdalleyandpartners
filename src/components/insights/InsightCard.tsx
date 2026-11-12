import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Insight } from '../../types/content';
import { insightCategoryLabel } from '../../data/insight-categories';
import { getInsightContext, insightDateLabel } from '../../lib/insights';
import { usePresentationMode } from '../../lib/presentation';
export function InsightCard({ insight }: { insight: Insight }) {
  const context = getInsightContext(insight, usePresentationMode());
  return <article className="insight-list-card"><div className="insight-list-card__meta"><span>{insightCategoryLabel(insight.type)}</span><time dateTime={insight.date}>{insight.archive ? 'Archive · ' : ''}{insightDateLabel(insight)}</time></div><h2><Link to={`/insights/${insight.slug}`}>{insight.name}</Link></h2>{insight.subtitle && <p>{insight.subtitle}</p>}
    <div className="insight-card-context">{context.authors.length > 0 && <p className="insight-card-authors"><span>By </span>{context.authors.map((person, index) => <span key={person.id}>{index > 0 ? ', ' : ''}<Link to={`/people/${person.slug}`}>{person.name}</Link></span>)}</p>}{context.practices.length > 0 && <ul aria-label="Practice areas">{context.practices.map(item => <li key={item.id}><Link to={`/practices/${item.slug}`}>{item.name}</Link></li>)}</ul>}{context.industries.length > 0 && <ul aria-label="Industries">{context.industries.map(item => <li key={item.id}><Link to={`/industries/${item.slug}`}>{item.name}</Link></li>)}</ul>}</div>
    <div className="insight-list-card__bottom"><span>{insight.publisher}</span><Link to={`/insights/${insight.slug}`} aria-label={`View insight: ${insight.name}`}><ArrowUpRight size={21} aria-hidden="true" /></Link></div></article>;
}
