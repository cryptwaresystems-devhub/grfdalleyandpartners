import type { InsightType } from '../types/content';
export const insightCategories: { value: InsightType; label: string }[] = [
  { value: 'article', label: 'Articles' }, { value: 'case-review', label: 'Case reviews' },
  { value: 'external-publication', label: 'External publications' }, { value: 'news', label: 'Firm news' },
  { value: 'event', label: 'Events' }, { value: 'video', label: 'Videos' }, { value: 'award', label: 'Awards' },
];
export const insightCategoryLabel = (type: InsightType) => insightCategories.find(item => item.value === type)?.label ?? 'Awards';
