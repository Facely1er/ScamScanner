import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PreferencesProvider } from './contexts/PreferencesContext';
import AppShell from './app/layout/AppShell';
import Home from './app/routes/home';
import Scan from './app/routes/scan';
import Tools from './app/routes/tools';
import HowItWorks from './app/routes/how-it-works';
import Messages from './app/routes/messages';
import Profiles from './app/routes/profiles';
import Images from './app/routes/images';
import Email from './app/routes/email';
import About from './app/routes/about';
import More from './app/routes/more';
import Dashboard from './app/routes/dashboard';
import Account from './app/routes/account';
import Pricing from './app/routes/pricing';

export default function App() {
  return (
    <PreferencesProvider>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <AppShell>
        <div id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/messages" element={<Navigate to="/tools" replace />} />
            <Route path="/profiles" element={<Navigate to="/tools" replace />} />
            <Route path="/images" element={<Navigate to="/tools" replace />} />
            <Route path="/email" element={<Navigate to="/tools" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/more" element={<More />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AppShell>
    </PreferencesProvider>
  );
}
