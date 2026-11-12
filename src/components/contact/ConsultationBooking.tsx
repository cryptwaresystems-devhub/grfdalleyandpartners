import { CalendarDays } from 'lucide-react';
import { contactServices } from '../../data/contact-services';
import { contactDetails } from '../../data/contact-details';
import { configuredBookingUrl } from '../../lib/contact';
export function ConsultationBooking({ bookingUrl = contactServices.bookingUrl }: { bookingUrl?: string | null }) {
  const url = configuredBookingUrl(bookingUrl);
  return <section className="consultation-preview" aria-labelledby="consultation-heading"><CalendarDays size={27} strokeWidth={1.2} aria-hidden="true" /><p className="eyebrow">Consultations</p><h2 id="consultation-heading">Make time for a conversation.</h2>{url ? <><p>Check availability through the firm’s configured scheduling page.</p><a className="button button--light" href={url} target="_blank" rel="noopener noreferrer">Book through Calendly<span className="sr-only"> (opens in a new tab)</span></a></> : <><span className="booking-pending">Online booking forthcoming</span><p>A scheduling link has not yet been configured. Email the firm to request a consultation.</p><a className="button button--light" href={`mailto:${contactDetails.email}?subject=Consultation%20request`}>Request by email</a></>}</section>;
}
