import React from 'react';
import { Check } from 'lucide-react';
import { brandName, priceLabel } from '../config/product';

export default function Pricing() {
  return (
    <div className="grid" style={{ gap: 14, maxWidth: 600, margin: '0 auto' }}>
      <section className="card">
        <h1 className="h1">{brandName} Access</h1>
        <p className="p" style={{ marginTop: 8 }}>
          All analysis tools are available in the web app with no account and no subscription.
        </p>
      </section>

      <section className="card" style={{ 
        border: '2px solid var(--primary)', 
        backgroundColor: 'var(--bg-secondary)' 
      }}>
        <div className="kicker" style={{ color: 'var(--primary)' }}>
          Optional Support
        </div>
        <h2 className="h2" style={{ marginTop: 8 }}>What You Get</h2>
        <ul style={{ marginTop: 16, paddingLeft: 0, listStyle: 'none' }}>
          <li style={{ marginBottom: 12, display: 'flex', alignItems: 'start', gap: 12 }}>
            <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <span>Unlimited analyses</span>
          </li>
          <li style={{ marginBottom: 12, display: 'flex', alignItems: 'start', gap: 12 }}>
            <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <span>Full signal explanations</span>
          </li>
          <li style={{ marginBottom: 12, display: 'flex', alignItems: 'start', gap: 12 }}>
            <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <span>Batch checks</span>
          </li>
          <li style={{ marginBottom: 12, display: 'flex', alignItems: 'start', gap: 12 }}>
            <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <span>Local export</span>
          </li>
          <li style={{ marginBottom: 12, display: 'flex', alignItems: 'start', gap: 12 }}>
            <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <span>No subscription. No account.</span>
          </li>
        </ul>

        <p className="small" style={{ marginTop: 16, opacity: 0.85 }}>
          You can optionally support ongoing development via one-time pricing ({priceLabel}).
        </p>
      </section>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <p className="small" style={{ opacity: 0.8 }}>
          All analysis happens locally on your device. No data is collected or transmitted. 
          Your privacy is protected.
        </p>
      </section>
    </div>
  );
}
