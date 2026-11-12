import { PageTemplate } from '../components/PageTemplate';
export function SectionPage({ title }: { title: string }) {
 return <PageTemplate title={title}><p className="text-lg text-muted">This section is being prepared. Content will appear once reviewed and approved.</p></PageTemplate>;
}
