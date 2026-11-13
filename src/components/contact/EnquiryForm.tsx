import { isPrivacyPolicyApproved } from '../../lib/privacy';
import { Link } from 'react-router-dom';
import { useRef, useState, type FormEvent } from 'react';
import { enquiryMailto, type EnquiryDraft } from '../../lib/contact';

import { validateContact, type ContactRequest } from '../../lib/contact-validation';
import { useContactServices } from './ContactServices';
import { SpamCheck } from './SpamCheck';

const emptyDraft: EnquiryDraft = { name: '', email: '', phone: '', nature: '', message: '' };
export function EnquiryForm({ consultation = false }: { consultation?: boolean }) {
  const services = useContactServices();
  const prefix = consultation ? 'consultation' : 'enquiry';
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useState('');
  const [challenge, setChallenge] = useState(0);
  const [preference, setPreference] = useState('');
  const requestId = useRef('');
  const sending = useRef(false);
  const summary = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<EnquiryDraft>(consultation ? { ...emptyDraft, nature: 'Consultation request' } : emptyDraft);
  const [mailto, setMailto] = useState<string | null>(null);
  function update(field: keyof EnquiryDraft, value: string) { setDraft(previous => ({ ...previous, [field]: value })); setMailto(null); setFeedback(''); setErrors(previous => { const next = { ...previous }; delete next[field]; return next; }); requestId.current = ''; }
  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const payload: ContactRequest = { ...draft, kind: consultation ? 'consultation' : 'enquiry', preference, website: (form.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '', token, requestId: '' };
    const problems = validateContact(payload);
    setErrors(problems); setFeedback('');
    if (Object.keys(problems).length) { setTimeout(() => summary.current?.focus(), 0); return; }
    if (!services.deliveryConfigured) { setMailto(enquiryMailto({ ...draft, message: [draft.message, preference && `Consultation preference: ${preference}`].filter(Boolean).join('\n') })); return; }
    if (!token) { setFeedback('Complete the spam check before sending.'); return; }
    requestId.current ||= crypto.randomUUID(); payload.requestId = requestId.current;
    sending.current = true; setBusy(true); setMailto(null);
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(22000) });
      const result = await response.json();
      if (response.status === 202 && result.status === 'accepted' && typeof result.reference === 'string') {
        setFeedback(consultation ? 'Your consultation request was accepted for email delivery. This does not confirm an appointment; the firm will need to agree a time with you.' : 'Your enquiry was accepted for email delivery. Inbox delivery has not been independently confirmed.');
      } else { setFeedback(typeof result.message === 'string' ? result.message : 'Acceptance could not be confirmed. Retry or use email.'); if (result.errors) setErrors(result.errors); }
    } catch { setFeedback('Acceptance could not be confirmed. Retry this unchanged request or use the email option.'); }
    finally { sending.current = false; setBusy(false); setToken(''); setChallenge(value => value + 1); }
  }
  return <form className="enquiry-form" noValidate onSubmit={prepare} aria-busy={busy} aria-describedby={`${prefix}-service-note ${prefix}-privacy-note`}>
    <p id={`${prefix}-service-note`} className="form-service-note">{services.deliveryConfigured ? 'Online delivery is configured. A successful response confirms provider acceptance, not inbox delivery or a booked consultation.' : 'Online delivery is pending configuration. This form prepares a draft for your email app; it does not send a message.'}</p>
    {Object.keys(errors).length > 0 && <div ref={summary} tabIndex={-1} role="alert" className="form-errors"><p>Please check your details.</p>{Object.entries(errors).map(([field, error]) => <p key={field}><a href={`#${prefix}-${field}`}>{error}</a></p>)}</div>}
    <fieldset disabled={busy}><legend>{consultation ? 'Request a consultation' : 'Your enquiry'}</legend><div className="enquiry-fields">
      <div className="form-field"><label htmlFor={`${prefix}-name`}>Name <span>(required)</span></label><input id={`${prefix}-name`} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${prefix}-name-error` : undefined} name="name" autoComplete="name" required maxLength={100} value={draft.name} onChange={event => update('name', event.target.value)} />{errors.name && <p id={`${prefix}-name-error`} className="field-error">{errors.name}</p>}</div>
      <div className="form-field"><label htmlFor={`${prefix}-email`}>Email <span>(required)</span></label><input id={`${prefix}-email`} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${prefix}-email-error` : undefined} name="email" type="email" autoComplete="email" required maxLength={150} value={draft.email} onChange={event => update('email', event.target.value)} />{errors.email && <p id={`${prefix}-email-error`} className="field-error">{errors.email}</p>}</div>
      <div className="form-field"><label htmlFor={`${prefix}-phone`}>Phone <span>(optional)</span></label><input id={`${prefix}-phone`} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? `${prefix}-phone-error` : undefined} name="phone" type="tel" autoComplete="tel" maxLength={40} value={draft.phone} onChange={event => update('phone', event.target.value)} />{errors.phone && <p id={`${prefix}-phone-error`} className="field-error">{errors.phone}</p>}</div>
      <div className="form-field"><label htmlFor={`${prefix}-nature`}>Nature of enquiry <span>(required)</span></label><select id={`${prefix}-nature`} aria-invalid={Boolean(errors.nature)} aria-describedby={errors.nature ? `${prefix}-nature-error` : undefined} name="nature" required value={draft.nature} onChange={event => update('nature', event.target.value)}><option value="">Select an enquiry type</option><option>General enquiry</option><option>Consultation request</option><option>Professional enquiry</option></select>{errors.nature && <p id={`${prefix}-nature-error`} className="field-error">{errors.nature}</p>}</div>
      <div className="form-field form-field--wide"><label htmlFor={`${prefix}-message`}>Message <span>(optional)</span></label><textarea id={`${prefix}-message`} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? `${prefix}-message-error` : undefined} name="message" rows={5} maxLength={1500} value={draft.message} onChange={event => update('message', event.target.value)} />{errors.message && <p id={`${prefix}-message-error`} className="field-error">{errors.message}</p>}</div>
    {consultation && <div className="form-field form-field--wide"><label htmlFor="consultation-preference">Preferred time or meeting format (optional)</label><input id="consultation-preference" aria-invalid={Boolean(errors.preference)} aria-describedby={errors.preference ? "consultation-preference-error" : undefined} maxLength={200} value={preference} onChange={event => { setPreference(event.target.value); requestId.current = ''; setFeedback(''); }} />{errors.preference && <p id="consultation-preference-error" className="field-error">{errors.preference}</p>}<p className="directory-note">A preference is a request, subject to confirmation by the firm.</p></div>}
      <div className="contact-honeypot" aria-hidden="true"><label htmlFor={`${prefix}-website`}>Leave this field empty</label><input id={`${prefix}-website`} name="website" tabIndex={-1} autoComplete="off" /></div>
    </div></fieldset>
    <p id={`${prefix}-privacy-note`} className="directory-note">Sending online shares your details with the firm and its delivery provider. The email-draft option opens your own email app. Please avoid including confidential documents or sensitive case details. <Link to="/privacy">Privacy Policy</Link> {!isPrivacyPolicyApproved() && ' (firm-approved legal text pending)' }.</p>
    {services.deliveryConfigured && services.turnstileSiteKey && <SpamCheck key={challenge} siteKey={services.turnstileSiteKey} onToken={setToken} />}
    {feedback && <p role="status" className="form-service-note">{feedback}</p>}
    <div className="form-actions"><button type="submit" disabled={busy} className="button button--primary">{busy ? 'Sending...' : services.deliveryConfigured ? consultation ? 'Send consultation request' : 'Send enquiry' : 'Prepare email draft'}</button><button type="button" disabled={busy} className="form-clear" onClick={() => { setDraft(consultation ? { ...emptyDraft, nature: 'Consultation request' } : emptyDraft); setMailto(null); setErrors({}); setFeedback(''); setPreference(''); setToken(''); setChallenge(value => value + 1); requestId.current = ''; }}>Clear form</button></div>
    {services.deliveryConfigured && <p><a href={enquiryMailto({ ...draft, message: [draft.message, preference && `Consultation preference: ${preference}`].filter(Boolean).join('\n') })}>Use your email app instead</a></p>}
    {mailto && <div className="email-draft-result"><p role="status">Your email draft is ready. Nothing has been sent.</p><a className="button button--outline" href={mailto}>Open your email app</a><p className="directory-note">An email application must be configured on your device. Review the draft there before sending.</p></div>}
  </form>;
}
