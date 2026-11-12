import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Lawyer } from '../../types/content';
export function PersonCard({ person }: { person: Lawyer }) {
  return <article className="directory-person"><Link to={`/people/${person.slug}`} className="directory-person__link"><div className="directory-person__image">{person.portrait ? <img src={person.portrait} alt={`Portrait of ${person.name}`} width="600" height="750" loading="lazy" decoding="async" /> : <span>Portrait forthcoming</span>}</div><div className="directory-person__caption"><div><h2>{person.name}</h2><p>{person.role}</p></div><ArrowUpRight size={19} aria-hidden="true" /></div></Link></article>;
}
