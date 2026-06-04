import React from 'react';
import { Shield } from 'lucide-react';

const LAST_UPDATED = 'June 4, 2025';
const CONTACT_EMAIL = 'support@cyberstition.com';

export default function Privacy() {
  return (
    <div className="grid" style={{ maxWidth: 720, margin: '0 auto' }}>
      <section className="card">
        <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={16} /> Legal
        </div>
        <h1 className="h1">Privacy Policy</h1>
        <p className="p" style={{ opacity: 0.7 }}>Last updated: {LAST_UPDATED}</p>
      </section>

      <section className="card">
        <h2 className="h2">Summary</h2>
        <p className="p">
          Cyberstition is a privacy-first tool. All analysis runs locally on your device.
          We do not collect, store, or transmit your personal data or the content you analyze.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Data We Do Not Collect</h2>
        <p className="p" style={{ marginBottom: 12 }}>We do not collect or transmit:</p>
        <ul className="small" style={{ paddingLeft: 20, lineHeight: 1.9 }}>
          <li>Messages, emails, or content you submit for analysis</li>
          <li>Images or files you upload</li>
          <li>Profile information you enter</li>
          <li>Investigation results or risk scores</li>
          <li>Browser history or device identifiers</li>
          <li>IP addresses or location data</li>
        </ul>
      </section>

      <section className="card">
        <h2 className="h2">Local Storage</h2>
        <p className="p">
          Cyberstition stores the following data locally in your browser using localStorage.
          This data never leaves your device:
        </p>
        <ul className="small" style={{ paddingLeft: 20, lineHeight: 1.9, marginTop: 10 }}>
          <li>Investigation session history and results</li>
          <li>Report credits balance and redeemed license keys</li>
          <li>App preferences (theme, analysis settings)</li>
          <li>Monthly investigation usage counter</li>
        </ul>
        <p className="p" style={{ marginTop: 12 }}>
          You can clear all stored data at any time by clearing your browser's site data for this domain.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Payments</h2>
        <p className="p">
          Credit pack purchases are processed by Stripe or Gumroad. When you purchase,
          you interact directly with those platforms and are subject to their respective
          privacy policies. Cyberstition does not receive or store your payment details.
        </p>
        <p className="p" style={{ marginTop: 10 }}>
          After purchase, a license key is delivered to you by email. The key is redeemed
          locally in the app. No account creation is required.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Cookies and Tracking</h2>
        <p className="p">
          Cyberstition does not use cookies, analytics, tracking pixels, or third-party
          scripts. There is no advertising or behavioural tracking of any kind.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Third-Party Services</h2>
        <p className="p">
          The app itself makes no external API calls during analysis. The only external
          connections occur when you click a purchase link (Stripe or Gumroad), which
          opens those platforms in a new tab.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Children</h2>
        <p className="p">
          Cyberstition is not directed at children under 13. We do not knowingly collect
          any information from children.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Changes to This Policy</h2>
        <p className="p">
          We may update this policy from time to time. The date at the top of this page
          reflects the most recent revision. Continued use of the app after changes
          constitutes acceptance of the updated policy.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Contact</h2>
        <p className="p">
          Questions about this policy? Email us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--primary)' }}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </div>
  );
}
