import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="grid" style={{ gap: 24, maxWidth: 900, margin: '0 auto' }}>
      <section className="card" style={{ border: '2px solid var(--border)' }}>
        <div className="kicker" style={{ marginBottom: 4 }}>
          <FileText size={16} /> Legal
        </div>
        <h1 className="h1" style={{ marginBottom: 10, paddingBottom: 0, border: 'none' }}>
          Terms of Service
        </h1>
        <p className="small" style={{ opacity: 0.7 }}>
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Agreement to Terms</h2>
        <p className="p">
          By accessing or using Cyberstition – Trust Signals (ScamScanner), you agree to be bound by these 
          Terms of Service. If you disagree with any part of these terms, you may not use the app.
        </p>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Description of Service</h2>
        <p className="p">
          ScamScanner is an offline, client-side analysis tool designed to help users identify potential 
          scams, phishing attempts, and fraudulent content. The app analyzes:
        </p>
        
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 20, marginTop: 12 }}>
          <li className="small" style={{ lineHeight: 1.7 }}>Messages for scam patterns and manipulation tactics</li>
          <li className="small" style={{ lineHeight: 1.7 }}>Email headers for spoofing indicators</li>
          <li className="small" style={{ lineHeight: 1.7 }}>Images for metadata and authenticity signals</li>
          <li className="small" style={{ lineHeight: 1.7 }}>Social media profiles for fake account indicators</li>
        </ul>

        <p className="p" style={{ marginTop: 16 }}>
          All analysis is performed locally on your device with no data transmission to external servers.
        </p>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)', backgroundColor: 'rgba(245,158,11,0.08)', borderColor: 'var(--warning)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'start' }}>
          <AlertTriangle size={24} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <h2 className="h2" style={{ marginBottom: 10 }}>Important Disclaimers</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <h3 className="h3" style={{ fontSize: 16, marginBottom: 6 }}>No Guarantee of Accuracy</h3>
                <p className="small" style={{ lineHeight: 1.7 }}>
                  This app provides <strong>indicators and signals only</strong>. It cannot guarantee 100% 
                  accuracy in detecting scams or fraudulent content. Some legitimate content may be flagged, 
                  and some fraudulent content may not be detected.
                </p>
              </div>

              <div>
                <h3 className="h3" style={{ fontSize: 16, marginBottom: 6 }}>Not Professional Advice</h3>
                <p className="small" style={{ lineHeight: 1.7 }}>
                  The analysis and recommendations provided by this app do not constitute legal, financial, 
                  or professional advice. Always exercise your own judgment and verify information through 
                  official channels.
                </p>
              </div>

              <div>
                <h3 className="h3" style={{ fontSize: 16, marginBottom: 6 }}>Educational Tool</h3>
                <p className="small" style={{ lineHeight: 1.7 }}>
                  This app is an educational tool to help you make more informed decisions. Final decisions 
                  about whether to trust content or engage with communications remain solely your responsibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Acceptable Use</h2>
        <p className="p">You agree to use this app only for lawful purposes. You may not:</p>
        
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 20, marginTop: 12 }}>
          <li className="small" style={{ lineHeight: 1.7 }}>
            Use the app to harass, abuse, or harm others
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            Attempt to reverse engineer, decompile, or disassemble the app
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            Use the app in any way that violates applicable laws or regulations
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            Claim that analysis results from this app constitute definitive proof of fraud or scams
          </li>
        </ul>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Intellectual Property</h2>
        <p className="p">
          The app, including its code, design, algorithms, and content, is owned by ERMITS and protected 
          by copyright and other intellectual property laws. Your purchase grants you a license to use 
          the app but does not transfer ownership rights.
        </p>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Limitation of Liability</h2>
        <p className="p">
          <strong>To the maximum extent permitted by law:</strong>
        </p>
        
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 20, marginTop: 12 }}>
          <li className="small" style={{ lineHeight: 1.7 }}>
            ERMITS shall not be liable for any direct, indirect, incidental, special, or consequential 
            damages arising from your use of the app
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            We are not responsible for any losses, damages, or harm resulting from reliance on analysis 
            results from this app
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            The app is provided "AS IS" without warranties of any kind, either express or implied
          </li>
        </ul>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">User Responsibilities</h2>
        <p className="p">You acknowledge and agree that:</p>
        
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 20, marginTop: 12 }}>
          <li className="small" style={{ lineHeight: 1.7 }}>
            You are responsible for your own security and should maintain up-to-date device security
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            You should always verify suspicious content through multiple sources
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            You should report suspected scams to appropriate authorities (not just rely on this app)
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            Final decisions about trust and safety are your responsibility
          </li>
        </ul>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)', backgroundColor: 'rgba(16,185,129,0.08)', borderColor: 'var(--success)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'start' }}>
          <CheckCircle size={24} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <h2 className="h2" style={{ marginBottom: 10 }}>Best Practices</h2>
            <p className="p" style={{ marginBottom: 12 }}>
              For best results and safety:
            </p>
            
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20 }}>
              <li className="small" style={{ lineHeight: 1.7 }}>
                Use this app as <strong>one tool</strong> among many for assessing trust
              </li>
              <li className="small" style={{ lineHeight: 1.7 }}>
                Always verify through official channels when in doubt
              </li>
              <li className="small" style={{ lineHeight: 1.7 }}>
                Never share sensitive information based solely on this app's analysis
              </li>
              <li className="small" style={{ lineHeight: 1.7 }}>
                Report actual scams to proper authorities (FBI IC3, FTC, local police)
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Refunds and Purchases</h2>
        <p className="p">
          Purchases made through app stores (iOS App Store, Google Play Store) are subject to the 
          refund policies of those platforms. We do not process refunds directly.
        </p>
        
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 20, marginTop: 12 }}>
          <li className="small" style={{ lineHeight: 1.7 }}>
            <strong>iOS:</strong> Managed through Apple's refund process
          </li>
          <li className="small" style={{ lineHeight: 1.7 }}>
            <strong>Android:</strong> Managed through Google Play's refund process
          </li>
        </ul>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Termination</h2>
        <p className="p">
          We reserve the right to terminate or suspend access to the app for violations of these Terms of Service. 
          You may stop using the app at any time by uninstalling it from your device.
        </p>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Changes to Terms</h2>
        <p className="p">
          We may modify these Terms of Service at any time. Changes will be effective immediately upon posting 
          with an updated "Last Updated" date. Continued use of the app after changes constitutes acceptance 
          of the new terms.
        </p>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Governing Law</h2>
        <p className="p">
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
          where ERMITS is established, without regard to conflict of law principles.
        </p>
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <h2 className="h2">Contact Information</h2>
        <p className="p">
          If you have questions about these Terms of Service, please contact us at:
        </p>
        <p className="p" style={{ marginTop: 12 }}>
          <strong>Email:</strong> support@ermits.com
        </p>
      </section>

      <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}>
        <Link to="/" className="btn primary" style={{ marginRight: 12 }}>
          Back to Home
        </Link>
        <Link to="/privacy" className="btn">
          View Privacy Policy
        </Link>
      </div>
    </div>
  );
}
