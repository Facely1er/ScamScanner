import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Search, Brain, FileCheck, Lock, Eye, Zap,
  ArrowRight, MessageSquare,
  Mail, Image as ImageIcon, User
} from 'lucide-react';
import { appUrl } from '../config/product';
import { IS_WEB_BUILD } from '../../config/env';

export default function HowItWorks() {
  return (
    <div className="grid gap-20">
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
        <div className="d-flex flex-col gap-24 mt-24">
          <ProcessStep
            number={1}
            icon={<Search size={32} />}
            title="Provide Context"
            description="Tell us about the suspicious content. Where did you receive it? Who sent it? What are they asking for? This context helps us understand the situation better."
            color="var(--accent-blue)"
          />
          <ProcessStep
            number={2}
            icon={<Brain size={32} />}
            title="Add Evidence"
            description="Submit different types of evidence for analysis: message text, email headers, images, or profile information. The more evidence you provide, the more accurate our assessment."
            color="var(--primary)"
          />
          <ProcessStep
            number={3}
            icon={<FileCheck size={32} />}
            title="Review Results"
            description="Get a comprehensive risk assessment with detailed findings, pattern matches, and actionable recommendations on what to do next."
            color="var(--success)"
          />
        </div>
      </section>

      <section className="card">
        <h2 className="h2">Analysis Tools</h2>
        <p className="p mt-8 mb-20">
          We use four specialized analyzers to examine different aspects of suspicious content:
        </p>
        <div className="d-grid gap-16">
          <ToolCard
            icon={<MessageSquare size={24} />}
            title="Message Analysis"
            description="Scans message text for urgency tactics, manipulation patterns, suspicious requests, and common scam phrases used to pressure victims."
            color="var(--accent-blue)"
          />
          <ToolCard
            icon={<Mail size={24} />}
            title="Email Header Analysis"
            description="Examines email routing paths, sender authentication, and technical headers to detect spoofing, phishing attempts, and impersonation."
            color="var(--primary)"
          />
          <ToolCard
            icon={<ImageIcon size={24} />}
            title="Image Metadata Analysis"
            description="Inspects image metadata, editing history, and properties to identify manipulated images, fake documents, and stolen photos."
            color="var(--success)"
          />
          <ToolCard
            icon={<User size={24} />}
            title="Profile Verification"
            description="Analyzes social media profiles for fake account indicators like suspicious follower ratios, account age, posting patterns, and authenticity markers."
            color="var(--warning)"
          />
        </div>
      </section>

      <section className="card">
        <h2 className="h2">Pattern Recognition System</h2>
        <p className="p mt-8 mb-20">
          Our system identifies known scam patterns across multiple threat categories:
        </p>
        <div className="grid-auto-250">
          <PatternCard title="Phishing" items={['Fake login pages', 'Credential harvesting', 'Account verification scams']} />
          <PatternCard title="Romance Scams" items={['Emotional manipulation', 'Investment schemes', 'Emergency fund requests']} />
          <PatternCard title="Investment Fraud" items={['Guaranteed returns', 'Pressure tactics', 'Fake testimonials']} />
          <PatternCard title="Impersonation" items={['Fake authority figures', 'Brand impersonation', 'Stolen identities']} />
        </div>
      </section>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="d-flex items-start gap-16">
          <div className="icon-badge-primary">
            <Lock size={32} />
          </div>
          <div className="flex-1">
            <h3 className="h3 m-0 mb-8">Privacy-First Design</h3>
            <p className="p m-0">
              All analysis happens locally in your browser. Your data never leaves your device unless you explicitly choose to save sessions. We don't track, collect, or store your sensitive information.
            </p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="h2">Risk Assessment</h2>
        <p className="p mt-8 mb-20">
          Each analysis produces a comprehensive risk score based on multiple factors:
        </p>
        <div className="d-flex flex-col gap-16">
          <RiskLevel
            level="Low Risk"
            score="0–39"
            color="var(--success)"
            description="Limited risk indicators found. Content appears legitimate but always verify through trusted channels."
          />
          <RiskLevel
            level="Medium Risk"
            score="40–69"
            color="var(--warning)"
            description="Concerning patterns detected. Proceed with caution and verify sender identity through independent channels."
          />
          <RiskLevel
            level="High Risk"
            score="70–100"
            color="var(--error)"
            description="Strong scam indicators detected. Do not proceed with requested actions. Block and report the sender."
          />
        </div>
      </section>

      <section className="card">
        <h2 className="h2">Key Features</h2>
        <div className="grid-auto-200 mt-20">
          <FeatureCard icon={<Eye size={20} />} title="Multi-Signal Detection" description="Analyzes multiple indicators simultaneously" />
          <FeatureCard icon={<Brain size={20} />} title="Pattern Matching" description="Identifies known scam patterns" />
          <FeatureCard icon={<Zap size={20} />} title="Cross-Reference" description="Correlates evidence across sources" />
          <FeatureCard icon={<Shield size={20} />} title="Context-Aware" description="Adapts analysis to situation" />
          <FeatureCard icon={<Lock size={20} />} title="Private & Secure" description="All data stays on your device" />
          <FeatureCard icon={<FileCheck size={20} />} title="Detailed Reports" description="Comprehensive findings & recommendations" />
        </div>
      </section>

      <section className="card">
        <h2 className="h2">Ready to Get Started?</h2>
        <p className="p mt-8 mb-20">
          Start analyzing suspicious content now with our guided scan workflow.
        </p>
        {IS_WEB_BUILD ? (
          <a href={appUrl} className="btn primary d-inline-flex items-center gap-8">
            Open App <ArrowRight size={16} />
          </a>
        ) : (
          <Link to="/scan" className="btn primary d-inline-flex items-center gap-8">
            Start Analysis <ArrowRight size={16} />
          </Link>
        )}
      </section>
    </div>
  );
}

function ProcessStep({ number, icon, title, description, color }: any) {
  return (
    <div className="d-flex gap-16 items-start">
      <div className="hiw-process-icon" style={{ color }}>
        {icon}
        <div className="hiw-step-number" style={{ backgroundColor: color }}>
          {number}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="h3 m-0 mb-6">{title}</h3>
        <p className="p m-0 opacity-85">{description}</p>
      </div>
    </div>
  );
}

function ToolCard({ icon, title, description, color }: any) {
  return (
    <div className="hiw-tool-card">
      <div className="hiw-icon-box" style={{ color }}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="small font-semibold mb-4">{title}</div>
        <div className="small opacity-8" style={{ fontSize: '0.85rem' }}>{description}</div>
      </div>
    </div>
  );
}

function PatternCard({ title, items }: any) {
  return (
    <div className="hiw-pattern-card">
      <div className="small font-semibold mb-12">{title}</div>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {items.map((item: string, index: number) => (
          <li key={index} className={`small opacity-8${index > 0 ? ' mt-6' : ''}`}>
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
      alignItems: 'flex-start',
    }}>
      <div style={{
        minWidth: 56,
        borderRadius: 8,
        border: `1px solid ${color}`,
        color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 8px',
        gap: 2,
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '0.7rem', opacity: 0.8, lineHeight: 1 }}>score</span>
      </div>
      <div className="flex-1">
        <div className="small font-bold mb-4" style={{ color }}>{level}</div>
        <div className="small opacity-85">{description}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="hiw-feature-card">
      <div className="hiw-icon-primary">
        {icon}
      </div>
      <div className="small font-semibold mb-4">{title}</div>
      <div className="small opacity-8" style={{ fontSize: '0.85rem' }}>{description}</div>
    </div>
  );
}
