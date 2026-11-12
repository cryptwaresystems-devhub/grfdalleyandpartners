import type { ContentRecord } from '../types/content';
export function isPublished(record: ContentRecord, now = new Date()): boolean {
 const { status, approvedBy, approvedAt, publishedAt } = record.editorial;
 if (status !== 'approved' || !approvedBy?.trim() || !approvedAt || !publishedAt) return false;
 const approval = Date.parse(approvedAt), publication = Date.parse(publishedAt);
 return Number.isFinite(approval) && Number.isFinite(publication) && approval <= publication && publication <= now.getTime();
}
export function publishedOnly<T extends ContentRecord>(records: readonly T[], now = new Date()): T[] {
 return records.filter(record => isPublished(record, now));
}
