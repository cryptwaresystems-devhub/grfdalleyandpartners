import { test } from 'node:test';
import assert from 'node:assert/strict';
import { industries } from '../src/data/industries';
import { practices } from '../src/data/practices';
import { lawyers } from '../src/data/lawyers';
import { insights } from '../src/data/insights';
import { offices } from '../src/data/offices';
import { isPublished, publishedOnly } from '../src/lib/publication';
import type { ContentRecord } from '../src/types/content';
test('confirmed taxonomy counts and unique IDs', () => {
 assert.equal(industries.length, 15); assert.equal(practices.length, 21);
 for (const collection of [industries, practices, lawyers, offices]) assert.equal(new Set(collection.map(x => x.id)).size, collection.length);
});
test('supplied content remains unpublished pending approval', () => {
 assert.equal(publishedOnly([...industries, ...practices, ...lawyers, ...insights, ...offices]).length, 0);
});
test('publication gate validates approval, ordering and scheduling', () => {
 const record: ContentRecord = { id: 'example', slug: 'example', name: 'Example', editorial: { status: 'approved', source: 'test fixture', approvedBy: 'Reviewer', approvedAt: '2026-11-01', publishedAt: '2026-11-02' } };
 const now = new Date('2026-11-12');
 assert.equal(isPublished(record, now), true);
 for (const change of [{status: 'draft' as const}, {approvedBy: ''}, {approvedAt: 'invalid'}, {publishedAt: 'invalid'}, {publishedAt: '2027-01-01'}, {approvedAt: '2026-11-03'}]) {
 assert.equal(isPublished({...record, editorial: {...record.editorial, ...change}}, now), false);
 }
});
