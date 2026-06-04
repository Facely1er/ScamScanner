import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from '../../components/common/ThemeToggle';
import { appUrl } from '../config/product';

export default function WebShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="header">
        <div className="inner">
          <NavLink to="/" className="brand-link">
            <div className="brand">
              <img src="/cyberstition_logo.png" alt="Cyberstition" className="brand-logo" />
              <div className="brand-text">
                <strong>Cyberstition™</strong>
                <span className="brand-subtitle">Trust Before You Click.</span>
                <span className="brand-subtext">by ERMITS</span>
              </div>
            </div>
          </NavLink>

          <nav className="topnav" aria-label="Primary">
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
          </div>
        </div>
      </div>

      <main className="container app-main">{children}</main>

      <footer className="footer">
        <div className="inner">
          <div className="brand">
            <img src="/cyberstition_logo.png" alt="Cyberstition" className="brand-logo" />
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
