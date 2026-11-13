import { isPrivacyPolicyApproved } from '../../lib/privacy';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CONSENT_KEY, CONSENT_LIFETIME, essentialOnly, parseConsent, saveConsent, type CookieChoices } from '../../lib/consent';
import { revokeAnalytics } from '../../lib/analytics';
interface ConsentContext { choices: CookieChoices; openPreferences: () => void }
const Context = createContext<ConsentContext>({ choices: essentialOnly, openPreferences: () => {} });
export const useCookieConsent = () => useContext(Context);
export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [choices, setChoices] = useState<CookieChoices>(essentialOnly);
  const [answered, setAnswered] = useState(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CookieChoices>(essentialOnly);
  const [storageError, setStorageError] = useState(false);
  const [status, setStatus] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  function applyStored(raw: string | null) {
    const stored = parseConsent(raw);
    if (!stored?.analytics) revokeAnalytics();
    setChoices(stored ?? essentialOnly); setAnswered(Boolean(stored)); setSavedAt(stored?.savedAt ?? null);
  }
  useEffect(() => {
    try { applyStored(window.localStorage.getItem(CONSENT_KEY)); } catch { setStorageError(true); }
    setReady(true);
    const sync = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === null) applyStored(event.newValue); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {
    if (savedAt === null) return;
    const expire = () => { if (Date.now() - savedAt >= CONSENT_LIFETIME) { revokeAnalytics(); setChoices(essentialOnly); setAnswered(false); setSavedAt(null); } };
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => { expire(); const remaining = CONSENT_LIFETIME - (Date.now() - savedAt); if (remaining > 0) timer = setTimeout(schedule, Math.min(remaining + 1, 2147483647)); };
    schedule();
    window.addEventListener('focus', expire);
    return () => { clearTimeout(timer); window.removeEventListener('focus', expire); };
  }, [savedAt]);
  function openPreferences() { trigger.current = document.activeElement as HTMLElement | null; setDraft(choices); setOpen(true); }
  function close() { setOpen(false); }
  function choose(value: CookieChoices) {
    if (!value.analytics) revokeAnalytics(); // Synchronous opt-out before React effects.
    setChoices(value); setAnswered(true); const now = Date.now(); setSavedAt(now);
    try { saveConsent(window.localStorage, value, now); setStorageError(false); } catch { setStorageError(true); }
    setStatus('Cookie preferences updated.'); close();
  }
  useEffect(() => {
    if (!open) return;
    const background = document.getElementById('site-content');
    const wasInert = background?.inert ?? false;
    if (background) background.inert = true;
    const previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('button')?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
      if (event.key !== 'Tab') return;
      const controls = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href]');
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => { if (background) background.inert = wasInert; document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', keyboard); if (trigger.current?.isConnected) trigger.current.focus(); };
  }, [open]);
  return <Context.Provider value={{ choices, openPreferences }}>{children}
    <div className="sr-only" role="status">{status}</div>
    {ready && !answered && !open && <section className="cookie-banner" aria-labelledby="cookie-banner-heading"><div><p className="eyebrow">Your privacy choices</p><h2 id="cookie-banner-heading">You decide what to allow.</h2><p>Optional analytics helps us understand website visits. Optional embeds connect to booking and video providers. Both stay off until you allow them. We store your choices on this device for up to 180 days.</p><Link to="/privacy">Privacy Policy {!isPrivacyPolicyApproved() && <span>(legal text pending)</span>}</Link></div><div className="cookie-actions"><button type="button" className="button button--outline" onClick={() => choose(essentialOnly)}>Reject optional cookies</button><button type="button" className="button button--outline" onClick={() => choose({ analytics: true, media: true })}>Accept optional cookies</button><button type="button" className="cookie-settings-link" onClick={openPreferences}>Choose preferences</button></div></section>}
    {storageError && ready && <p className="cookie-storage-note" role="status">Your browser could not save cookie preferences. Choices apply to this tab; you may be asked again on your next visit.</p>}
    {open && <div className="cookie-overlay"><div ref={panel} role="dialog" aria-modal="true" aria-labelledby="cookie-dialog-heading" aria-describedby="cookie-dialog-description" className="cookie-dialog"><button type="button" className="cookie-close" onClick={close}>Close preferences</button><p className="eyebrow">Privacy choices</p><h2 id="cookie-dialog-heading">Cookie preferences</h2><p id="cookie-dialog-description">Optional categories are off by default. Change your choices at any time using Cookie preferences in the footer.</p><div className="cookie-category"><h3>Essential functionality</h3><p>Always available. Your preference record contains choices and a timestamp, not your name or contact details. Spam protection loads only when requested to send an online enquiry.</p></div><label className="cookie-category" htmlFor="cookie-analytics"><span>Optional analytics<span>Allow Google Analytics to measure page visits. We do not send enquiry fields or directory-search terms.</span></span><input id="cookie-analytics" type="checkbox" checked={draft.analytics} onChange={event => setDraft(value => ({ ...value, analytics: event.target.checked }))} /></label><label className="cookie-category" htmlFor="cookie-media"><span>Optional booking and video embeds<span>Allow Calendly and approved video players to load when requested. These providers may use cookies and receive connection information.</span></span><input id="cookie-media" type="checkbox" checked={draft.media} onChange={event => setDraft(value => ({ ...value, media: event.target.checked }))} /></label><p><Link to="/privacy" onClick={close}>Privacy Policy</Link></p><div className="cookie-actions"><button type="button" className="button button--outline" onClick={() => choose(essentialOnly)}>Reject optional cookies</button><button type="button" className="button button--outline" onClick={() => choose({ analytics: true, media: true })}>Accept optional cookies</button><button type="button" className="button button--primary" onClick={() => choose(draft)}>Save preferences</button></div></div></div>}
  </Context.Provider>;
}
