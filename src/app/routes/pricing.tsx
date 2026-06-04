import React from 'react';
import { Check } from 'lucide-react';
import { brandName, priceLabel } from '../config/product';

export default function Pricing() {
  return (
    <div className="grid container-md" style={{ gap: 14 }}>
      <section className="card">
        <h1 className="h1">{brandName} Access</h1>
        <p className="p mt-8">
          All analysis tools are available in the web app with no account and no subscription.
        </p>
      </section>

      <section className="card" style={{ border: '2px solid var(--primary)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="kicker text-primary">
          Optional Support
        </div>
        <h2 className="h2 mt-8">What You Get</h2>
        <ul className="mt-16" style={{ paddingLeft: 0, listStyle: 'none' }}>
          <li className="check-item">
            <Check size={18} className="text-primary flex-shrink-0 mt-2" />
            <span>Unlimited analyses</span>
          </li>
          <li className="check-item">
            <Check size={18} className="text-primary flex-shrink-0 mt-2" />
            <span>Full signal explanations</span>
          </li>
          <li className="check-item">
            <Check size={18} className="text-primary flex-shrink-0 mt-2" />
            <span>Batch checks</span>
          </li>
          <li className="check-item">
            <Check size={18} className="text-primary flex-shrink-0 mt-2" />
            <span>Local export</span>
          </li>
          <li className="check-item">
            <Check size={18} className="text-primary flex-shrink-0 mt-2" />
            <span>No subscription. No account.</span>
          </li>
        </ul>

        <p className="small mt-16 opacity-85">
          You can optionally support ongoing development via one-time pricing ({priceLabel}).
        </p>
      </section>

      <section className="card card-secondary">
        <p className="small opacity-8">
          All analysis happens locally on your device. No data is collected or transmitted.
          Your privacy is protected.
        </p>
      </section>
    </div>
  );
}
