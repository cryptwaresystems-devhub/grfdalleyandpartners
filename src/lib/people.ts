import { lawyers } from '../data/lawyers';
import type { Lawyer } from '../types/content';
import { isPublished } from './publication';
export type PresentationMode = 'approved-only' | 'management-preview';
export function getVisibleLawyers(mode: PresentationMode = 'approved-only', records = lawyers, now = new Date()) {
  return records.filter(record => isPublished(record, now) || (mode === 'management-preview' && record.editorial.status === 'in-review' && record.verification?.status === 'source-checked'));
}
export const normaliseSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('en').replace(/\s+/g, ' ').trim();
export function searchLawyers(records: Lawyer[], query: string) {
  const terms = normaliseSearch(query).split(' ').filter(Boolean);
  return records.filter(person => {
    const text = normaliseSearch([person.name, person.role, ...person.practiceNames ?? [], person.officeId?.replaceAll('-', ' ') ?? ''].join(' '));
    return terms.every(term => text.includes(term));
  });
}
