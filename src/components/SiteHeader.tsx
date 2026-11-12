import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { navigation } from '../data/navigation';
import { Container } from './Container';
import { ButtonLink } from './Button';

const aboutLinks = [
  { to: '/about', label: 'Our firm', description: 'Get to know G.R.F. Dalley & Partners' },
  { to: '/people', label: 'Our people', description: 'Meet the team' },
  { to: '/contact#offices', label: 'Our offices', description: 'Find your point of contact' },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const aboutButton = useRef<HTMLButtonElement>(null);
  const aboutRoot = useRef<HTMLDivElement>(null);
  const mobilePanel = useRef<HTMLDivElement>(null);
  const { pathname, hash } = useLocation();

  useEffect(() => { setMobileOpen(false); setAboutOpen(false); }, [pathname, hash]);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!aboutRoot.current?.contains(event.target as Node)) setAboutOpen(false);
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (mobileOpen) { setMobileOpen(false); menuButton.current?.focus(); }
      if (aboutOpen) { setAboutOpen(false); aboutButton.current?.focus(); }
    }
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [mobileOpen, aboutOpen]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 80rem)');
    function resize() { setMobileOpen(false); setAboutOpen(false); }
    desktop.addEventListener('change', resize);
    return () => desktop.removeEventListener('change', resize);
  }, []);
  useEffect(() => {
    if (mobileOpen) mobilePanel.current?.querySelector<HTMLAnchorElement>('a')?.focus();
  }, [mobileOpen]);

  function close() { setMobileOpen(false); setAboutOpen(false); }

  return <header className="site-header">
    <div className="header-rule" aria-hidden="true" />
    <Container className="header-inner">
      <Link to="/" className="brand" onClick={close} aria-label="G.R.F. Dalley & Partners home"><img src="/assets/grf-logo.jpg" width="264" height="24" alt="G.R.F. Dalley & Partners" /><span>Legal practitioners & consultants</span></Link>
      <nav aria-label="Main navigation" className="desktop-navigation">
        {navigation.map(item => item.path === '/about' ? <div key={item.path} className="nav-dropdown" ref={aboutRoot} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setAboutOpen(false); }}>
          <div className="nav-dropdown__trigger"><NavLink to={item.path} className="nav-link" onClick={close}>{item.label}</NavLink><button ref={aboutButton} type="button" className="dropdown-toggle" aria-label="About Us submenu" aria-expanded={aboutOpen} aria-controls="about-submenu" onClick={() => setAboutOpen(!aboutOpen)} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); setAboutOpen(true); requestAnimationFrame(() => document.querySelector<HTMLAnchorElement>('#about-submenu a')?.focus()); } }}><ChevronDown size={13} aria-hidden="true" /></button></div>
          <div id="about-submenu" className="dropdown-panel" hidden={!aboutOpen}><p className="eyebrow">Discover the firm</p>{aboutLinks.map(link => <Link key={link.to} to={link.to} onClick={close}><span><strong>{link.label}</strong><small>{link.description}</small></span><ArrowUpRight size={16} aria-hidden="true" /></Link>)}</div>
        </div> : <NavLink key={item.path} to={item.path} end={item.path === '/'} className="nav-link" onClick={close}>{item.label}</NavLink>)}
      </nav>
      <ButtonLink to="/contact" arrow className="header-cta" onClick={close}>Start a Conversation</ButtonLink>
      <button ref={menuButton} type="button" className="mobile-toggle" aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}<span>Menu</span></button>
    </Container>
    <div ref={mobilePanel} id="mobile-navigation" className="mobile-panel" hidden={!mobileOpen} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node) && event.relatedTarget !== menuButton.current) setMobileOpen(false); }}>
      <Container><nav aria-label="Mobile navigation">{navigation.map((item, index) => <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={close}><span className="mobile-nav-index" aria-hidden="true">0{index + 1}</span>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></NavLink>)}</nav><ButtonLink to="/contact" arrow onClick={close}>Start a Conversation</ButtonLink><p className="mobile-panel__note">G.R.F. Dalley & Partners</p></Container>
    </div>
  </header>;
}
