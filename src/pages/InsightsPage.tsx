import { isPublished } from '../lib/publication';
import { usePresentationMode } from '../lib/presentation';
import { useState } from 'react';
import type { InsightType } from '../types/content';
import { PageHeader } from '../components/PageHeader';
import { Container } from '../components/Container';
import { PreviewNotice } from '../components/PreviewNotice';
import { InsightCard } from '../components/insights/InsightCard';
import { insightCategories } from '../data/insight-categories';
import { filterInsights, getVisibleInsights } from '../lib/insights';

export function InsightsPage() {
  const mode = usePresentationMode();
  const [category, setCategory] = useState<InsightType | 'all'>('all');
  const records = getVisibleInsights(mode);
  const results = filterInsights(records, category);
  return <><PageHeader title="Perspectives with context." eyebrow="Insights" description="Explore the firm’s publication archive and content categories." breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Insights' }]} /><Container>{records.some(item => !isPublished(item)) && <PreviewNotice title="Archive preview">Publication titles, authors and historic dates have been checked at source. Final site approval remains pending.</PreviewNotice>}<section className="insights-directory section-space" aria-label="Insights archive"><div className="insight-category-filters" role="group" aria-label="Filter insights by category">{[{ value: 'all' as const, label: 'All insights' }, ...insightCategories].map(item => <button key={item.value} type="button" aria-pressed={category === item.value} onClick={() => setCategory(item.value)}>{item.label}</button>)}</div><p className="listing-count" role="status" aria-live="polite">{results.length} {results.length === 1 ? 'entry' : 'entries'}</p>
    {results.length ? <div className="insights-list-grid">{results.map(insight => <InsightCard key={insight.id} insight={insight} />)}</div> : <div className="listing-empty"><h2>More perspectives to come.</h2><p>No entries are available in this category yet.</p><button className="button button--outline" type="button" onClick={() => setCategory('all')}>View all insights</button></div>}<p className="directory-note">Archive publications reflect the law at the time of writing. No recent publication date is implied.</p>
  </section></Container></>;
}
