import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PreferencesProvider } from './contexts/PreferencesContext';
import AppShell from './app/layout/AppShell';
import Home from './app/routes/home';
import Scan from './app/routes/scan';
import Tools from './app/routes/tools';
import HowItWorks from './app/routes/how-it-works';
import About from './app/routes/about';
import More from './app/routes/more';
import Dashboard from './app/routes/dashboard';
import Account from './app/routes/account';
import Pricing from './app/routes/pricing';
import Privacy from './app/routes/privacy';
import Terms from './app/routes/terms';
import { ToastContainer } from './components/common/Toast';
import Onboarding, { useOnboarding } from './components/common/Onboarding';
import { IS_APP_BUILD } from './config/env';

export default function App() {
  const { showOnboarding, finishOnboarding } = useOnboarding();

  return (
    <PreferencesProvider>
      {IS_APP_BUILD && showOnboarding && <Onboarding onComplete={finishOnboarding} />}
      <AppShell>
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
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
      <ToastContainer />
    </PreferencesProvider>
  );
}
