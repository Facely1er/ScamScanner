import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Shield, Wrench, FileText, Settings } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';
import LanguageToggle from '../../components/common/LanguageToggle';
import { useLocale } from '../../contexts/LocaleContext';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`} role="banner">
        <div className="inner">
          <NavLink to="/" className="brand-link" aria-label={t('nav.ariaCyberstitionHome')}>
            <div className="brand">
              <img
                src="/cyberstition_logo.png"
                alt={t('product.brandName') + ' Logo'}
                className="brand-logo"
                loading="eager"
              />
              <div className="brand-text">
                <strong className="brand-name">{t('product.brandName')}</strong>
                <span className="brand-subtitle">{t('product.tagline')}</span>
                <span className="brand-subtext">{t('product.publisher')}</span>
              </div>
            </div>
          </NavLink>

          <div className="header-actions">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container app-main">{children}</main>

      <nav className="bottomnav" aria-label="Primary mobile navigation">
        <NavItem to="/" label={t('nav.homeDashboard')} icon={<HomeIcon size={20} />} end ariaLabel={t('nav.ariaHomeDashboard')} />
        <NavItem to="/scan" label={t('nav.scan')} icon={<Shield size={20} />} />
        <NavItem to="/tools" label={t('nav.tools')} icon={<Wrench size={20} />} />
        <NavItem to="/dashboard" label={t('nav.dashboard')} icon={<FileText size={20} />} ariaLabel={t('nav.ariaDashboard')} />
        <NavItem to="/account" label={t('nav.settings')} icon={<Settings size={20} />} ariaLabel={t('nav.ariaAccount')} />
      </nav>

      <footer className="footer" role="contentinfo">
        <div className="inner">
          <div className="brand">
            <img
              src="/cyberstition_logo.png"
              alt={t('product.brandName') + ' Logo'}
              className="brand-logo"
              loading="lazy"
            />
            <strong>{t('product.brandName')}</strong>
          </div>
          <p className="footer-tagline">{t('nav.footerTagline')}</p>
          <div className="footer-links">
            <NavLink to="/about" className="footer-link">{t('nav.about')}</NavLink>
            <NavLink to="/how-it-works" className="footer-link">{t('nav.howItWorks')}</NavLink>
            <NavLink to="/privacy" className="footer-link">{t('nav.privacy')}</NavLink>
            <NavLink to="/terms" className="footer-link">{t('nav.terms')}</NavLink>
          </div>
        </div>
      </footer>
    </>
  );
}

function NavItem({ to, label, icon, end, ariaLabel }: { to: string; label: string; icon: React.ReactNode; end?: boolean; ariaLabel?: string }) {
  const location = useLocation();
  const isActive = end
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      end={end}
      className={`navitem ${isActive ? 'active' : ''}`}
      aria-label={ariaLabel ?? label}
      aria-current={isActive ? 'page' : undefined}
    >
      {React.cloneElement(icon as React.ReactElement, { 'aria-hidden': true })}
      <span>{label}</span>
    </NavLink>
  );
}
