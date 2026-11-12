import { useSearchParams } from 'react-router-dom';

export function useDirectoryQuery() {
  const [params, setParams] = useSearchParams();
  function update(values: Record<string, string>) {
    setParams(previous => {
      const next = new URLSearchParams(previous);
      next.delete('page');
      for (const [key, value] of Object.entries(values)) {
        if (!value || value === 'all' || (key === 'page' && value === '1')) next.delete(key);
        else next.set(key, value);
      }
      return next;
    }, { replace: true, preventScrollReset: true });
  }
  return { params, update, reset: () => setParams({}, { replace: true, preventScrollReset: true }) };
}
