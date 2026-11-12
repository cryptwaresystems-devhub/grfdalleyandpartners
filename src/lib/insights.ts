import { insights } from '../data/insights';
import { isPublished } from './publication';
import { safeExternalUrl } from './expertise';
import { normaliseSearch, type PresentationMode } from './people';
import type { Insight, InsightType } from '../types/content';
export function getVisibleInsights(mode: PresentationMode = 'approved-only', records = insights, now = new Date()) {
  return records.filter(record => isPublished(record, now) || (mode === 'management-preview' && record.editorial.status === 'in-review' && record.verification?.status === 'publisher-verified' && safeExternalUrl(record.externalUrl) !== null && record.verification.sourceUrl === record.externalUrl));
}
export function filterInsights(records: Insight[], category: InsightType | 'all', query = '') {
  const text = normaliseSearch(query);
  return records.filter(item => (category === 'all' || item.type === category) && normaliseSearch(`${item.name} ${item.publisher ?? ''}`).includes(text));
}
export function insightDateLabel(record: Insight) {
  if (record.datePrecision === 'year' || /^\d{4}$/.test(record.date)) return record.date;
  if (record.datePrecision === 'month' || /^\d{4}-\d{2}$/.test(record.date)) {
    const date = new Date(`${record.date}-01T12:00:00Z`);
    return Number.isNaN(date.getTime()) ? 'Publication date pending' : new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
  }
  const date = new Date(`${record.date.slice(0, 10)}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? 'Publication date pending' : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}
