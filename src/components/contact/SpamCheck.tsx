import { useEffect, useRef, useState } from 'react';
interface Turnstile { render: (element: HTMLElement, options: object) => string; remove: (id: string) => void }
declare global { interface Window { turnstile?: Turnstile } }
export function SpamCheck({ siteKey, onToken }: { siteKey: string; onToken: (value: string) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  useEffect(() => { callback.current = onToken; }, [onToken]);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let widget: string | undefined; let cancelled = false;
    const render = () => { if (!cancelled && container.current && window.turnstile && !widget) widget = window.turnstile.render(container.current, { sitekey: siteKey, action: 'contact', size: 'flexible', callback: (token: string) => callback.current(token), 'expired-callback': () => callback.current(''), 'error-callback': () => { callback.current(''); setError(true); } }); };
    let script = document.querySelector<HTMLScriptElement>('script[data-contact-turnstile]');
    if (!script) { script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.dataset.contactTurnstile = 'true'; document.head.append(script); }
    script.addEventListener('load', render); const failed = () => setError(true); script.addEventListener('error', failed); render();
    const timeout = setTimeout(() => { if (!widget) setError(true); }, 12000);
    return () => { cancelled = true; clearTimeout(timeout); script.removeEventListener('load', render); script.removeEventListener('error', failed); if (widget) window.turnstile?.remove(widget); };
  }, [enabled, siteKey]);
  return <div className="spam-check">{!enabled && <><p>Enable the Cloudflare spam check to send online. This loads a third-party security service.</p><button type="button" className="button button--outline" onClick={() => setEnabled(true)}>Enable spam check</button></>}<div ref={container} />{error && <p role="alert">The spam check could not load or expired. <button type="button" onClick={() => { setEnabled(false); setError(false); onToken(''); if (!window.turnstile) document.querySelector('script[data-contact-turnstile]')?.remove(); }}>Retry spam check</button> or use the email option.</p>}</div>;
}
