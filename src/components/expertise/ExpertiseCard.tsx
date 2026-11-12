import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Expertise, ExpertiseKind } from '../../types/content';
import { expertiseBase } from '../../lib/expertise';
import { isPublished } from '../../lib/publication';

export function ExpertiseCard({ record, kind, index }: { record: Expertise; kind: ExpertiseKind; index: number }) {
  return <Link to={`${expertiseBase(kind)}/${record.slug}`} className="expertise-card"><span className="expertise-card__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{record.name}</h3>{(!isPublished(record) || !record.summary) && <p>Detailed overview pending</p>}</div><ArrowUpRight size={20} strokeWidth={1.3} aria-hidden="true" /></Link>;
}
