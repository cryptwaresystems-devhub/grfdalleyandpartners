export interface DirectoryOption { id: string; name: string; count?: number; }
export function DirectorySelect({ id, label, value, options, onChange, allLabel }: { id: string; label: string; value: string; options: DirectoryOption[]; onChange: (value: string) => void; allLabel: string }) {
  const unknown = value !== 'all' && !options.some(option => option.id === value);
  return <div className="directory-select"><label htmlFor={id}>{label}</label><select id={id} value={value} onChange={event => onChange(event.target.value)} disabled={!options.length && !unknown}><option value="all">{allLabel}</option>{unknown && <option value={value}>Unavailable selection</option>}{options.map(option => <option key={option.id} value={option.id}>{option.name}{option.count === undefined ? '' : ` (${option.count})`}</option>)}</select></div>;
}
