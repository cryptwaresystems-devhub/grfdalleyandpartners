import { useRef } from 'react';
import { Search } from 'lucide-react';
import { isPublished } from '../lib/publication';
import { usePresentationMode } from '../lib/presentation';
import { useDirectoryQuery } from '../lib/directory-query';
import { paginate } from '../lib/pagination';
import { PageHeader } from '../components/PageHeader';
import { Container } from '../components/Container';
import { PreviewNotice } from '../components/PreviewNotice';
import { DirectorySelect } from '../components/DirectorySelect';
import { Pagination } from '../components/Pagination';
import { InsightCard } from '../components/insights/InsightCard';
import { insightCategories } from '../data/insight-categories';
import { filterInsightRecords, getVisibleInsights, insightFilterOptions, getInsightLookup } from '../lib/insights';

export function InsightsPage({ pageSize = 6 }: { pageSize?: number }) {
  const mode = usePresentationMode();
  const { params, update, reset } = useDirectoryQuery();
  const query = params.get('q') ?? '';
  const category = params.get('category') ?? 'all';
  const authorId = params.get('author') ?? 'all';
  const practiceId = params.get('practice') ?? 'all';
  const industryId = params.get('industry') ?? 'all';
  const records = getVisibleInsights(mode);
  const lookup = getInsightLookup(mode);
  const options = insightFilterOptions(records, lookup);
  const results = filterInsightRecords(records, { query, category, authorId, practiceId, industryId }, lookup).sort((a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name));
  const pagination = paginate(results, params.get('page'), pageSize);
  const resultStatus = useRef<HTMLParagraphElement>(null);
  const active = Boolean(query || [category, authorId, practiceId, industryId].some(value => value !== 'all'));
  function changePage(page: number) { update({ page: String(page) }); queueMicrotask(() => resultStatus.current?.focus({ preventScroll: true })); }
  return <><PageHeader title="Perspectives with context." eyebrow="Insights" description="Explore the firm's publications and perspectives by topic, practice or author." breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Insights' }]} /><Container>{records.some(item => !isPublished(item)) && <PreviewNotice title="Archive preview">Publication titles, authors and historic dates have been checked at source. Final site approval remains pending.</PreviewNotice>}<section className="insights-directory section-space" aria-label="Insights archive">
    <div className="directory-controls insights-search"><div className="search-field"><label htmlFor="insights-search">Search insights</label><div><Search size={18} aria-hidden="true" /><input id="insights-search" type="search" value={query} onChange={event => update({ q: event.target.value })} placeholder="Search titles, authors or topics" autoComplete="off" /></div></div>{active && <button className="directory-reset" type="button" onClick={reset}>Clear filters</button>}</div>
    <div className="insight-category-filters" role="group" aria-label="Filter insights by category">{[{ value: 'all' as const, label: 'All insights' }, ...insightCategories].map(item => <button key={item.value} type="button" aria-pressed={category === item.value} onClick={() => update({ category: item.value })}>{item.label}</button>)}</div>
    <div className="insight-refine-grid"><DirectorySelect id="insights-author" label="Author" allLabel="All authors" value={authorId} options={options.authors} onChange={value => update({ author: value })} /><DirectorySelect id="insights-practice" label="Practice area" allLabel="All practice areas" value={practiceId} options={options.practices} onChange={value => update({ practice: value })} /><DirectorySelect id="insights-industry" label="Industry" allLabel="All industries" value={industryId} options={options.industries} onChange={value => update({ industry: value })} /></div>
    <p className="listing-count" id="insights-results-status" ref={resultStatus} tabIndex={-1} role="status" aria-live="polite">{results.length} {results.length === 1 ? 'entry' : 'entries'}{pagination.pages > 1 ? ` · Showing ${pagination.first}–${pagination.last}` : ''}</p>
    <div id="insights-results">{results.length ? <div className="insights-list-grid">{pagination.items.map(insight => <InsightCard key={insight.id} insight={insight} />)}</div> : <div className="listing-empty"><h2>{active ? 'No matching insights.' : 'More perspectives to come.'}</h2><p>{active ? 'Try another search or combination of filters. Only available publication records are listed.' : 'New entries will appear when publication material is supplied.'}</p><button className="button button--outline" type="button" onClick={reset}>View all insights</button></div>}</div>
    <Pagination page={pagination.page} pages={pagination.pages} onChange={changePage} /><p className="directory-note">Archive publications reflect the law at the time of writing. No recent publication date is implied.</p>
  </section></Container></>;
}
