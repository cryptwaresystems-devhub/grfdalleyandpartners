import type { PropsWithChildren } from 'react';
import { Container } from './Container';
import { PageHeader } from './PageHeader';
export function PageTemplate({ title, children, showBreadcrumbs = true }: PropsWithChildren<{ title: string; showBreadcrumbs?: boolean }>) {
 return <><PageHeader title={title} breadcrumbs={showBreadcrumbs ? [{ label: 'Home', to: '/' }, { label: title }] : undefined} /><Container><section className="page-body"><div className="reading-width">{children}</div></section></Container></>;
}
