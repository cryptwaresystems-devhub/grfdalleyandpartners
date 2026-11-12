export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  if (pages <= 1) return null;
  return <nav className="listing-pagination" aria-label="Insights pages"><button type="button" className="button button--outline" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-controls="insights-results">Previous</button><span aria-current="page">Page {page} of {pages}</span><button type="button" className="button button--outline" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-controls="insights-results">Next</button></nav>;
}
