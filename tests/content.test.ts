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
test('requester-authorized content is visible while unconfirmed office records stay unpublished', () => {
 assert.equal(publishedOnly([...industries, ...practices, ...lawyers, ...insights]).length, 47);
 assert.equal(publishedOnly(offices).length, 0);
});
test('publication gate validates approval, ordering and scheduling', () => {
 const record: ContentRecord = { id: 'example', slug: 'example', name: 'Example', editorial: { status: 'approved', source: 'test fixture', approvedBy: 'Reviewer', approvedAt: '2026-11-01', publishedAt: '2026-11-02' } };
 const now = new Date('2026-11-12');
 assert.equal(isPublished(record, now), true);
 for (const change of [{status: 'draft' as const}, {approvedBy: ''}, {approvedAt: 'invalid'}, {publishedAt: 'invalid'}, {publishedAt: '2027-01-01'}, {approvedAt: '2026-11-03'}]) {
 assert.equal(isPublished({...record, editorial: {...record.editorial, ...change}}, now), false);
 }
});

 test('requester authorization is explicit and rejects missing or future authorization metadata', () => {
  const record = practices[0];
  assert.equal(record.editorial.status, 'authorized');
  assert.equal(isPublished(record), true);
  for (const change of [{ authorizedBy: '' }, { authorizedAt: 'invalid' }, { publishedAt: '2099-01-01' }, { status: 'in-review' as const }]) {
    assert.equal(isPublished({ ...record, editorial: { ...record.editorial, ...change } }), false);
  }
 });
