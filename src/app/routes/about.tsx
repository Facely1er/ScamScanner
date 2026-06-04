import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Shield } from 'lucide-react';
import TrustNotice from '../../components/common/TrustNotice';
import { appUrl } from '../config/product';

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
          <li><strong>On-device processing</strong>: All analysis runs locally in your browser — no server uploads.</li>
          <li><strong>Privacy-first</strong>: No data collection, tracking, or account monitoring.</li>
          <li><strong>Indicators only</strong>: Results are signals to inform your judgment, not definitive proof.</li>
          <li><strong>Independent verification</strong>: Always verify suspicious content through a separate channel.</li>
        </ul>
      </section>

      <section className="card">
        <h2 className="h2">Pricing</h2>
        <p className="p">Free to investigate. Pay only when you need a PDF report.</p>
        <ul className="small" style={{ marginTop: 12, paddingLeft: 20 }}>
          <li>5 free guided investigations per month</li>
          <li>Report credits from $4.99 — one-time purchase, no subscription</li>
          <li>No account required</li>
          <li>All analysis stays on your device</li>
        </ul>
        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <a
            href={appUrl}
            className="btn primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <Shield size={16} /> Open App
          </a>
          <Link to="/pricing" className="btn">View Pricing</Link>
        </div>
      </section>

      <section className="card">
        <h2 className="h2">Frequently Asked Questions</h2>
        <div style={{ marginTop: 16 }}>
          <Faq q="How do I get report credits?">
            Purchase a credit pack from our pricing page via Stripe or Gumroad.
            You'll receive a license key by email — enter it in the app to add credits instantly.
            No account required.
          </Faq>
          <Faq q="How accurate are the risk indicators?">
            Cyberstition provides risk indicators based on common patterns and signals.
            These are not guarantees — they help inform your judgment.
            Always verify suspicious content through independent channels.
            False positives and false negatives are possible.
          </Faq>
          <Faq q="What types of threats does it detect?">
            Cyberstition analyzes messages for phishing, scam patterns, and manipulation tactics.
            It checks social profiles for authenticity signals, inspects image metadata, and analyzes
            email headers for spoofing. It does not detect malware or block threats.
          </Faq>
          <Faq q="Does it work offline?">
            Yes. All analysis happens on your device. Once the app is loaded, you can use all tools
            without an internet connection. No data is sent to external servers.
          </Faq>
          <Faq q="What browsers are supported?">
            Cyberstition works in modern browsers — Chrome, Firefox, Safari, and Edge — on desktop
            and mobile. No installation required.
          </Faq>
          <Faq q="Is my data private?">
            Yes. All analysis runs on your device. No content, reports, or personal information is
            sent to any server. Reports are stored locally in your browser. Clearing browser data
            will remove saved reports.
          </Faq>
          <Faq q="Can I get a refund?">
            Refund requests for Stripe purchases can be submitted within 7 days of purchase by
            contacting support. Gumroad purchases follow Gumroad's standard refund policy.
            Because license keys are delivered digitally, refunds are assessed case by case.
          </Faq>
          <Faq q="What happens if I lose my license key?">
            Keys are stored after redemption in your browser's local storage. If you redeem on a
            new device, contact support with your purchase receipt and we'll reissue the key.
          </Faq>
        </div>
      </section>

      <TrustNotice />
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 className="h3">{q}</h3>
      <p className="small" style={{ opacity: 0.9, marginTop: 4 }}>{children}</p>
    </div>
  );
}
