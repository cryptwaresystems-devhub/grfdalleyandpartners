import { about } from '../../data/about';
import { isPublished } from '../../lib/publication';
import { usePresentationMode } from '../../lib/presentation';
import { ArrowDown } from 'lucide-react';
import { Container } from '../Container';
import { ButtonLink } from '../Button';
import { homepageCopy } from '../../data/homepage';

export function Hero() {
  const preview = usePresentationMode() === 'management-preview' || isPublished(about);
  return <section className="home-hero" aria-labelledby="hero-heading">
    <picture className="home-hero__image"><source media="(max-width: 47.99rem)" srcSet="/assets/architecture/towers-960.webp" /><img src="/assets/architecture/towers-1920.webp" width="1920" height="1080" alt="" aria-hidden="true" fetchPriority="high" decoding="async" /></picture>
    <div className="home-hero__shade" aria-hidden="true" />
    <Container className="home-hero__container"><div className="home-hero__content"><p className="eyebrow">{homepageCopy.established}</p><h1 id="hero-heading">{preview ? <>Established in Experience.<br /><em>Focused on Your Future.</em></> : <>G.R.F. Dalley<br /><em>&amp; Partners</em></>}</h1><p className="home-hero__intro">{preview ? homepageCopy.introduction : 'Explore our firm, practice areas and industry categories, or contact us with your enquiry.'}</p><div className="home-hero__actions"><ButtonLink to="/practices" variant="light" arrow>Explore Our Expertise</ButtonLink><ButtonLink to="/contact" variant="outline" className="hero-secondary" arrow>Start a Conversation</ButtonLink></div></div><div className="home-hero__baseline"><span>G.R.F. Dalley & Partners</span><a href="#our-firm">Discover the firm <ArrowDown size={15} aria-hidden="true" /></a></div></Container>
  </section>;
}
