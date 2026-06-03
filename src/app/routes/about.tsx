import React from 'react';
import TrustNotice from '../../components/common/TrustNotice';
import { priceLabel } from '../config/product';

export default function About() {
  return (
    <div className="grid">
      <section className="card">
        <h1 className="h1">How Cyberstition Works</h1>
        <p className="p">
          Cyberstition analyzes content on your device to identify deception and manipulation signals. 
          It does not monitor accounts, block messages, or guarantee detection.
        </p>
        <hr />
        <ul className="small">
          <li><strong>On-device processing</strong>: All analysis runs locally in your browser—no server uploads.</li>
          <li><strong>Privacy-first</strong>: No data collection, tracking, or account monitoring.</li>
          <li><strong>Indicators only</strong>: Results are signals to inform your judgment, not definitive proof.</li>
          <li><strong>Independent verification</strong>: Always verify suspicious content through a separate channel.</li>
        </ul>
      </section>

      <section className="card">
        <h2 className="h2">Access</h2>
        <p className="p">
          Cyberstition is fully available in the web app with no account and no subscription.
        </p>
        <ul className="small" style={{ marginTop: 12, paddingLeft: 20 }}>
          <li>All core analysis tools are available by default</li>
          <li>Optional one-time support pricing — {priceLabel}</li>
          <li>No subscription</li>
          <li>No account required</li>
          <li>Local-only analysis</li>
        </ul>
      </section>

      <section className="card">
        <h2 className="h2">Frequently Asked Questions</h2>
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">How do I purchase the app?</h3>
            <p className="small" style={{ opacity: 0.9 }}>
              You can use the full web app immediately. Optional one-time support pricing is {priceLabel} on the pricing page.
            </p>
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">How accurate are the risk indicators?</h3>
            <p className="small" style={{ opacity: 0.9 }}>
              Cyberstition provides risk indicators based on common patterns and signals. These are not guarantees—they help inform your judgment. 
              Always verify suspicious content through independent channels. False positives and false negatives are possible.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">What types of threats does it detect?</h3>
            <p className="small" style={{ opacity: 0.9 }}>
              Cyberstition analyzes messages for phishing, scam patterns, and AI-generated manipulation. It checks social profiles for authenticity signals, 
              inspects image metadata for manipulation indicators, and analyzes email headers for spoofing. It does not detect malware or block threats.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">Does it work offline?</h3>
            <p className="small" style={{ opacity: 0.9 }}>
              Yes! All analysis happens on your device. Once the web app is loaded, you can use all tools without an internet connection. 
              No data is sent to external servers.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">What browsers/devices are supported?</h3>
            <p className="small" style={{ opacity: 0.9 }}>
              Cyberstition works in modern browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile devices. 
              For best results, keep your browser updated.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">Is my data private?</h3>
            <p className="small" style={{ opacity: 0.9 }}>
              Yes. All analysis runs on your device. No content, reports, or personal information is sent to any server. 
              Reports are stored locally in your browser. Clearing browser data will remove saved reports.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">Can I get a refund?</h3>
            <p className="small" style={{ opacity: 0.9 }}>
              If you choose optional one-time support, refund terms are provided at checkout.
            </p>
          </div>
        </div>
      </section>

      <TrustNotice />
    </div>
  );
}
