import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Shield, Wrench, HelpCircle, Settings, FileText, MoreHorizontal } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
          <NavLink to="/" className="brand-link" aria-label="Cyberstition Home">
            <div className="brand">
              <img
                src="/cyberstition_logo.png"
                alt="Cyberstition Logo"
                className="brand-logo"
                loading="eager"
              />
              <div className="brand-text">
                <strong>Cyberstition™</strong>
                <span className="brand-subtitle">Trust Signals</span>
                <span className="brand-subtext">by ERMITS</span>
              </div>
            </div>
          </NavLink>

          <nav className="topnav" aria-label="Primary navigation">
            <NavItem to="/" label="Home" icon={<HomeIcon size={18} />} end />
            <NavItem to="/scan" label="Scan" icon={<Shield size={18} />} />
            <NavItem to="/tools" label="Tools" icon={<Wrench size={18} />} />
            <NavItem to="/how-it-works" label="How it Works" icon={<HelpCircle size={18} />} />
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `btn ${isActive ? 'primary' : ''}`}
              aria-label="Dashboard - View analysis history"
              title="View Analysis History"
            >
              <FileText size={16} aria-hidden="true" />
            </NavLink>
            <NavLink
              to="/account"
              className={({ isActive }) => `btn ${isActive ? 'primary' : ''}`}
              aria-label="Account - Preferences and settings"
              title="Preferences and Settings"
            >
              <Settings size={16} aria-hidden="true" />
            </NavLink>
          </div>
        </div>
      </header>

      <main className="container app-main">{children}</main>

      <nav className="bottomnav" aria-label="Primary mobile navigation">
        <NavItem to="/" label="Home" icon={<HomeIcon size={20} />} end />
        <NavItem to="/scan" label="Scan" icon={<Shield size={20} />} />
        <NavItem to="/tools" label="Tools" icon={<Wrench size={20} />} />
        <NavItem to="/dashboard" label="History" icon={<FileText size={20} />} />
        <NavItem to="/account" label="Settings" icon={<Settings size={20} />} />
      </nav>

      <footer className="footer" role="contentinfo">
        <div className="inner">
          <div className="brand">
            <img
              src="/cyberstition_logo.png"
              alt="Cyberstition Logo"
              className="brand-logo"
              loading="lazy"
            />
            <strong>Cyberstition™</strong>
          </div>
          <p className="footer-tagline">Digital Safety Tools for Everyone</p>
          <div className="footer-links">
            <NavLink to="/about" className="footer-link">About</NavLink>
            <NavLink to="/how-it-works" className="footer-link">How it Works</NavLink>
            <NavLink to="/privacy" className="footer-link">Privacy</NavLink>
            <NavLink to="/terms" className="footer-link">Terms</NavLink>
          </div>
        </div>
      </footer>
    </>
  );
}

function NavItem({ to, label, icon, end }: { to: string; label: string; icon: React.ReactNode; end?: boolean }) {
  const location = useLocation();
  const isActive = end 
    ? location.pathname === to
    : location.pathname.startsWith(to);
  
  return (
    <NavLink 
      to={to} 
      end={end} 
      className={`navitem ${isActive ? 'active' : ''}`}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      {React.cloneElement(icon as React.ReactElement, { 'aria-hidden': true })}
      <span>{label}</span>
    </NavLink>
  );
}
