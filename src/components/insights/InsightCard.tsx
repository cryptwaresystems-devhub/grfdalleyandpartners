import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Insight } from '../../types/content';
import { insightCategoryLabel } from '../../data/insight-categories';
import { insightDateLabel } from '../../lib/insights';
export function InsightCard({ insight }: { insight: Insight }) {
  return <article className="insight-list-card"><div className="insight-list-card__meta"><span>{insightCategoryLabel(insight.type)}</span><span>Archive · {insightDateLabel(insight)}</span></div><h2><Link to={`/insights/${insight.slug}`}>{insight.name}</Link></h2>{insight.subtitle && <p>{insight.subtitle}</p>}<div className="insight-list-card__bottom"><span>{insight.publisher}</span><Link to={`/insights/${insight.slug}`} aria-label={`View archive entry: ${insight.name}`}><ArrowUpRight size={21} aria-hidden="true" /></Link></div></article>;
}
