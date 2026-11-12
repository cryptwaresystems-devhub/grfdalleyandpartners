import { Outlet, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { RouteEffects } from '../components/RouteEffects';
export function FoundationLayout() {
 const { pathname } = useLocation();
 return <MotionConfig reducedMotion="user"><div id="top" /><RouteEffects/><a href="#main-content" className="skip-link">Skip to content</a><SiteHeader/><main id="main-content" tabIndex={-1}><Outlet/></main><SiteFooter showConversation={pathname !== '/'} officesId={pathname.replace(/\/+$/, '') === '/contact' ? 'footer-offices' : 'offices'}/></MotionConfig>;
}
