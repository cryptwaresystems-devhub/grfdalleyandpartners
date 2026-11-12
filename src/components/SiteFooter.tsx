import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import { navigation } from '../data/navigation';
import { contactDetails } from '../data/contact-details';
import { Container } from './Container';
import { ButtonLink } from './Button';
import { SectionHeading } from './SectionHeading';

export function SiteFooter({ showConversation = true, officesId = 'offices' }: { showConversation?: boolean; officesId?: string }) {
  return <footer className="site-footer"><Container>
    {showConversation && <div className="footer-conversation"><SectionHeading eyebrow="Let’s connect" title="Every conversation is a beginning."><p>Speak with G.R.F. Dalley & Partners.</p></SectionHeading><ButtonLink to="/contact" variant="light" arrow>Start a Conversation</ButtonLink></div>}
    <div className="footer-content">
      <div className="footer-contact"><p className="footer-wordmark">G.R.F. Dalley<br /><span>& Partners</span></p><a className="footer-email" href={`mailto:${contactDetails.email}`}><Mail size={17} aria-hidden="true" />{contactDetails.email}</a><a className="footer-phone" href={contactDetails.telephone.href}>{contactDetails.telephone.display}</a><p className="footer-approval">Telephone supplied in the firm profile.<br />{contactDetails.telephone.approval}</p></div>
      <div className="footer-offices" id={officesId} tabIndex={-1} role="group" aria-label="Our offices">{contactDetails.offices.map(office => <section key={office.id} aria-labelledby={`office-${office.id}`}><p className="footer-label">{office.label}</p><h3 id={`office-${office.id}`}>{office.name}</h3>{office.lines.length > 0 ? <address>{office.lines.map(line => <span key={line}>{line}</span>)}</address> : <p className="office-pending">{'pending' in office ? office.pending : ''}</p>}</section>)}</div>
    </div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} G.R.F. Dalley & Partners.</p><nav aria-label="Footer navigation">{navigation.map(item => <Link key={item.path} to={item.path}>{item.label}</Link>)}</nav><a href="#top" className="back-to-top">Back to top <ArrowUpRight size={14} aria-hidden="true" /></a></div>
  </Container></footer>;
}
