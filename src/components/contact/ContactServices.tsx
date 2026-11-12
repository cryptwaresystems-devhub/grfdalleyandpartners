import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { configuredBookingUrl } from '../../lib/contact';
interface Services { deliveryConfigured: boolean; turnstileSiteKey: string | null; bookingUrl: string | null }
const pending: Services = { deliveryConfigured: false, turnstileSiteKey: null, bookingUrl: null };
const Context = createContext(pending);
export const useContactServices = () => useContext(Context);
export function ContactServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState(pending);
  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/contact', { signal: controller.signal, cache: 'no-store' }).then(async response => {
      if (!response.ok) return;
      const value = await response.json();
      if (!controller.signal.aborted) setServices({ deliveryConfigured: value.deliveryConfigured === true && typeof value.turnstileSiteKey === 'string', turnstileSiteKey: typeof value.turnstileSiteKey === 'string' ? value.turnstileSiteKey : null, bookingUrl: configuredBookingUrl(typeof value.bookingUrl === 'string' ? value.bookingUrl : null) });
    }).catch(() => { /* Email fallback remains available when the service is unavailable. */ });
    const timeout = setTimeout(() => controller.abort(), 8000);
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);
  return <Context.Provider value={services}>{children}</Context.Provider>;
}
