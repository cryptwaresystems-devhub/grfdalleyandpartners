import type { ReactNode } from 'react';

export function SectionHeading({ eyebrow, title, children, id }: { eyebrow?: string; title: string; children?: ReactNode; id?: string }) {
  return <div className="section-heading">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 id={id}>{title}</h2>{children && <div className="section-heading__description">{children}</div>}</div>;
}
