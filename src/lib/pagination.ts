export function paginate<T>(records: readonly T[], requestedPage: string | number | null, size = 6) {
  const pageSize = Number.isFinite(size) ? Math.max(1, Math.floor(size)) : 6;
  const number = typeof requestedPage === 'number' ? requestedPage : Number(requestedPage);
  const pages = Math.max(1, Math.ceil(records.length / pageSize));
  const page = Math.min(pages, Number.isSafeInteger(number) && number > 0 ? number : 1);
  const start = (page - 1) * pageSize;
  return { items: records.slice(start, start + pageSize), page, pages, total: records.length, first: records.length ? start + 1 : 0, last: Math.min(start + pageSize, records.length) };
}
