import type { Expertise, ExpertiseKind, Lawyer, Insight, Matter, Publication } from '../types/content';
import { industries } from '../data/industries';
import { practices } from '../data/practices';
import { lawyers } from '../data/lawyers';
import { insights } from '../data/insights';
import { matters } from '../data/matters';
import { publications } from '../data/publications';
import { isPublished, publishedOnly } from './publication';

export interface ExpertiseData { industries: Expertise[]; practices: Expertise[]; lawyers: Lawyer[]; insights: Insight[]; matters: Matter[]; publications: Publication[] }
export const expertiseData: ExpertiseData = { industries, practices, lawyers, insights, matters, publications };
export const expertiseBase = (kind: ExpertiseKind) => kind === 'industry' ? '/industries' : '/practices';
export const expertiseLabel = (kind: ExpertiseKind) => kind === 'industry' ? 'Industry' : 'Practice';
export function isCategoryVisible(record: Expertise, now = new Date()) {
  return record.labelApproval?.status === 'confirmed' || isPublished(record, now);
}
export function getExpertiseCategories(kind: ExpertiseKind, data = expertiseData, now = new Date()) {
  return (kind === 'industry' ? data.industries : data.practices).filter(record => isCategoryVisible(record, now));
}
export function getExpertiseDetail(kind: ExpertiseKind, slug: string, data = expertiseData, now = new Date()) {
  const categories = getExpertiseCategories(kind, data, now);
  const index = categories.findIndex(record => record.slug === slug);
  const record = categories[index];
  if (!record) return null;
  const sourcePublished = isPublished(record, now);
  const links = sourcePublished ? record.relationships ?? {} : {};
  const legacyIds = sourcePublished ? record.relatedIds : [];
  const otherKind: ExpertiseKind = kind === 'industry' ? 'practice' : 'industry';
  const linkedExpertiseIds = kind === 'industry' ? links.practiceIds : links.industryIds;
  const connected = getExpertiseCategories(otherKind, data, now).filter(item => [...linkedExpertiseIds ?? [], ...legacyIds].includes(item.id)
    || (isPublished(item, now) && ((kind === 'industry' ? item.relationships?.industryIds : item.relationships?.practiceIds)?.includes(record.id) || item.relatedIds.includes(record.id))));
  const matches = (item: { practiceIds: string[]; industryIds: string[] }) => (kind === 'industry' ? item.industryIds : item.practiceIds).includes(record.id);
  return {
    record, kind, otherKind, connected,
    summary: isPublished(record, now) ? record.summary : null,
    lawyers: publishedOnly(data.lawyers, now).filter(item => links.lawyerIds?.includes(item.id) || (kind === 'practice' && item.practiceIds.includes(record.id))),
    insights: publishedOnly(data.insights, now).filter(item => links.insightIds?.includes(item.id) || matches(item)),
    matters: publishedOnly(data.matters, now).filter(item => links.matterIds?.includes(item.id) || matches(item)),
    publications: publishedOnly(data.publications, now).filter(item => links.publicationIds?.includes(item.id) || matches(item)),
    previous: categories[index - 1], next: categories[index + 1],
  };
}
export type ExpertiseDetail = NonNullable<ReturnType<typeof getExpertiseDetail>>;
export function safeExternalUrl(value?: string) {
  if (!value) return null;
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}
