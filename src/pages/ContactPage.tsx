import { Mail, ArrowUpRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Container } from '../components/Container';
import { EnquiryForm } from '../components/contact/EnquiryForm';
import { ConsultationBooking } from '../components/contact/ConsultationBooking';
import { contactDetails } from '../data/contact-details';
export function ContactPage() {
  return <><PageHeader title="Start a conversation." eyebrow="Contact" description="Tell us how we can help you find the right point of contact." breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} /><Container>
    <section className="contact-introduction" aria-label="General enquiries"><div><p className="eyebrow">General enquiries</p><a className="contact-main-email" href={`mailto:${contactDetails.email}`}><Mail size={23} aria-hidden="true" />{contactDetails.email}<ArrowUpRight size={24} aria-hidden="true" /></a></div><div><a className="contact-main-phone" href={contactDetails.telephone.href}>{contactDetails.telephone.display}</a><p className="directory-note">Telephone from the supplied firm profile.<br />{contactDetails.telephone.approval}</p></div></section>
    <section className="contact-offices" id="offices" tabIndex={-1} aria-labelledby="contact-offices-heading"><div className="contact-section-heading"><p className="eyebrow">Our locations</p><h2 id="contact-offices-heading">Connected across Nigeria.</h2></div><div className="contact-offices-grid">{contactDetails.offices.map(office => <article key={office.id}><p className="eyebrow">{office.label}</p><h3>{office.name}</h3>{office.lines.length ? <address>{office.lines.map(line => <span key={line}>{line}</span>)}</address> : <p className="contact-address-pending">{'pending' in office ? office.pending : ''}</p>}</article>)}</div></section>
    <div className="contact-enquiry-layout section-space"><section aria-labelledby="enquiry-heading"><p className="eyebrow">Write to us</p><h2 id="enquiry-heading">What would you like to discuss?</h2><EnquiryForm /></section><ConsultationBooking /></div>
  </Container></>;
}
