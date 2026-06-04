import React from 'react';
import { Check, ExternalLink, Shield } from 'lucide-react';
import { brandName, appUrl } from '../config/product';

const PACKAGES = [
  {
    id: 'R1',
    label: '1 Report',
    price: '$4.99',
    gumroadUrl: 'https://cyberstition.gumroad.com/l/report-1',
    features: ['1 PDF investigation report', 'Full signal breakdown', 'Narrative summary', 'Recommended actions'],
  },
  {
    id: 'R5',
    label: '5 Reports',
    price: '$14.99',
    popular: true,
    gumroadUrl: 'https://cyberstition.gumroad.com/l/report-5',
    features: ['5 PDF investigation reports', 'Full signal breakdown', 'Narrative summary', 'Recommended actions'],
  },
  {
    id: 'R20',
    label: '20 Reports',
    price: '$39.99',
    gumroadUrl: 'https://cyberstition.gumroad.com/l/report-20',
    features: ['20 PDF investigation reports', 'Full signal breakdown', 'Narrative summary', 'Recommended actions'],
  },
];

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ marginBottom: 10, display: 'flex', alignItems: 'start', gap: 10 }}>
      <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
      <span className="small">{children}</span>
    </li>
  );
}

export default function Pricing() {
  return (
    <div className="grid" style={{ gap: 16, maxWidth: 640, margin: '0 auto' }}>
      <section className="card">
        <h1 className="h1">{brandName} Pricing</h1>
        <p className="p" style={{ marginTop: 8 }}>
          Free to investigate. Pay only when you need a PDF report.
          No subscription, no account, no data collected.
        </p>
      </section>

      {/* Free tier */}
      <section className="card" style={{ border: '1px solid var(--border)' }}>
        <div className="kicker" style={{ marginBottom: 8 }}>Free</div>
        <h2 className="h2" style={{ margin: 0 }}>Investigations</h2>
        <ul style={{ marginTop: 16, paddingLeft: 0, listStyle: 'none' }}>
          <CheckItem>5 guided investigations per month</CheckItem>
          <CheckItem>Full risk score and confidence rating</CheckItem>
          <CheckItem>Pattern detection across all evidence types</CheckItem>
          <CheckItem>Cross-signal correlation</CheckItem>
          <CheckItem>Recommended actions</CheckItem>
          <CheckItem>Investigation history saved locally</CheckItem>
        </ul>
        <a href={appUrl} className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
          Open App <ExternalLink size={14} />
        </a>
      </section>

      {/* Credit packs */}
      <div className="kicker" style={{ marginTop: 8 }}>Report Credits — one-time purchase</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PACKAGES.map(pkg => (
          <section
            key={pkg.id}
            className="card"
            style={{
              border: pkg.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
              backgroundColor: pkg.popular ? 'var(--bg-secondary)' : 'var(--bg)',
            }}
          >
            {pkg.popular && (
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
                Best value
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 className="h2" style={{ margin: 0 }}>{pkg.label}</h2>
              <span style={{ fontSize: 22, fontWeight: 800 }}>{pkg.price}</span>
            </div>
            <ul style={{ paddingLeft: 0, listStyle: 'none', marginBottom: 16 }}>
              {pkg.features.map(f => <CheckItem key={f}>{f}</CheckItem>)}
            </ul>
            <a
              href={pkg.gumroadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              Buy {pkg.label} <ExternalLink size={14} />
            </a>
          </section>
        ))}
      </div>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Shield size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
          <p className="small" style={{ opacity: 0.8, margin: 0 }}>
            All analysis happens locally on your device. No data is collected or transmitted.
            Report credits are redeemed with a license key and stored on-device.
            No account required.
          </p>
        </div>
      </section>
    </div>
  );
}
