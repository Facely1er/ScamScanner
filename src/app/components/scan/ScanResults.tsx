import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, AlertTriangle, CheckCircle, Info, FileText,
  TrendingUp, AlertCircle, XCircle, Home, RotateCcw, Download
} from 'lucide-react';
import { ScanSession } from '../../../types/scan';
import { generateNarrative } from '../../../utils/investigationNarrative';
import { downloadReport } from '../../../utils/reportExporter';
import { getCredits, consumeCredit, subscribeToCredits } from '../../core/creditStore';
import ReportCreditModal from '../ReportCreditModal';

interface ScanResultsProps {
  session: ScanSession;
  onComplete: () => void;
  onStartNew: () => void;
}

export default function ScanResults({ session, onComplete, onStartNew }: ScanResultsProps) {
  const narrative = generateNarrative(session);
  const [credits, setCredits] = useState(getCredits());
  const [showCreditModal, setShowCreditModal] = useState(false);

  useEffect(() => {
    return subscribeToCredits(() => setCredits(getCredits()));
  }, []);

  const handleDownload = () => {
    if (credits <= 0) {
      setShowCreditModal(true);
      return;
    }
    consumeCredit();
    downloadReport(session);
    setCredits(getCredits());
  };

  const getRiskIcon = () => {
    switch (session.overallRiskLevel) {
      case 'high':
        return <XCircle size={48} color="rgb(239 68 68)" />;
      case 'medium':
        return <AlertCircle size={48} color="rgb(251 146 60)" />;
      default:
        return <CheckCircle size={48} color="rgb(34 197 94)" />;
    }
  };

  const getRiskColor = () => {
    switch (session.overallRiskLevel) {
      case 'high':
        return 'rgb(239 68 68)';
      case 'medium':
        return 'rgb(251 146 60)';
      default:
        return 'rgb(34 197 94)';
    }
  };

  const getRiskMessage = () => {
    const score = session.overallRiskScore;
    if (score >= 70) return 'High Risk - Exercise Extreme Caution';
    if (score >= 40) return 'Medium Risk - Proceed with Caution';
    return 'Low Risk - Appears Legitimate';
  };

  const getRiskDescription = () => {
    const score = session.overallRiskScore;
    if (score >= 70) {
      return 'Multiple high-risk indicators detected. This shows strong signs of being a scam or malicious attempt. Do not proceed with any requested actions.';
    } else if (score >= 40) {
      return 'Some concerning patterns detected. While not definitively malicious, proceed with caution and verify through independent channels.';
    } else {
      return 'Limited risk indicators found. However, always verify important requests through known, trusted channels before taking action.';
    }
  };

  const riskColor = getRiskColor();

  return (
    <>
      <section
        className="card"
        style={{
          background: `linear-gradient(135deg, ${riskColor}10 0%, var(--bg) 100%)`,
          border: `2px solid ${riskColor}`,
        }}
      >
        <div className="kicker mb-8">Step 3 of 3</div>
        <div className="d-flex items-start gap-16 mb-16">
          <div
            className="d-flex items-center justify-center"
            style={{
              padding: 16,
              borderRadius: 16,
              backgroundColor: `${riskColor}15`,
            }}
          >
            {getRiskIcon()}
          </div>
          <div className="flex-1">
            <h2 className="h2 m-0" style={{ color: riskColor }}>
              {getRiskMessage()}
            </h2>
            <p className="p m-0 mt-8">
              {getRiskDescription()}
            </p>
          </div>
        </div>

        <div
          className="stats-grid mt-20 p-20 bg-base"
          style={{ borderRadius: 8 }}
        >
          <div>
            <div className="small opacity-7 mb-4">Risk Score</div>
            <div className="h2 m-0" style={{ color: riskColor }}>
              {session.overallRiskScore}/100
            </div>
          </div>
          <div>
            <div className="small opacity-7 mb-4">Confidence</div>
            <div className="h2 m-0">
              {Math.round(session.confidence * 100)}%
            </div>
          </div>
          <div>
            <div className="small opacity-7 mb-4">Evidence</div>
            <div className="h2 m-0">
              {session.evidence.length}
            </div>
          </div>
          <div>
            <div className="small opacity-7 mb-4">Patterns</div>
            <div className="h2 m-0">
              {session.patternMatches.length}
            </div>
          </div>
        </div>
      </section>

      <section className="card card-secondary">
        <div className="kicker mb-8">
          <FileText size={16} /> Executive Summary
        </div>
        <p className="p mb-12">{narrative.summary}</p>
        <p className="p mb-12">{narrative.findings}</p>
        <p className="p opacity-75" style={{ fontSize: '0.9rem' }}>{narrative.confidence}</p>
      </section>

      {session.threatCategory && session.threatCategory !== 'unknown' && (
        <section className="card card-secondary">
          <div className="kicker mb-8">
            <AlertTriangle size={16} /> Threat Category
          </div>
          <div className="p-16 bg-base capitalize" style={{ borderRadius: 8, border: '1px solid var(--border)' }}>
            <div className="h3 m-0">
              {session.threatCategory.replace(/_/g, ' ')}
            </div>
          </div>
        </section>
      )}

      {session.patternMatches.length > 0 && (
        <section className="card">
          <div className="kicker mb-12">
            <TrendingUp size={16} /> Pattern Matches Detected
          </div>
          <div className="d-flex flex-col gap-12">
            {session.patternMatches.map((pattern, index) => (
              <div
                key={index}
                className="card p-16 bg-secondary"
                style={{ border: '1px solid var(--border)' }}
              >
                <div className="d-flex justify-between items-start gap-12">
                  <div className="flex-1">
                    <div className="small font-semibold mb-6">
                      {pattern.patternName}
                    </div>
                    <div className="small opacity-8">
                      {pattern.description}
                    </div>
                  </div>
                  <div
                    className="font-semibold whitespace-nowrap"
                    style={{
                      padding: '4px 12px',
                      borderRadius: 12,
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      fontSize: '0.85rem',
                    }}
                  >
                    {Math.round(pattern.confidence * 100)}% match
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {session.crossReferences.length > 0 && (
        <section className="card">
          <div className="kicker mb-12">
            <Info size={16} /> Cross-Reference Findings
          </div>
          <div className="d-flex flex-col gap-10">
            {session.crossReferences.map((ref, index) => (
              <div
                key={index}
                className="p-14 bg-secondary"
                style={{ borderRadius: 6, border: '1px solid var(--border)' }}
              >
                <div className="small">{ref.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="card">
        <div className="kicker mb-12">
          <FileText size={16} /> Evidence Analyzed ({session.evidence.length})
        </div>
        <div className="d-flex flex-col gap-12">
          {session.evidence.map((evidence) => (
            <div
              key={evidence.id}
              className="card p-16 bg-secondary"
              style={{ border: '1px solid var(--border)' }}
            >
              <div className="d-flex justify-between items-center mb-8">
                <div className="small font-semibold capitalize">
                  {evidence.type}
                </div>
                <div
                  className="font-semibold"
                  style={{
                    padding: '4px 10px',
                    borderRadius: 10,
                    fontSize: '0.8rem',
                    backgroundColor: evidence.riskLevel === 'high' ? 'rgb(239 68 68)' :
                                   evidence.riskLevel === 'medium' ? 'rgb(251 146 60)' : 'rgb(34 197 94)',
                    color: 'white',
                  }}
                >
                  {evidence.riskLevel}
                </div>
              </div>
              <div className="small opacity-7">
                {evidence.signals.length} signal{evidence.signals.length !== 1 ? 's' : ''} detected
              </div>
              {evidence.signals.length > 0 && (
                <div className="mt-10 d-flex flex-col gap-6">
                  {evidence.signals.map((signal, idx) => (
                    <div
                      key={idx}
                      className="small signal-item"
                      style={{
                        borderLeft: `3px solid ${signal.severity === 'high' ? 'rgb(239 68 68)' : signal.severity === 'medium' ? 'rgb(251 146 60)' : 'rgb(34 197 94)'}`,
                      }}
                    >
                      {signal.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section
        className="card"
        style={{ backgroundColor: 'var(--bg-secondary)', border: `2px solid ${riskColor}` }}
      >
        <div className="kicker mb-12" style={{ color: riskColor }}>
          <Shield size={16} /> Recommended Actions
        </div>
        <ul className="mt-12 pl-5 mb-0">
          {session.nextSteps.map((step, index) => (
            <li key={index} className="p" style={{ marginTop: index > 0 ? 10 : 0 }}>
              {step}
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <div className="kicker mb-8">Investigation Report</div>
        <p className="p mb-16">
          Download a full PDF investigation report with executive summary, all findings, pattern analysis, and recommended actions.
          {credits > 0 && (
            <span className="ml-8 font-semibold text-primary" style={{ fontSize: '0.85rem' }}>
              {credits} credit{credits !== 1 ? 's' : ''} available
            </span>
          )}
        </p>
        <button
          onClick={handleDownload}
          className="btn primary d-flex items-center gap-8 mb-20"
        >
          <Download size={16} />
          {credits > 0 ? 'Download Investigation Report' : 'Get Report Credits'}
        </button>

        <div className="kicker mb-8">What's Next?</div>
        <div className="d-flex gap-12 mt-8 flex-wrap">
          <button
            onClick={onComplete}
            className="btn d-flex items-center gap-8"
          >
            <FileText size={16} /> Save to Dashboard
          </button>
          <button
            onClick={onStartNew}
            className="btn d-flex items-center gap-8"
          >
            <RotateCcw size={16} /> Start New Scan
          </button>
          <Link
            to="/"
            className="btn d-flex items-center gap-8"
          >
            <Home size={16} /> Home
          </Link>
        </div>
      </section>
      <ReportCreditModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        onCreditAdded={() => setShowCreditModal(false)}
      />
    </>
  );
}
