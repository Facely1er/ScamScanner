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
              className="btn mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{ display: 'none' }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 200,
            background: 'rgba(0,0,0,0.5)',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <nav
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 260,
              height: '100%',
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border)',
              padding: '80px 24px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
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
                style={{ fontSize: 15, padding: '10px 12px', borderRadius: 8 }}
              >
                {label}
              </NavLink>
            ))}
            <div style={{ marginTop: 16 }}>
              <a href={appUrl} className="btn primary" style={{ width: '100%', justifyContent: 'center' }}>
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
