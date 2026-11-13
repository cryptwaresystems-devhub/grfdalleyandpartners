import { CookieConsentProvider } from '../components/privacy/CookieConsent';
import { AnalyticsBridge } from '../components/AnalyticsBridge';
import { usePresentationMode } from '../lib/presentation';
import { Outlet, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { RouteEffects } from '../components/RouteEffects';
export function FoundationLayout() {
 const { pathname } = useLocation();
 const mode = usePresentationMode();
 return <MotionConfig reducedMotion="user"><CookieConsentProvider><AnalyticsBridge /><div id="site-content"><div id="top" /><RouteEffects/><a href="#main-content" className="skip-link">Skip to content</a><SiteHeader/>{mode === 'management-preview' && <div className="management-preview-banner">Management preview: includes content awaiting publication approval.</div>}<main id="main-content" tabIndex={-1}><Outlet/></main><SiteFooter showConversation={pathname !== '/'} officesId={pathname.replace(/\/+$/, '') === '/contact' ? 'footer-offices' : 'offices'}/></div></CookieConsentProvider></MotionConfig>;
}
