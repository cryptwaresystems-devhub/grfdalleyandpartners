import { ArrowUpRight } from 'lucide-react';
import { Container } from '../components/Container';
import { ButtonLink } from '../components/Button';
import { SectionHeading } from '../components/SectionHeading';
import { Hero } from '../components/home/Hero';
import { Reveal } from '../components/home/Reveal';
import { PeoplePreview } from '../components/home/PeoplePreview';
import { InsightsPreview } from '../components/home/InsightsPreview';
import { featuredPractices, featuredIndustries, managementPeople } from '../data/homepage';

export function HomePage() {
  return <>
    <Hero />
    <section className="home-section home-about" id="our-firm" tabIndex={-1} aria-labelledby="about-heading"><Container className="home-about__grid">
      <Reveal><p className="eyebrow">Our firm</p><h2 id="about-heading">A lasting perspective.<br /><em>A contemporary approach.</em></h2><ButtonLink to="/about" variant="outline" arrow>Discover Our Firm</ButtonLink></Reveal>
      <Reveal className="home-about__story"><p className="home-lead">Rooted in Nigeria since 1962. Attuned to the business of today.</p><p>G.R.F. Dalley & Partners brings together generations of legal experience to advise businesses and individuals in increasingly complex markets.</p><p>Our practice spans corporate and commercial matters, dispute resolution, banking and finance, intellectual property and more. We combine an understanding of your sector with a practical focus on your objectives.</p><div className="home-about__signature"><span aria-hidden="true" /><p>Experience. Understanding. Perspective.</p></div></Reveal>
    </Container></section>
    <section className="home-section home-practices" aria-labelledby="practices-heading"><Container>
      <Reveal className="home-section-heading"><SectionHeading id="practices-heading" eyebrow="Our expertise" title="Clarity for complex matters."><p>Commercial understanding, applied across the legal issues that matter to your business.</p></SectionHeading><ButtonLink to="/practices" variant="outline" arrow>Explore Our Practices</ButtonLink></Reveal>
      <div className="practice-preview-grid">{featuredPractices.map((practice, index) => <Reveal key={practice.name}><article className="practice-preview"><span className="practice-preview__index" aria-hidden="true">0{index + 1}</span><h3>{practice.name}</h3><p>{practice.summary}</p></article></Reveal>)}</div>
    </Container></section>
    <section className="home-industry" aria-labelledby="industry-heading"><div className="home-industry__image"><img src="/assets/architecture/facade-960.webp" alt="Modern glass facade with strong structural lines and reflected light" width="960" height="640" loading="lazy" decoding="async" /><span className="home-image-caption">Perspective shapes possibility.</span></div><div className="home-industry__content"><Reveal><p className="eyebrow">Industry expertise</p><h2 id="industry-heading">Your sector.<br /><em>Our focus.</em></h2><p>Legal advice gains perspective when it is grounded in the world in which your business operates.</p><ul>{featuredIndustries.map(industry => <li key={industry}>{industry}</li>)}</ul><ButtonLink to="/industries" variant="light" arrow>Explore Our Industries</ButtonLink></Reveal></div></section>
    <PeoplePreview people={managementPeople} mode="management-preview" />
    <InsightsPreview />
    <section className="home-contact" aria-labelledby="contact-heading"><Container><Reveal className="home-contact__inner"><div><p className="eyebrow">Looking ahead</p><h2 id="contact-heading">Your next chapter.<br /><em>Let’s talk about it.</em></h2><p>Tell us what matters to your business.</p></div><ButtonLink to="/contact" arrow>Start a Conversation</ButtonLink><ArrowUpRight className="home-contact__mark" size={180} strokeWidth={0.6} aria-hidden="true" /></Reveal></Container></section>
  </>;
}
