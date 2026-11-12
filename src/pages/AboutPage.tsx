import { PageHeader } from '../components/PageHeader';
import { Container } from '../components/Container';
import { ButtonLink } from '../components/Button';
import { Reveal } from '../components/home/Reveal';
import { PeoplePreview } from '../components/home/PeoplePreview';
import { managementPeople } from '../data/homepage';
import { about } from '../data/about';
import { isPublished } from '../lib/publication';

export function AboutPage() {
  const provisional = !isPublished(about);
  return <>
    <PageHeader title="A lasting perspective. A commercial focus." eyebrow="About the firm" description={about.introduction} breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} />
    <Container>{provisional && <div className="provisional-notice"><span>Provisional copy</span><p>This narrative is adapted from the firm’s supplied profile and is subject to final approval.</p></div>}
      <section className="about-history supporting-section" aria-labelledby="history-heading"><Reveal className="about-history__year"><p className="eyebrow">Our beginnings</p><span aria-hidden="true">{about.established}</span><p>Established in Nigeria.</p></Reveal><Reveal className="about-history__story"><p className="eyebrow">Heritage & perspective</p><h2 id="history-heading">Experience that continues to evolve.</h2>{about.history.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<ButtonLink to="/practices" variant="outline" arrow>Explore Our Practices</ButtonLink></Reveal></section>
    </Container>
    <section className="about-approach supporting-section" aria-labelledby="approach-heading"><Container><Reveal className="about-approach__intro"><div><p className="eyebrow">Client service</p><h2 id="approach-heading">Your objectives.<br /><em>Our starting point.</em></h2></div><p>{about.service}</p></Reveal><div className="about-approach__grid">{about.approach.map((item, index) => <Reveal key={item.title}><article><span aria-hidden="true">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article></Reveal>)}</div>{provisional && <p className="directory-note">Provisional service narrative, prepared for the firm’s review.</p>}</Container></section>
    <PeoplePreview people={managementPeople} mode="management-preview" eyebrow="Our leadership" title="The people shaping our practice." />
    <Container><div className="about-contact-line"><p>Learn more about the firm or discuss your legal enquiry.</p><ButtonLink to="/contact" variant="outline" arrow>Start a Conversation</ButtonLink></div></Container>
  </>;
}
