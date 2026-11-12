import { insights } from '../data/insights';
import { isPublished } from './publication';
import { getExpertiseCategories, safeExternalUrl } from './expertise';
import { getVisibleLawyers, normaliseSearch, type PresentationMode } from './people';
import type { Insight, InsightType, Lawyer, Expertise } from '../types/content';
export interface InsightFilters { query?: string; category?: string; authorId?: string; practiceId?: string; industryId?: string; }
export interface InsightLookup { people: Lawyer[]; practices: Expertise[]; industries: Expertise[]; }
const emptyLookup: InsightLookup = { people: [], practices: [], industries: [] };
export function getInsightLookup(mode: PresentationMode): InsightLookup {
  return { people: getVisibleLawyers(mode), practices: getExpertiseCategories('practice'), industries: getExpertiseCategories('industry') };
}
export function getInsightContext(record: Insight, mode: PresentationMode) {
  const lookup = getInsightLookup(mode);
  return { authors: lookup.people.filter(item => record.authorIds.includes(item.id)), practices: lookup.practices.filter(item => record.practiceIds.includes(item.id)), industries: lookup.industries.filter(item => record.industryIds.includes(item.id)) };
}
export function getVisibleInsights(mode: PresentationMode = 'approved-only', records = insights, now = new Date()) {
  return records.filter(record => isPublished(record, now) || (mode === 'management-preview' && record.editorial.status === 'in-review' && record.verification?.status === 'publisher-verified' && safeExternalUrl(record.externalUrl) !== null && record.verification.sourceUrl === record.externalUrl));
}
export function filterInsights(records: Insight[], category: InsightType | 'all', query = '') {
  return filterInsightRecords(records, { category, query });
}
export function filterInsightRecords(records: Insight[], filters: InsightFilters, lookup: InsightLookup = emptyLookup) {
  const terms = normaliseSearch(filters.query ?? '').split(' ').filter(Boolean);
  const matches = (selected: string | undefined, ids: string[]) => !selected || selected === 'all' || ids.includes(selected);
  return records.filter(item => {
    if (filters.category && filters.category !== 'all' && item.type !== filters.category) return false;
    if (!matches(filters.authorId, item.authorIds) || !matches(filters.practiceId, item.practiceIds) || !matches(filters.industryId, item.industryIds)) return false;
    const body = isPublished(item) && item.bodyEditorial && isPublished({ ...item, editorial: item.bodyEditorial }) ? item.body : '';
    const text = normaliseSearch([item.name, item.subtitle ?? '', item.publisher ?? '', item.date, insightDateLabel(item), item.type.replaceAll('-', ' '), body,
      ...lookup.people.filter(person => item.authorIds.includes(person.id)).map(person => person.name),
      ...lookup.practices.filter(practice => item.practiceIds.includes(practice.id)).map(practice => practice.name),
      ...lookup.industries.filter(industry => item.industryIds.includes(industry.id)).map(industry => industry.name)].join(' '));
    return terms.every(term => text.includes(term));
  });
}
export function insightFilterOptions(records: Insight[], lookup: InsightLookup) {
  const withCounts = <T extends { id: string; name: string }>(items: T[], getIds: (record: Insight) => string[]) => items.map(item => ({ id: item.id, name: item.name, count: records.filter(record => getIds(record).includes(item.id)).length })).filter(item => item.count > 0);
  return { authors: withCounts(lookup.people, item => item.authorIds), practices: withCounts(lookup.practices, item => item.practiceIds), industries: withCounts(lookup.industries, item => item.industryIds) };
}
export function approvedVideoUrl(video: Insight['video'], now = new Date()) {
  if (!video || !video.title.trim() || !isPublished({ id: video.id, slug: video.id, name: video.title, editorial: video.editorial }, now)) return null;
  if (video.provider === 'youtube' && /^[a-zA-Z0-9_-]{11}$/.test(video.id)) return `https://www.youtube-nocookie.com/embed/${video.id}`;
  if (video.provider === 'vimeo' && /^\d{6,12}$/.test(video.id)) return `https://player.vimeo.com/video/${video.id}`;
  return null;
}
export function insightDateLabel(record: Insight) {
  if (record.datePrecision === 'year' || /^\d{4}$/.test(record.date)) return /^\d{4}$/.test(record.date) ? record.date : 'Publication date pending';
  if (record.datePrecision === 'month' || /^\d{4}-\d{2}$/.test(record.date)) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(record.date)) return 'Publication date pending';
    const date = new Date(`${record.date}-01T12:00:00Z`);
    return Number.isNaN(date.getTime()) ? 'Publication date pending' : new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date)) return 'Publication date pending';
  const date = new Date(`${record.date}T12:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== record.date ? 'Publication date pending' : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}
