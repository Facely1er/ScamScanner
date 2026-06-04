import React from 'react';
import { FileText } from 'lucide-react';

const LAST_UPDATED = 'June 4, 2026';
const CONTACT_EMAIL = 'support@cyberstition.com';

export default function Terms() {
  return (
    <div className="grid container-lg">
      <section className="card">
        <div className="kicker d-flex items-center gap-8">
          <FileText size={16} /> Legal
        </div>
        <h1 className="h1">Terms of Service</h1>
        <p className="p opacity-7">Last updated: {LAST_UPDATED}</p>
      </section>

      <section className="card">
        <h2 className="h2">Acceptance</h2>
        <p className="p">
          By using Cyberstition you agree to these terms. If you do not agree, do not use the service.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">What Cyberstition Is</h2>
        <p className="p">
          Cyberstition is an on-device analysis tool that helps you identify potential scam
          indicators in messages, emails, images, and profiles. It provides risk indicators
          to inform your judgment — it is not a security product, does not guarantee detection,
          and does not block threats.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">No Guarantees</h2>
        <p className="p">
          Analysis results are indicators only. False positives and false negatives are possible.
          Cyberstition is not liable for any decisions made based on its output. Always verify
          suspicious content through independent channels before taking action.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Report Credits and License Keys</h2>
        <ul className="small pl-5 line-height-loose">
          <li>Credits are purchased as one-time, non-subscription digital goods.</li>
          <li>License keys are redeemed locally on your device and tied to that device's storage.</li>
          <li>Keys cannot be transferred between devices automatically — contact support with your receipt if you need a reissue.</li>
          <li>Refunds are available within 7 days of purchase for unused credit packs. Contact us at the email below.</li>
          <li>We reserve the right to invalidate keys that have been shared or distributed without authorisation.</li>
        </ul>
      </section>

      <section className="card">
        <h2 className="h2">Acceptable Use</h2>
        <p className="p mb-10">You agree not to use Cyberstition to:</p>
        <ul className="small pl-5 line-height-loose">
          <li>Harass, stalk, or surveil another person without their consent</li>
          <li>Circumvent security or authentication systems</li>
          <li>Reverse-engineer the license key validation system for fraudulent use</li>
          <li>Misrepresent analysis results to harm or deceive others</li>
        </ul>
      </section>

      <section className="card">
        <h2 className="h2">Intellectual Property</h2>
        <p className="p">
          Cyberstition and its content are owned by ERMITS. You may not copy, resell,
          or redistribute the software or its analysis output for commercial purposes
          without written permission.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Disclaimer of Warranties</h2>
        <p className="p">
          Cyberstition is provided "as is" without warranty of any kind. We do not warrant
          that the service will be uninterrupted, error-free, or that results will be accurate.
          Use at your own risk.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Limitation of Liability</h2>
        <p className="p">
          To the fullest extent permitted by law, ERMITS shall not be liable for any
          indirect, incidental, or consequential damages arising from your use of Cyberstition,
          including but not limited to losses from acting on analysis results.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Changes</h2>
        <p className="p">
          We may update these terms. The date at the top reflects the latest revision.
          Continued use after changes constitutes acceptance.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Contact</h2>
        <p className="p">
          Questions?{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-link">{CONTACT_EMAIL}</a>
        </p>
      </section>
    </div>
  );
}
