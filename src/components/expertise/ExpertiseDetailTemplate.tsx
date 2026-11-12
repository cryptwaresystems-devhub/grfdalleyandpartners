import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { PageHeader } from '../PageHeader';
import { Container } from '../Container';
import { ButtonLink } from '../Button';
import { expertiseBase, expertiseLabel, safeExternalUrl, type ExpertiseDetail } from '../../lib/expertise';

export function ExpertiseDetailTemplate({ detail }: { detail: ExpertiseDetail }) {
  const { record, kind, otherKind, summary, connected, lawyers, insights, matters, publications, previous, next } = detail;
  const base = expertiseBase(kind);
  const label = expertiseLabel(kind);
  const contentSections = [
    { id: 'overview', label: 'Overview', visible: true },
    { id: 'connected-expertise', label: otherKind === 'industry' ? 'Related industries' : 'Related practices', visible: connected.length > 0 },
    { id: 'related-people', label: 'Related people', visible: lawyers.length > 0 },
    { id: 'related-insights', label: 'Related insights', visible: insights.length > 0 },
    { id: 'selected-matters', label: 'Selected matters', visible: matters.length > 0 },
    { id: 'related-publications', label: 'Publications', visible: publications.length > 0 },
  ].filter(section => section.visible);
  return <>
    <PageHeader title={record.name} eyebrow={label} breadcrumbs={[{ label: 'Home', to: '/' }, { label, to: base }, { label: record.name }]} />
    <Container><div className="expertise-detail-layout"><div className="expertise-detail-main">
      <section className="detail-section" id="overview" tabIndex={-1} aria-labelledby="overview-heading"><p className="eyebrow">Overview</p>{summary ? <><h2 id="overview-heading">{record.name}</h2><p className="detail-summary">{summary}</p></> : <div className="content-pending"><span className="content-status">Content pending</span><h2 id="overview-heading">A fuller introduction is on its way.</h2><p>The detailed overview of {record.name} is being prepared for approval. Please contact the firm to discuss your enquiry.</p><ButtonLink to="/contact" variant="outline" arrow>Start a Conversation</ButtonLink></div>}</section>
      {connected.length > 0 && <section className="detail-section" id="connected-expertise" tabIndex={-1} aria-labelledby="connected-heading"><p className="eyebrow">Connected expertise</p><h2 id="connected-heading">{otherKind === 'industry' ? 'Related industries' : 'Related practice areas'}</h2><ul className="related-expertise-list">{connected.map(item => <li key={item.id}><Link to={`${expertiseBase(otherKind)}/${item.slug}`}>{item.name}<ArrowRight size={17} aria-hidden="true" /></Link></li>)}</ul></section>}
      {lawyers.length > 0 && <section className="detail-section" id="related-people" tabIndex={-1} aria-labelledby="related-people-heading"><h2 id="related-people-heading">Related people</h2><ul className="detail-people-list">{lawyers.map(person => <li key={person.id}><h3>{person.name}</h3><p>{person.role}</p></li>)}</ul><ButtonLink to="/people" variant="outline" arrow>Explore Our People</ButtonLink></section>}
      {insights.length > 0 && <section className="detail-section" id="related-insights" tabIndex={-1} aria-labelledby="related-insights-heading"><h2 id="related-insights-heading">Related insights</h2><div className="detail-editorial-list">{insights.map(item => { const url = safeExternalUrl(item.externalUrl); return <article key={item.id}><p className="eyebrow">{item.type.replaceAll('-', ' ')}</p><h3>{url ? <a href={url} target="_blank" rel="noopener noreferrer">{item.name}<span className="sr-only"> (opens publisher in a new tab)</span></a> : item.name}</h3>{url && <p>External publication <ExternalLink size={12} aria-hidden="true" /></p>}</article>; })}</div><ButtonLink to="/insights" variant="outline" arrow>Explore Insights</ButtonLink></section>}
      {matters.length > 0 && <section className="detail-section" id="selected-matters" tabIndex={-1} aria-labelledby="matters-heading"><h2 id="matters-heading">Selected matters</h2><div className="detail-editorial-list">{matters.map(item => <article key={item.id}><h3>{item.name}</h3><p>{item.summary}</p></article>)}</div></section>}
      {publications.length > 0 && <section className="detail-section" id="related-publications" tabIndex={-1} aria-labelledby="publications-heading"><h2 id="publications-heading">Publications</h2><div className="detail-editorial-list">{publications.map(item => { const url = safeExternalUrl(item.externalUrl); return <article key={item.id}><p className="eyebrow">{item.publisher}{item.year ? ` · ${item.year}` : ''}</p><h3>{url ? <a href={url} target="_blank" rel="noopener noreferrer">{item.name}<span className="sr-only"> (opens publisher in a new tab)</span></a> : item.name}</h3></article>; })}</div></section>}
      {connected.length + lawyers.length + insights.length + matters.length + publications.length === 0 && <div className="detail-forthcoming"><p className="eyebrow">Further information</p><p>Related expertise, team profiles, publications and selected experience will be added following approval.</p></div>}
    </div><aside className="expertise-detail-aside" aria-label="Page navigation and enquiries"><nav aria-label="On this page"><p className="eyebrow">On this page</p>{contentSections.map(section => <a href={`#${section.id}`} key={section.id}>{section.label}</a>)}</nav><div className="detail-contact"><p className="eyebrow">Get in touch</p><h2>Let’s discuss your enquiry.</h2><p>Contact the firm for further information.</p><ButtonLink to="/contact" arrow>Start a Conversation</ButtonLink></div><Link to={base} className="detail-back"><ArrowLeft size={15} aria-hidden="true" />All {kind === 'industry' ? 'industries' : 'practice areas'}</Link></aside></div>
      <nav className="expertise-siblings" aria-label={`Browse ${kind === 'industry' ? 'industries' : 'practice areas'}`}>{previous ? <Link to={`${base}/${previous.slug}`}><ArrowLeft size={18} aria-hidden="true" /><span><small>Previous {kind}</small>{previous.name}</span></Link> : <span />}{next && <Link to={`${base}/${next.slug}`}><span><small>Next {kind}</small>{next.name}</span><ArrowRight size={18} aria-hidden="true" /></Link>}</nav>
    </Container>
  </>;
}
