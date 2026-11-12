import { useState, type FormEvent } from 'react';
import { enquiryMailto, type EnquiryDraft } from '../../lib/contact';

const emptyDraft: EnquiryDraft = { name: '', email: '', phone: '', nature: '', message: '' };
export function EnquiryForm() {
  const [draft, setDraft] = useState<EnquiryDraft>(emptyDraft);
  const [mailto, setMailto] = useState<string | null>(null);
  function update(field: keyof EnquiryDraft, value: string) { setDraft(previous => ({ ...previous, [field]: value })); setMailto(null); }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setMailto(enquiryMailto(draft));
  }
  return <form className="enquiry-form" onSubmit={prepare} aria-describedby="enquiry-service-note enquiry-privacy-note">
    <p id="enquiry-service-note" className="form-service-note">Online delivery is not connected. This form prepares a draft for your email app; it does not send a message.</p>
    <fieldset><legend>Your enquiry</legend><div className="enquiry-fields">
      <div className="form-field"><label htmlFor="enquiry-name">Name <span>(required)</span></label><input id="enquiry-name" name="name" autoComplete="name" required maxLength={100} value={draft.name} onChange={event => update('name', event.target.value)} /></div>
      <div className="form-field"><label htmlFor="enquiry-email">Email <span>(required)</span></label><input id="enquiry-email" name="email" type="email" autoComplete="email" required maxLength={150} value={draft.email} onChange={event => update('email', event.target.value)} /></div>
      <div className="form-field"><label htmlFor="enquiry-phone">Phone <span>(optional)</span></label><input id="enquiry-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} value={draft.phone} onChange={event => update('phone', event.target.value)} /></div>
      <div className="form-field"><label htmlFor="enquiry-nature">Nature of enquiry <span>(required)</span></label><select id="enquiry-nature" name="nature" required value={draft.nature} onChange={event => update('nature', event.target.value)}><option value="">Select an enquiry type</option><option>General enquiry</option><option>Consultation request</option><option>Professional enquiry</option></select></div>
      <div className="form-field form-field--wide"><label htmlFor="enquiry-message">Message <span>(required)</span></label><textarea id="enquiry-message" name="message" required rows={5} maxLength={1500} value={draft.message} onChange={event => update('message', event.target.value)} /></div>
    </div></fieldset>
    <p id="enquiry-privacy-note" className="directory-note">Your details stay in this page until you choose to open your email app. Please avoid including confidential documents or sensitive case details.</p>
    <div className="form-actions"><button type="submit" className="button button--primary">Prepare email draft</button><button type="button" className="form-clear" onClick={() => { setDraft(emptyDraft); setMailto(null); }}>Clear form</button></div>
    {mailto && <div className="email-draft-result"><p role="status">Your email draft is ready. Nothing has been sent.</p><a className="button button--outline" href={mailto}>Open your email app</a><p className="directory-note">An email application must be configured on your device. Review the draft there before sending.</p></div>}
  </form>;
}
