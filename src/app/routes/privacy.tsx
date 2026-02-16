import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Share2, AlertCircle } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="grid" style={{ gap: 24, maxWidth: 900, margin: '0 auto' }}>
      <section className="card" style={{ border: '2px solid var(--border)' }}>
        <div className="kicker" style={{ marginBottom: 4 }}>
          <Shield size={16} /> Legal
        </div>
        <h1 className="h1" style={{ marginBottom: 10, paddingBottom: 0, border: 'none' }}>
          Privacy Policy
        </h1>
        <p className="small" style={{ opacity: 0.7 }}>
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: 14, marginBottom: 16 }}>
          <Lock size={24} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <h2 className="h2" style={{ marginBottom: 8 }}>Privacy-First Design</h2>
            <p className="p">
              Cyberstition – Trust Signals (ScamScanner) is built with privacy as a core principle. 
              All analysis happens locally on your device. We do not collect, store, or transmit your data.
            </p>
          </div>
        </div>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">What We Don't Do</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
            <Database size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <h3 className="h3" style={{ fontSize: 16, marginBottom: 6 }}>No Data Collection</h3>
              <p className="small" style={{ lineHeight: 1.7, opacity: 0.85 }}>
                We do not collect any personal information, messages, images, emails, or analysis results. 
                Everything stays on your device.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
            <Share2 size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <h3 className="h3" style={{ fontSize: 16, marginBottom: 6 }}>No Data Sharing</h3>
              <p className="small" style={{ lineHeight: 1.7, opacity: 0.85 }}>
                Since we don't collect data, we have nothing to share with third parties. 
                No advertisers, no data brokers, no partners.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
            <Eye size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <h3 className="h3" style={{ fontSize: 16, marginBottom: 6 }}>No Tracking</h3>
              <p className="small" style={{ lineHeight: 1.7, opacity: 0.85 }}>
                We do not use analytics, cookies, or tracking pixels. Your usage patterns remain private.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">How the App Works</h2>
        <p className="p">
          All analysis is performed using client-side JavaScript in your browser or device. When you analyze:
        </p>
        
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 20, marginTop: 12 }}>
          <li className="small" style={{ lineHeight: 1.7 }}>
            <strong>Messages:</strong> Pattern matching runs locally against known scam indicators
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            <strong>Images:</strong> Metadata extraction happens in your browser using standard JavaScript APIs
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            <strong>Emails:</strong> Header parsing and analysis occurs entirely on your device
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            <strong>Profiles:</strong> Risk assessment is calculated locally based on the information you provide
          </li>
        </ul>

        <div className="info-box primary" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <p className="small" style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Zero Backend:</strong> This app has no server infrastructure. There are no API calls, 
              no databases, and no cloud services involved in the analysis process.
            </p>
          </div>
        </div>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Local Storage</h2>
        <p className="p">
          The app uses your device's local storage to save:
        </p>
        
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 20, marginTop: 12 }}>
          <li className="small" style={{ lineHeight: 1.7 }}>
            Analysis history and scan sessions (only on your device)
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            Your preferences and settings
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            Onboarding completion status
          </li>
        </ul>

        <p className="p" style={{ marginTop: 16 }}>
          This data never leaves your device and can be cleared at any time through your browser or device settings.
        </p>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Payment Information</h2>
        <p className="p">
          If you purchase the app through app stores (iOS App Store, Google Play Store):
        </p>
        
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 20, marginTop: 12 }}>
          <li className="small" style={{ lineHeight: 1.7 }}>
            Payment processing is handled entirely by Apple or Google
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            We do not receive or store your payment information
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            Refer to <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Apple's Privacy Policy</a> or <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Google's Privacy Policy</a> for their data practices
          </li>
        </ul>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Children's Privacy</h2>
        <p className="p">
          This app does not collect any personal information from anyone, including children under 13. 
          The app is designed to be safe for users of all ages.
        </p>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Changes to This Policy</h2>
        <p className="p">
          We may update this Privacy Policy from time to time. Any changes will be reflected with an updated 
          "Last Updated" date at the top of this page. We encourage you to review this policy periodically.
        </p>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Contact Us</h2>
        <p className="p">
          If you have questions about this Privacy Policy, please contact us at:
        </p>
        <p className="p" style={{ marginTop: 12 }}>
          <strong>Email:</strong> privacy@ermits.com
        </p>
      </section>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Link to="/" className="btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
