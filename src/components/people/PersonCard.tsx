import { recordSeo } from '../../lib/seo-fields';
import { ResponsiveImage } from '../ResponsiveImage';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Lawyer } from '../../types/content';
export function PersonCard({ person }: { person: Lawyer }) {
  return <article className="directory-person"><Link to={`/people/${person.slug}`} className="directory-person__link"><div className="directory-person__image">{person.portrait ? <ResponsiveImage src={person.portrait} alt={recordSeo(person)?.imageAlt ?? `Portrait of ${person.name}`} width="600" height="750" loading="lazy" decoding="async" sizes="(min-width: 1024px) 25vw, (min-width: 480px) 50vw, 100vw" /> : <span>Portrait forthcoming</span>}</div><div className="directory-person__caption"><div><h2>{person.name}</h2><p>{person.role}</p></div><ArrowUpRight size={19} aria-hidden="true" /></div></Link></article>;
}
