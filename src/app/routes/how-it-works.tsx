import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Search, Brain, FileCheck, Lock, Eye, Zap,
  ArrowRight, CheckCircle, AlertTriangle, MessageSquare,
  Mail, Image as ImageIcon, User
} from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <div className="kicker">
          <Shield size={16} /> Understanding Cyberstition
        </div>
        <h1 className="h1">How It Works</h1>
        <p className="p">
          Cyberstition helps you detect online scams and manipulation attempts through multi-layered analysis
          and pattern recognition. Here's how our system protects you.
        </p>
      </section>

      <section className="card">
        <h2 className="h2">Three-Step Analysis Process</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 24 }}>
          <ProcessStep
            number={1}
            icon={<Search size={32} />}
            title="Provide Context"
            description="Tell us about the suspicious content. Where did you receive it? Who sent it? What are they asking for? This context helps us understand the situation better."
            color="#3b82f6"
          />
          <ProcessStep
            number={2}
            icon={<Brain size={32} />}
            title="Add Evidence"
            description="Submit different types of evidence for analysis: message text, email headers, images, or profile information. The more evidence you provide, the more accurate our assessment."
            color="#8b5cf6"
          />
          <ProcessStep
            number={3}
            icon={<FileCheck size={32} />}
            title="Review Results"
            description="Get a comprehensive risk assessment with detailed findings, pattern matches, and actionable recommendations on what to do next."
            color="#10b981"
          />
        </div>
      </section>

      <section className="card">
        <h2 className="h2">Analysis Tools</h2>
        <p className="p" style={{ marginTop: 8, marginBottom: 20 }}>
          We use four specialized analyzers to examine different aspects of suspicious content:
        </p>
        <div style={{ display: 'grid', gap: 16 }}>
          <ToolCard
            icon={<MessageSquare size={24} />}
            title="Message Analysis"
            description="Scans message text for urgency tactics, manipulation patterns, suspicious requests, and common scam phrases used to pressure victims."
            color="#3b82f6"
          />
          <ToolCard
            icon={<Mail size={24} />}
            title="Email Header Analysis"
            description="Examines email routing paths, sender authentication, and technical headers to detect spoofing, phishing attempts, and impersonation."
            color="#8b5cf6"
          />
          <ToolCard
            icon={<ImageIcon size={24} />}
            title="Image Metadata Analysis"
            description="Inspects image metadata, editing history, and properties to identify manipulated images, fake documents, and stolen photos."
            color="#10b981"
          />
          <ToolCard
            icon={<User size={24} />}
            title="Profile Verification"
            description="Analyzes social media profiles for fake account indicators like suspicious follower ratios, account age, posting patterns, and authenticity markers."
            color="#f59e0b"
          />
        </div>
      </section>

      <section className="card">
        <h2 className="h2">Pattern Recognition System</h2>
        <p className="p" style={{ marginTop: 8, marginBottom: 20 }}>
          Our system identifies known scam patterns across multiple threat categories:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          <PatternCard title="Phishing" items={['Fake login pages', 'Credential harvesting', 'Account verification scams']} />
          <PatternCard title="Romance Scams" items={['Emotional manipulation', 'Investment schemes', 'Emergency fund requests']} />
          <PatternCard title="Investment Fraud" items={['Guaranteed returns', 'Pressure tactics', 'Fake testimonials']} />
          <PatternCard title="Impersonation" items={['Fake authority figures', 'Brand impersonation', 'Stolen identities']} />
        </div>
      </section>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: 16 }}>
          <div style={{
            padding: 12,
            borderRadius: 12,
            backgroundColor: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lock size={32} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 className="h3" style={{ margin: 0, marginBottom: 8 }}>Privacy-First Design</h3>
            <p className="p" style={{ margin: 0 }}>
              All analysis happens locally in your browser. Your data never leaves your device unless you explicitly choose to save sessions. We don't track, collect, or store your sensitive information.
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="h2">Risk Assessment</h2>
        <p className="p" style={{ marginTop: 8, marginBottom: 20 }}>
          Each analysis produces a comprehensive risk score based on multiple factors:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <RiskLevel
            level="Low Risk"
            score="0-39"
            color="rgb(34 197 94)"
            description="Limited risk indicators found. Content appears legitimate but always verify through trusted channels."
          />
          <RiskLevel
            level="Medium Risk"
            score="40-69"
            color="rgb(251 146 60)"
            description="Concerning patterns detected. Proceed with caution and verify sender identity through independent channels."
          />
          <RiskLevel
            level="High Risk"
            score="70-100"
            color="rgb(239 68 68)"
            description="Strong scam indicators detected. Do not proceed with requested actions. Block and report the sender."
          />
        </div>
      </section>

      <section className="card">
        <h2 className="h2">Key Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 20 }}>
          <FeatureCard icon={<Eye size={20} />} title="Multi-Signal Detection" description="Analyzes multiple indicators simultaneously" />
          <FeatureCard icon={<Brain size={20} />} title="Pattern Matching" description="Identifies known scam patterns" />
          <FeatureCard icon={<Zap size={20} />} title="Cross-Reference" description="Correlates evidence across sources" />
          <FeatureCard icon={<Shield size={20} />} title="Context-Aware" description="Adapts analysis to situation" />
          <FeatureCard icon={<Lock size={20} />} title="Private & Secure" description="All data stays on your device" />
          <FeatureCard icon={<FileCheck size={20} />} title="Detailed Reports" description="Comprehensive findings & recommendations" />
        </div>
      </section>

      <section className="card" style={{ textAlign: 'center' }}>
        <h2 className="h2">Ready to Get Started?</h2>
        <p className="p" style={{ marginTop: 8, marginBottom: 20 }}>
          Start analyzing suspicious content now with our guided scan workflow.
        </p>
        <Link
          to="/scan"
          className="btn primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          Start Analysis <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}

