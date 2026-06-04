import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';
import { appUrl } from '../config/product';

export default function WebShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>

      <div className="header">
        <div className="inner">
          <NavLink to="/" className="brand-link">
            <div className="brand">
              <img src="/cyberstition_logo.png" alt="Cyberstition logo" className="brand-logo" />
              <div className="brand-text">
                <strong>Cyberstition™</strong>
                <span className="brand-subtitle">Trust Before You Click.</span>
                <span className="brand-subtext">by ERMITS</span>
              </div>
            </div>
          </NavLink>

          <nav className="topnav" aria-label="Primary navigation">
            <NavLink to="/how-it-works" className={({ isActive }) => `navitem${isActive ? ' active' : ''}`}>
              How It Works
            </NavLink>
            <NavLink to="/pricing" className={({ isActive }) => `navitem${isActive ? ' active' : ''}`}>
              Pricing
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `navitem${isActive ? ' active' : ''}`}>
              About
            </NavLink>
          </nav>

          <div className="header-actions">
            <ThemeToggle />
            <a href={appUrl} className="btn primary">
              Open App
            </a>
            {/* Hamburger — visible only on mobile where topnav is hidden */}
            <button
              className="btn mobile-menu-btn d-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div
          className="mobile-nav-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <nav
            className="mobile-nav-drawer"
            aria-label="Mobile navigation"
            onClick={(e) => e.stopPropagation()}
          >
            {[
              { to: '/how-it-works', label: 'How It Works' },
              { to: '/pricing', label: 'Pricing' },
              { to: '/about', label: 'About' },
              { to: '/privacy', label: 'Privacy Policy' },
              { to: '/terms', label: 'Terms' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `navitem${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
            <div className="mt-16">
              <a href={appUrl} className="btn primary w-full justify-center">
                Open App
              </a>
            </div>
          </nav>
        </div>
      )}

      <main id="main-content" className="container app-main">{children}</main>

      <footer className="footer">
        <div className="inner">
          <div className="brand">
            <img src="/cyberstition_logo.png" alt="Cyberstition logo" className="brand-logo" />
            <strong>Cyberstition™</strong>
          </div>
          <p className="footer-tagline">Trust Before You Click.</p>
          <div className="footer-links">
            <NavLink to="/how-it-works" className="footer-link">How It Works</NavLink>
            <NavLink to="/pricing" className="footer-link">Pricing</NavLink>
            <NavLink to="/about" className="footer-link">About</NavLink>
            <NavLink to="/privacy" className="footer-link">Privacy Policy</NavLink>
            <NavLink to="/terms" className="footer-link">Terms</NavLink>
          </div>
        </div>
      </footer>
    </>
  );
}
