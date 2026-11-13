import type { SeoFields } from '../types/content';
// Add only reviewed metadata, keyed by an existing route. Slugs and content
// remain in their structured records; no CMS or duplicate route registry.
export const pageSeoOverrides: Record<string, SeoFields> = {};
