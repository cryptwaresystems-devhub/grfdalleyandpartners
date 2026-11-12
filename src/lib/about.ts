import type { AboutContent } from '../types/content';
import type { PresentationMode } from './presentation';
import { isPublished } from './publication';

export function getAboutContent(record: AboutContent, mode: PresentationMode = 'approved-only', now = new Date()) {
  return isPublished(record, now) || (mode === 'management-preview' && record.editorial.status === 'in-review') ? record : null;
}
