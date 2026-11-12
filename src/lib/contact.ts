import { contactDetails } from '../data/contact-details';
export interface EnquiryDraft { name: string; email: string; phone: string; nature: string; message: string; }
export function enquiryMailto(draft: EnquiryDraft) {
  const subject = `Website enquiry: ${draft.nature.replace(/[\r\n]/g, ' ').slice(0, 80)}`;
  const body = [`Name: ${draft.name.trim()}`, `Email: ${draft.email.trim()}`, draft.phone.trim() ? `Phone: ${draft.phone.trim()}` : '', `Enquiry: ${draft.nature}`, '', draft.message.trim()].filter((line, index) => line || index === 4).join('\r\n');
  return `mailto:${contactDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
export function configuredBookingUrl(value: string | null) {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === 'https:' && ['calendly.com', 'www.calendly.com'].includes(url.hostname) && url.pathname.length > 1 ? url.href : null; } catch { return null; }
}
