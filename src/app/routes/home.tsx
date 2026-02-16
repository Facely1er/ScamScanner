import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, User, Image as ImageIcon, Mail, FileText, Download, Shield, WifiOff, Target, Search, Link2, BarChart3 } from 'lucide-react';
import TrustNotice from '../../components/common/TrustNotice';
import NextSteps from '../../components/common/NextSteps';
import { IS_WEB_BUILD } from '../../config/env';
import { priceLabel } from '../config/product';

export default function Home() {
  const handleGetApp = () => {
    // TODO: Replace with actual Play Store URL
    window.open('https://play.google.com/store/apps', '_blank');
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
    <div className="grid loose">
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
            justifyContent: 'center',
            width: 52,
            height: 52
          }}>
            <img 
              src="/cyberstition_logo.png" 
              alt="Cyberstition" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }} 
            />
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
              <Target size={18} style={{ color: 'var(--primary)' }} /> Context-Aware
            </div>
            <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>
              Analyzes based on how you received it
            </div>
          </div>
          <div>
            <div className="small" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Search size={18} style={{ color: 'var(--primary)' }} /> Pattern Detection
            </div>
            <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>
              Identifies common scam tactics
            </div>
          </div>
          <div>
            <div className="small" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link2 size={18} style={{ color: 'var(--primary)' }} /> Cross-Signals
            </div>
            <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>
              Finds inconsistencies across evidence
            </div>
          </div>
          <div>
            <div className="small" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <BarChart3 size={18} style={{ color: 'var(--primary)' }} /> Confidence Score
            </div>
            <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>
              Shows reliability of assessment
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Shield size={24} style={{ color: 'var(--primary)' }} />
          Why Cyberstition?
        </h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Shield size={20} style={{ color: 'var(--primary)' }} />
              <h3 className="h3" style={{ margin: 0 }}>100% Private</h3>
            </div>
            <p className="small">
              All analysis runs on your device. Nothing leaves your browser. No data collection, no tracking.
            </p>
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Download size={20} style={{ color: 'var(--primary)' }} />
              <h3 className="h3" style={{ margin: 0 }}>One-Time Payment</h3>
            </div>
            <p className="small">
              No subscription required. Pay once, use forever. Better value than monthly subscriptions.
            </p>
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <User size={20} style={{ color: 'var(--primary)' }} />
              <h3 className="h3" style={{ margin: 0 }}>No Account Needed</h3>
            </div>
            <p className="small">
              Start using immediately. No sign-up, no email required. Maximum privacy.
            </p>
          </div>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <WifiOff size={20} style={{ color: 'var(--primary)' }} />
              <h3 className="h3" style={{ margin: 0 }}>Works Offline</h3>
            </div>
            <p className="small">
              Once loaded, all tools work without internet. Perfect for sensitive content.
            </p>
          </div>
        </div>
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
          <ToolCard 
            to="/messages" 
            title="Message Detective" 
            desc="Quick analysis of message text for scam patterns." 
            example='Example: "Urgent! Your account will be suspended in 24 hours. Click here now!"'
            icon={<MessageSquare size={18} />} 
            color="#3b82f6"
          />
          <ToolCard 
            to="/profiles" 
            title="Profile Checker" 
            desc="Verify social profile authenticity signals." 
            example="Checks profile age, follower ratios, activity patterns, and verification status"
            icon={<User size={18} />} 
            color="#10b981"
          />
          <ToolCard 
            to="/images" 
            title="Image Inspector" 
            desc="Inspect image metadata and properties." 
            example="Detects editing software, creation dates, GPS location, and manipulation indicators"
            icon={<ImageIcon size={18} />} 
            color="#f59e0b"
          />
          <ToolCard 
            to="/email" 
            title="Email Analyzer" 
            desc="Check email headers for spoofing indicators." 
            example="Analyzes SPF, DKIM, DMARC records and routing paths to detect spoofing"
            icon={<Mail size={18} />} 
            color="#ef4444"
          />
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
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <Link className="btn primary" to="/dashboard">View Dashboard</Link>
          <Link className="btn" to="/account">Preferences</Link>
        </div>
      </section>

      <TrustNotice />
    </div>
  );
}

function ToolCard({ to, title, desc, icon, example, color = 'var(--primary)' }: { 
  to?: string; 
  title: string; 
  desc: string; 
  icon: React.ReactNode;
  example?: string;
  color?: string;
}) {
  if (IS_WEB_BUILD) {
    return (
      <div className="card" style={{ opacity: 0.8 }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 12, 
            background: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {React.cloneElement(icon as React.ReactElement, { size: 24, color })}
          </div>
          <div style={{ flex: 1 }}>
            <div className="kicker" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
              <span>{title}</span>
              <span className="badge">In App</span>
            </div>
            <p className="p" style={{ marginTop: 8, marginBottom: 0 }}>{desc}</p>
            {example && (
              <p className="text-xs" style={{ 
                fontStyle: 'italic', 
                color: 'var(--text-muted)',
                padding: 8,
                background: 'var(--bg-secondary)',
                borderRadius: 6,
                marginTop: 8
              }}>
                {example}
              </p>
            )}
            <div style={{ marginTop: 12 }} className="small">Available after purchase</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={to!} className="card" style={{ display: 'block' }}>
      <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
        <div style={{ 
          width: 48, 
          height: 48, 
          borderRadius: 12, 
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {React.cloneElement(icon as React.ReactElement, { size: 24, color })}
        </div>
        <div style={{ flex: 1 }}>
          <div className="kicker" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
            <span>{title}</span>
            <span className="badge">Signals</span>
          </div>
          <p className="p" style={{ marginTop: 8, marginBottom: 0 }}>{desc}</p>
          {example && (
            <p className="text-xs" style={{ 
              fontStyle: 'italic', 
              color: 'var(--text-muted)',
              padding: 8,
              background: 'var(--bg-secondary)',
              borderRadius: 6,
              marginTop: 8
            }}>
              {example}
            </p>
          )}
          <div style={{ marginTop: 12 }} className="small">High-level indicators only. Always verify before acting.</div>
        </div>
      </div>
    </Link>
  );
}
