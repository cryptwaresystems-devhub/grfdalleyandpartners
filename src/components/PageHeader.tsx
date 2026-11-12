import type { ReactNode } from 'react';
import { Container } from './Container';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

export function PageHeader({ title, eyebrow = 'G.R.F. Dalley & Partners', description, breadcrumbs }: { title: string; eyebrow?: string; description?: ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
  return <div className="page-header"><Container>{breadcrumbs && <Breadcrumbs items={breadcrumbs} />}<div className="page-header__content"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <div className="page-header__description">{description}</div>}</div></Container></div>;
}
