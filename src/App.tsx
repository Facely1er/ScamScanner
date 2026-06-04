import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PreferencesProvider } from './contexts/PreferencesContext';
import { IS_WEB_BUILD } from './config/env';
import AppShell from './app/layout/AppShell';
import WebShell from './app/layout/WebShell';

import Home from './app/routes/home';
import Scan from './app/routes/scan';
import Tools from './app/routes/tools';
import HowItWorks from './app/routes/how-it-works';
import About from './app/routes/about';
import Pricing from './app/routes/pricing';
import Privacy from './app/routes/privacy';
import Terms from './app/routes/terms';
import More from './app/routes/more';
import Dashboard from './app/routes/dashboard';
import Account from './app/routes/account';
import Login from './app/routes/login';
import Signup from './app/routes/signup';
import DashboardSessions from './app/routes/dashboard-sessions';
import NotFound from './app/routes/not-found';

export default function App() {
  return (
    <PreferencesProvider>
      {IS_WEB_BUILD ? <WebRoutes /> : <AppRoutes />}
    </PreferencesProvider>
  );
}

function WebRoutes() {
  return (
    <WebShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </WebShell>
  );
}

function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/more" element={<More />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/sessions" element={<DashboardSessions />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/messages" element={<Navigate to="/tools" replace />} />
        <Route path="/profiles" element={<Navigate to="/tools" replace />} />
        <Route path="/images" element={<Navigate to="/tools" replace />} />
        <Route path="/email" element={<Navigate to="/tools" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}
