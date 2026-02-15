import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, User, Image as ImageIcon, Mail, FileText, Download, Shield, Settings } from 'lucide-react';
import TrustNotice from '../../components/common/TrustNotice';
import NextSteps from '../../components/common/NextSteps';
import { IS_WEB_BUILD } from '../../config/env';
import { priceLabel, playStoreUrl } from '../config/product';

export default function Home() {
  const handleGetApp = () => {
    if (playStoreUrl) window.open(playStoreUrl, '_blank');
  };

  // Web build: Landing page only
  if (IS_WEB_BUILD) {
    return (
      <div className="grid">
        <section className="card">
          <h1 className="h1">Question what looks real online.</h1>
          <p className="p">
            Identify scams, fake profiles, manipulated images, and suspicious emails using on-device analysis. 
            All processing happens locally—no data collection, no tracking.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <Link className="btn" to="/about">How it works</Link>
          </div>
        </section>

        <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} /> Available Tools
          </div>
          <p className="p" style={{ marginTop: 8 }}>
            All tools are available in the app after purchase. Download to get started.
          </p>
        </section>

        <div className="grid cols-2">
          <ToolCard title="Message Detective" desc="Detect scam, phishing, and AI-generated message patterns." icon={<MessageSquare size={18} />} />
          <ToolCard title="Profile Checker" desc="Verify social profile authenticity and identify deception signals." icon={<User size={18} />} />
          <ToolCard title="Image Inspector" desc="Inspect metadata and detect manipulation indicators in images." icon={<ImageIcon size={18} />} />
          <ToolCard title="Email Analyzer" desc="Analyze email headers for spoofing and routing anomalies." icon={<Mail size={18} />} />
        </div>

        <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div className="kicker" style={{ color: 'var(--text)' }}>
            <Download size={16} /> Get Started
          </div>
          <p className="p" style={{ marginTop: 8 }}>
            Purchase and download the app to access all analysis tools. One-time payment, no subscription required.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button onClick={handleGetApp} className="btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Download size={16} />
              Get the app
            </button>
            <Link className="btn" to="/pricing">View Pricing</Link>
          </div>
        </section>

        <TrustNotice />
      </div>
    );
  }

  // App build: Full functionality
  return (
    <div className="grid" style={{ gap: 28 }}>
      <section className="card" style={{
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--card) 100%)',
        border: '2px solid var(--primary)',
        boxShadow: '0 8px 24px rgba(155,125,212,.15), 0 2px 8px rgba(0,0,0,.05)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(155,125,212,.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, position: 'relative' }}>
          <div style={{
            padding: 14,
            borderRadius: 14,
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(155,125,212,.3)'
          }}>
            <Shield size={32} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="kicker" style={{ margin: 0, color: 'var(--primary)', fontSize: 12 }}>Recommended</div>
            <h2 className="h2" style={{ margin: 0, marginTop: 6 }}>Guided Scam Scanner</h2>
          </div>
        </div>
        <p className="p" style={{ position: 'relative' }}>
          Our intelligent analysis system guides you through comprehensive scam detection. Add evidence piece by piece while the system detects patterns, finds inconsistencies, and builds a confidence-rated risk assessment.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
          marginTop: 20,
          marginBottom: 20,
          padding: 18,
          backgroundColor: 'var(--bg)',
          borderRadius: 10,
          border: '1px solid var(--border)',
          position: 'relative'
        }}>
          <div>
            <div className="small" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text)' }}>
              <span style={{ fontSize: 22 }}>🎯</span> Context-Aware
            </div>
            <div className="small" style={{ marginTop: 6, opacity: 0.75, lineHeight: 1.5 }}>
              Analyzes based on how you received it
            </div>
          </div>
          <div>
            <div className="small" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text)' }}>
              <span style={{ fontSize: 22 }}>🔍</span> Pattern Detection
            </div>
            <div className="small" style={{ marginTop: 6, opacity: 0.75, lineHeight: 1.5 }}>
              Identifies common scam tactics
            </div>
          </div>
          <div>
            <div className="small" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text)' }}>
              <span style={{ fontSize: 22 }}>🔗</span> Cross-Signals
            </div>
            <div className="small" style={{ marginTop: 6, opacity: 0.75, lineHeight: 1.5 }}>
              Finds inconsistencies across evidence
            </div>
          </div>
          <div>
            <div className="small" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text)' }}>
              <span style={{ fontSize: 22 }}>📊</span> Confidence Score
            </div>
            <div className="small" style={{ marginTop: 6, opacity: 0.75, lineHeight: 1.5 }}>
              Shows reliability of assessment
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', position: 'relative' }}>
          <Link 
            className="btn primary" 
            to="/scan" 
            style={{ 
              fontSize: 15, 
              padding: '13px 26px',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(155,125,212,.3)'
            }}
          >
            <Shield size={18} />
            Start Guided Scan
          </Link>
          <Link className="btn" to="/about">How it works</Link>
        </div>
      </section>

      <section className="card" style={{ borderWidth: 2 }}>
        <h1 className="h1" style={{ paddingBottom: 20, marginBottom: 20 }}>Question what looks real online.</h1>
        <p className="p" style={{ fontSize: 16, lineHeight: 1.75 }}>
          Cyberstition helps you identify phishing, fraud, and deception through intelligent analysis. All processing happens locally in your browser—no data collection, no tracking, complete privacy.
        </p>
      </section>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--border)' }}>
        <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Shield size={16} /> How Guided Scans Work
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'start' }}>
            <div style={{
              minWidth: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(155,125,212,.25)'
            }}>1</div>
            <div>
              <div className="small" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Provide Context</div>
              <div className="small" style={{ marginTop: 5, opacity: 0.75, lineHeight: 1.6 }}>
                Tell us where you received it and what they're asking
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'start' }}>
            <div style={{
              minWidth: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(155,125,212,.25)'
            }}>2</div>
            <div>
              <div className="small" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Add Evidence</div>
              <div className="small" style={{ marginTop: 5, opacity: 0.75, lineHeight: 1.6 }}>
                Analyze messages, profiles, emails, or images—system guides you
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'start' }}>
            <div style={{
              minWidth: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(155,125,212,.25)'
            }}>3</div>
            <div>
              <div className="small" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Pattern Detection</div>
              <div className="small" style={{ marginTop: 5, opacity: 0.75, lineHeight: 1.6 }}>
                System identifies threat patterns and cross-references signals
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'start' }}>
            <div style={{
              minWidth: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 2px 8px rgba(155,125,212,.25)'
            }}>4</div>
            <div>
              <div className="small" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Get Assessment</div>
              <div className="small" style={{ marginTop: 5, opacity: 0.75, lineHeight: 1.6 }}>
                Receive confidence-rated risk score with clear recommendations
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ marginTop: 12 }}>
        <h2 className="h2" style={{ marginBottom: 20 }}>Or Use Individual Tools</h2>
        <div className="grid cols-2" style={{ gap: 16 }}>
          <ToolCard to="/messages" title="Message Detective" desc="Quick analysis of message text for scam patterns." icon={<MessageSquare size={20} />} />
          <ToolCard to="/profiles" title="Profile Checker" desc="Verify social profile authenticity signals." icon={<User size={20} />} />
          <ToolCard to="/images" title="Image Inspector" desc="Inspect image metadata and properties." icon={<ImageIcon size={20} />} />
          <ToolCard to="/email" title="Email Analyzer" desc="Check email headers for spoofing indicators." icon={<Mail size={20} />} />
        </div>
        <p className="small" style={{ marginTop: 16, opacity: 0.7, textAlign: 'center', fontSize: 13 }}>
          Individual tools provide single-signal analysis. For comprehensive assessment, use Guided Scan.
        </p>
      </div>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--border)' }}>
        <div className="kicker" style={{ color: 'var(--text)', marginBottom: 4 }}>
          <FileText size={16} /> Your Analysis History
        </div>
        <p className="p" style={{ marginTop: 12, lineHeight: 1.7 }}>
          All scan sessions and individual reports are saved to your dashboard. Review complete findings, pattern matches, confidence scores, and recommendations anytime.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
          <Link className="btn primary" to="/dashboard">
            <FileText size={16} />
            View Dashboard
          </Link>
          <Link className="btn" to="/account">
            <Settings size={16} />
            Preferences
          </Link>
        </div>
      </section>

      <TrustNotice />
    </div>
  );
}

function ToolCard({ to, title, desc, icon }: { to?: string; title: string; desc: string; icon: React.ReactNode }) {
  if (IS_WEB_BUILD) {
    return (
      <div className="card" style={{ opacity: 0.85, border: '1.5px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text)' }}>
            {icon}
            <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
          </div>
          <span className="badge" style={{ fontSize: 10 }}>In App</span>
        </div>
        <p className="p" style={{ marginTop: 10, marginBottom: 10, fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
        <div className="small" style={{ marginTop: 12, opacity: 0.6 }}>Available after purchase</div>
      </div>
    );
  }

  return (
    <Link to={to!} className="card" style={{ display: 'block', border: '1.5px solid var(--border)', textDecoration: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text)' }}>
          {icon}
          <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
        </div>
        <span className="badge" style={{ fontSize: 10 }}>Signals</span>
      </div>
      <p className="p" style={{ marginTop: 10, marginBottom: 10, fontSize: 14, lineHeight: 1.65 }}>{desc}</p>
      <div className="small" style={{ opacity: 0.65, marginTop: 12 }}>High-level indicators only. Always verify before acting.</div>
    </Link>
  );
}
