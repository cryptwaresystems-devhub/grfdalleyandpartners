import { lawyers } from '../data/lawyers';
import type { Lawyer } from '../types/content';
import { isPublished } from './publication';
import type { PresentationMode } from './presentation';
export type { PresentationMode } from './presentation';
export function getVisibleLawyers(mode: PresentationMode = 'approved-only', records = lawyers, now = new Date()) {
  return records.filter(record => isPublished(record, now) || (mode === 'management-preview' && record.editorial.status === 'in-review' && record.verification?.status === 'source-checked'));
}
export function getLeadershipPreview(mode: PresentationMode = 'approved-only') {
  return getVisibleLawyers(mode).filter(person => /partner/i.test(person.role) && person.portrait).map(person => ({
    ...person, image: person.portrait!, objectPosition: '50% 30%',
  }));
}
export const normaliseSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('en').replace(/\s+/g, ' ').trim();
export function searchLawyers(records: Lawyer[], query: string, practices: { id: string; name: string }[] = []) {
  const terms = normaliseSearch(query).split(' ').filter(Boolean);
  return records.filter(person => {
    const text = normaliseSearch([person.name, person.role, ...person.practiceNames ?? [], ...practices.filter(practice => person.practiceIds.includes(practice.id)).map(practice => practice.name), person.officeId?.replaceAll('-', ' ') ?? ''].join(' '));
    return terms.every(term => text.includes(term));
  });
}
export function filterLawyers(records: Lawyer[], query: string, practiceId = 'all', practices: { id: string; name: string }[] = []) {
  return searchLawyers(records, query, practices).filter(person => practiceId === 'all' || person.practiceIds.includes(practiceId));
}
export function linkedinProfileUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['linkedin.com', 'www.linkedin.com'].includes(url.hostname) && /^\/in\/[^/]+\/?$/.test(url.pathname) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
export function professionalEmailHref(value: string | null) {
  return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? `mailto:${encodeURIComponent(value)}` : null;
}
