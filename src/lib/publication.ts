import type { ContentRecord } from '../types/content';
export function isPublished(record: ContentRecord, now = new Date()): boolean {
 const { status, approvedBy, approvedAt, authorizedBy, authorizedAt, publishedAt } = record.editorial;
 const reviewer = status === 'authorized' ? authorizedBy : approvedBy;
 const reviewDate = status === 'authorized' ? authorizedAt : approvedAt;
 if (!['approved', 'authorized'].includes(status) || !reviewer?.trim() || !reviewDate || !publishedAt) return false;
 const approval = Date.parse(reviewDate), publication = Date.parse(publishedAt);
 return Number.isFinite(approval) && Number.isFinite(publication) && approval <= publication && publication <= now.getTime();
}
export function publishedOnly<T extends ContentRecord>(records: readonly T[], now = new Date()): T[] {
 return records.filter(record => isPublished(record, now));
}
