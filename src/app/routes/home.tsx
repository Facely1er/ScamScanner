import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, User, Image as ImageIcon, Mail, FileText, Shield, Crosshair, ScanSearch, GitMerge, BarChart2 } from 'lucide-react';
import TrustNotice from '../../components/common/TrustNotice';

export default function Home() {
  return (
    <div className="grid gap-24">
      <section className="card" style={{
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg) 100%)',
        border: '2px solid var(--primary)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div className="d-flex items-center gap-12 mb-12">
          <div className="icon-badge-primary">
            <Shield size={28} color="white" />
          </div>
          <div>
            <div className="kicker m-0" style={{ color: 'var(--primary)' }}>Recommended</div>
            <h2 className="h2 m-0 mt-4">Guided Scam Scanner</h2>
          </div>
        </div>
        <p className="p">
          Our intelligent analysis system guides you through comprehensive scam detection. Add evidence piece by piece while the system detects patterns, finds inconsistencies, and builds a confidence-rated risk assessment.
        </p>
        <div className="home-feature-grid">
          <div>
            <div className="small font-semibold d-flex items-center gap-6">
              <Crosshair size={16} className="text-primary flex-shrink-0" /> Context-Aware
            </div>
            <div className="small mt-4 opacity-8">
              Analyzes based on how you received it
            </div>
          </div>
          <div>
            <div className="small font-semibold d-flex items-center gap-6">
              <ScanSearch size={16} className="text-primary flex-shrink-0" /> Pattern Detection
            </div>
            <div className="small mt-4 opacity-8">
              Identifies common scam tactics
            </div>
          </div>
          <div>
            <div className="small font-semibold d-flex items-center gap-6">
              <GitMerge size={16} className="text-primary flex-shrink-0" /> Cross-Signals
            </div>
            <div className="small mt-4 opacity-8">
              Finds inconsistencies across evidence
            </div>
          </div>
          <div>
            <div className="small font-semibold d-flex items-center gap-6">
              <BarChart2 size={16} className="text-primary flex-shrink-0" /> Confidence Score
            </div>
            <div className="small mt-4 opacity-8">
              Shows reliability of assessment
            </div>
          </div>
        </div>
        <div className="d-flex gap-10 flex-wrap justify-center">
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
        <div className="kicker d-flex items-center gap-8">
          <Shield size={16} /> How Guided Scans Work
        </div>
        <div className="mt-16">
          <div className="step-item">
            <div className="step-badge">1</div>
            <div>
              <div className="small font-semibold">Provide Context</div>
              <div className="small mt-4 opacity-8">
                Tell us where you received it and what they're asking
              </div>
            </div>
          </div>
          <div className="step-item">
            <div className="step-badge">2</div>
            <div>
              <div className="small font-semibold">Add Evidence</div>
              <div className="small mt-4 opacity-8">
                Analyze messages, profiles, emails, or images—system guides you
              </div>
            </div>
          </div>
          <div className="step-item">
            <div className="step-badge">3</div>
            <div>
              <div className="small font-semibold">Pattern Detection</div>
              <div className="small mt-4 opacity-8">
                System identifies threat patterns and cross-references signals
              </div>
            </div>
          </div>
          <div className="d-flex gap-12 items-start">
            <div className="step-badge">4</div>
            <div>
              <div className="small font-semibold">Get Assessment</div>
              <div className="small mt-4 opacity-8">
                Receive confidence-rated risk score with clear recommendations
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <h2 className="h2 mb-16">Or Use Individual Tools</h2>
        <div className="grid cols-2">
          <ToolCard to="/messages" title="Message Detective" desc="Quick analysis of message text for scam patterns." icon={<MessageSquare size={18} />} />
          <ToolCard to="/profiles" title="Profile Checker" desc="Verify social profile authenticity signals." icon={<User size={18} />} />
          <ToolCard to="/images" title="Image Inspector" desc="Inspect image metadata and properties." icon={<ImageIcon size={18} />} />
          <ToolCard to="/email" title="Email Analyzer" desc="Check email headers for spoofing indicators." icon={<Mail size={18} />} />
        </div>
        <p className="small mt-12 opacity-7 text-center">
          Individual tools provide single-signal analysis. For comprehensive assessment, use Guided Scan.
        </p>
      </div>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="kicker text-text">
          <FileText size={16} /> Your Analysis History
        </div>
        <p className="p mt-8">
          All scan sessions and individual reports are saved to your dashboard. Review complete findings, pattern matches, confidence scores, and recommendations anytime.
        </p>
        <div className="d-flex gap-10 mt-14 flex-wrap justify-center">
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
    <Link to={to} className="card d-block">
      <div className="kicker justify-between">
        <span className="d-inline-flex items-center gap-8">{icon} {title}</span>
        <span className="badge">Signals</span>
      </div>
      <p className="p mt-10">{desc}</p>
      <div className="small mt-12">High-level indicators only. Always verify before acting.</div>
    </Link>
  );
}