function ProcessStep({ number, icon, title, description, color }: any) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
      <div style={{
        minWidth: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: `${color}15`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {icon}
        <div style={{
          position: 'absolute',
          top: -8,
          right: -8,
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: color,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          {number}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h3 className="h3" style={{ margin: 0, marginBottom: 6 }}>{title}</h3>
        <p className="p" style={{ margin: 0, opacity: 0.85 }}>{description}</p>
      </div>
    </div>
  );
}

function ToolCard({ icon, title, description, color }: any) {
  return (
    <div style={{
      padding: 16,
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 8,
      border: '1px solid var(--border)',
      display: 'flex',
      gap: 12,
      alignItems: 'start'
    }}>
      <div style={{
        minWidth: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: `${color}15`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div className="small" style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
        <div className="small" style={{ opacity: 0.8, fontSize: '0.85rem' }}>{description}</div>
      </div>
    </div>
  );
}

function PatternCard({ title, items }: any) {
  return (
    <div style={{
      padding: 16,
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 8,
      border: '1px solid var(--border)'
    }}>
      <div className="small" style={{ fontWeight: 600, marginBottom: 12 }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {items.map((item: string, index: number) => (
          <li key={index} className="small" style={{ marginTop: index > 0 ? 6 : 0, opacity: 0.8 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskLevel({ level, score, color, description }: any) {
  return (
    <div style={{
      padding: 16,
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 8,
      border: `2px solid ${color}`,
      display: 'flex',
      gap: 16,
      alignItems: 'center'
    }}>
      <div style={{
        minWidth: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: `${color}15`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '0.9rem'
      }}>
        {score}
      </div>
      <div style={{ flex: 1 }}>
        <div className="small" style={{ fontWeight: 600, marginBottom: 4, color }}>{level}</div>
        <div className="small" style={{ opacity: 0.85, fontSize: '0.85rem' }}>{description}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div style={{
      padding: 16,
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: 8,
      border: '1px solid var(--border)',
      textAlign: 'center'
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: 'var(--primary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px'
      }}>
        {icon}
      </div>
      <div className="small" style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
      <div className="small" style={{ opacity: 0.8, fontSize: '0.85rem' }}>{description}</div>
    </div>
  );
}
