import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { createAnalyticsClient, registerAnalytics, type AnalyticsClient, type AnalyticsConfiguration } from '../lib/analytics';
import { isCookieNoticeApproved, isPrivacyPolicyApproved } from '../lib/privacy';
import { getRouteMetadata } from '../lib/route-metadata';
import { getRouteTitle } from '../lib/route-title';
import { useCookieConsent } from './privacy/CookieConsent';
const configuration: AnalyticsConfiguration = { measurementId: import.meta.env?.VITE_GA4_MEASUREMENT_ID ?? '', approvedPolicy: isPrivacyPolicyApproved(), approvedNotice: isCookieNoticeApproved(), manualPageViewsConfirmed: import.meta.env?.VITE_GA4_MANUAL_PAGEVIEWS_CONFIRMED === 'true' };
export function AnalyticsBridge({ config = configuration }: { config?: AnalyticsConfiguration }) {
  const { pathname } = useLocation();
  const { choices } = useCookieConsent();
  const client = useRef<AnalyticsClient | null>(null);
  // Register once per real mount. StrictMode's cleanup may stop the client;
  // the route effect restarts it without duplicating an initialized config.
  useEffect(() => { client.current ??= createAnalyticsClient(config, window, document); return registerAnalytics(client.current); }, [config]);
  useEffect(() => {
    client.current?.setConsent(choices.analytics);
    const path = getRouteTitle(pathname) === 'Page not found' ? '/not-found' : pathname.replace(/\/+$/, '') || '/';
    client.current?.pageView(path, getRouteMetadata(path).title);
  }, [pathname, choices.analytics, config]);
  return null;
}
