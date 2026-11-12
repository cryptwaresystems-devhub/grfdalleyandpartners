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
export function searchLawyers(records: Lawyer[], query: string) {
  const terms = normaliseSearch(query).split(' ').filter(Boolean);
  return records.filter(person => {
    const text = normaliseSearch([person.name, person.role, ...person.practiceNames ?? [], person.officeId?.replaceAll('-', ' ') ?? ''].join(' '));
    return terms.every(term => text.includes(term));
  });
}
