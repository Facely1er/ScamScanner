import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, User, Image as ImageIcon, Mail, FileText, Shield, Crosshair, ScanSearch, GitMerge, BarChart2 } from 'lucide-react';
import TrustNotice from '../../components/common/TrustNotice';

export default function Home() {
  return (
    <div className="grid" style={{ gap: 24 }}>
      <section className="card" style={{
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg) 100%)',
        border: '2px solid var(--primary)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            padding: 12,
            borderRadius: 12,
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={28} color="white" />
          </div>
          <div>
            <div className="kicker" style={{ margin: 0, color: 'var(--primary)' }}>Recommended</div>
            <h2 className="h2" style={{ margin: 0, marginTop: 4 }}>Guided Scam Scanner</h2>
          </div>
        </div>
        <p className="p">
          Our intelligent analysis system guides you through comprehensive scam detection. Add evidence piece by piece while the system detects patterns, finds inconsistencies, and builds a confidence-rated risk assessment.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginTop: 16,
          marginBottom: 16,
          padding: 16,
          backgroundColor: 'var(--bg)',
          borderRadius: 8
        }}>
          <div>
            <div className="small" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Crosshair size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} /> Context-Aware
            </div>
            <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>
              Analyzes based on how you received it
            </div>
          </div>
          <div>
            <div className="small" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ScanSearch size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} /> Pattern Detection
            </div>
            <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>
              Identifies common scam tactics
            </div>
          </div>
          <div>
            <div className="small" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <GitMerge size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} /> Cross-Signals
            </div>
            <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>
              Finds inconsistencies across evidence
            </div>
          </div>
          <div>
            <div className="small" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <BarChart2 size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} /> Confidence Score
            </div>
            <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>
              Shows reliability of assessment
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link className="btn primary" to="/scan" style={{ fontSize: '1.05em', padding: '12px 24px' }}>
            Start Guided Scan
          </Link>
          <Link className="btn" to="/about">How it works</Link>
        </div>
      </section>

      <section className="card">
        <h1 className="h1">Question what looks real online.</h1>
        <p className="p">
          Cyberstition helps you identify phishing, fraud, and deception through intelligent analysis. All processing happens locally in your browser—no data collection, no tracking, complete privacy.
        </p>
      </section>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={16} /> How Guided Scans Work
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'start' }}>
            <div style={{
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600
            }}>1</div>
            <div>
              <div className="small" style={{ fontWeight: 600 }}>Provide Context</div>
              <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>
                Tell us where you received it and what they're asking
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'start' }}>
            <div style={{
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600
            }}>2</div>
            <div>
              <div className="small" style={{ fontWeight: 600 }}>Add Evidence</div>
              <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>
                Analyze messages, profiles, emails, or images—system guides you
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'start' }}>
            <div style={{
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600
            }}>3</div>
            <div>
              <div className="small" style={{ fontWeight: 600 }}>Pattern Detection</div>
              <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>
                System identifies threat patterns and cross-references signals
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
            <div style={{
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600
            }}>4</div>
            <div>
              <div className="small" style={{ fontWeight: 600 }}>Get Assessment</div>
              <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>
                Receive confidence-rated risk score with clear recommendations
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ marginTop: 8 }}>
        <h2 className="h2" style={{ marginBottom: 16 }}>Or Use Individual Tools</h2>
        <div className="grid cols-2">
          <ToolCard to="/messages" title="Message Detective" desc="Quick analysis of message text for scam patterns." icon={<MessageSquare size={18} />} />
          <ToolCard to="/profiles" title="Profile Checker" desc="Verify social profile authenticity signals." icon={<User size={18} />} />
          <ToolCard to="/images" title="Image Inspector" desc="Inspect image metadata and properties." icon={<ImageIcon size={18} />} />
          <ToolCard to="/email" title="Email Analyzer" desc="Check email headers for spoofing indicators." icon={<Mail size={18} />} />
        </div>
        <p className="small" style={{ marginTop: 12, opacity: 0.7, textAlign: 'center' }}>
          Individual tools provide single-signal analysis. For comprehensive assessment, use Guided Scan.
        </p>
      </div>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="kicker" style={{ color: 'var(--text)' }}>
          <FileText size={16} /> Your Analysis History
        </div>
        <p className="p" style={{ marginTop: 8 }}>
          All scan sessions and individual reports are saved to your dashboard. Review complete findings, pattern matches, confidence scores, and recommendations anytime.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link className="btn primary" to="/dashboard">View Dashboard</Link>
          <Link className="btn" to="/account">Preferences</Link>
        </div>
      </section>

      <TrustNotice />
    </div>
  );
}

function ToolCard({ to, title, desc, icon }: { to: string; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <Link to={to} className="card" style={{ display: 'block' }}>
      <div className="kicker" style={{ justifyContent: 'space-between' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>{icon} {title}</span>
        <span className="badge">Signals</span>
      </div>
      <p className="p" style={{ marginTop: 10 }}>{desc}</p>
      <div style={{ marginTop: 12 }} className="small">High-level indicators only. Always verify before acting.</div>
    </Link>
  );
}
