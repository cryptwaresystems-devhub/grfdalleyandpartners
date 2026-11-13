import { useCookieConsent } from '../privacy/CookieConsent';
import { useEffect, useState } from 'react';
import { useContactServices } from './ContactServices';
import { CalendarDays } from 'lucide-react';
import { contactServices } from '../../data/contact-services';
import { contactDetails } from '../../data/contact-details';
import { configuredBookingUrl } from '../../lib/contact';
export function ConsultationBooking({ bookingUrl }: { bookingUrl?: string | null }) {
  const { choices, openPreferences } = useCookieConsent();
  useEffect(() => { if (!choices.media) { setShow(false); setLoaded(false); setSlow(false); } }, [choices.media]);
  const services = useContactServices();
  const url = configuredBookingUrl(bookingUrl === undefined ? services.bookingUrl ?? contactServices.bookingUrl : bookingUrl);
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  useEffect(() => { if (!show) return; const timer = setTimeout(() => setSlow(true), 12000); return () => clearTimeout(timer); }, [show]);
  return <section className="consultation-preview" aria-labelledby="consultation-heading"><CalendarDays size={27} strokeWidth={1.2} aria-hidden="true" /><p className="eyebrow">Consultations</p><h2 id="consultation-heading">Make time for a conversation.</h2>{url ? <><p>Check availability through the firm’s configured scheduling page.</p><a className="button button--light" href={url} target="_blank" rel="noopener noreferrer">Book through Calendly<span className="sr-only"> (opens in a new tab)</span></a><p>Load the calendar below to view availability. Calendly handles scheduling and its own confirmation; sending an enquiry does not book an appointment.</p>{!show || !choices.media ? <button type="button" className="button button--light" onClick={() => choices.media ? setShow(true) : openPreferences()}>{choices.media ? 'Load Calendly calendar' : 'Choose preferences to enable calendar'}</button> : <><p className="directory-note">This calendar connects to Calendly, a third-party service.</p>{!loaded && <p role="status">Loading calendar...</p>}{slow && <p role="status">If the calendar is unavailable, use the booking link above. No booking is confirmed by this page.</p>}<iframe title="Consultation scheduling with Calendly" src={url} referrerPolicy="no-referrer" className="calendly-frame" onLoad={() => setLoaded(true)} onError={() => setSlow(true)} /></>}</> : <><span className="booking-pending">Online booking forthcoming</span><p>A scheduling link has not yet been configured. Email the firm to request a consultation.</p><a className="button button--light" href={`mailto:${contactDetails.email}?subject=Consultation%20request`}>Request by email</a></>}</section>;
}
