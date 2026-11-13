import type { ContentRecord, SeoFields } from '../types/content';
import { isPublished } from './publication';
export function publishedSeo(fields: SeoFields | undefined) {
  if (!fields || !isPublished({ id: 'seo', slug: 'seo', name: 'SEO metadata', editorial: fields.editorial })) return null;
  const clean = (value?: string) => value?.replace(/\s+/g, ' ').trim() || undefined;
  return { title: clean(fields.title), description: clean(fields.description), imageAlt: clean(fields.imageAlt) };
}
export function recordSeo(record: ContentRecord) { return isPublished(record) ? publishedSeo(record.seo) : null; }
