import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, AlertTriangle, CheckCircle, Info, FileText,
  TrendingUp, AlertCircle, XCircle, Home, RotateCcw
} from 'lucide-react';
import { ScanSession } from '../../../types/scan';

interface ScanResultsProps {
  session: ScanSession;
  onComplete: () => void;
  onStartNew: () => void;
}

export default function ScanResults({ session, onComplete, onStartNew }: ScanResultsProps) {
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
    if (score >= 70) {
      return 'High Risk - Exercise Extreme Caution';
    } else if (score >= 40) {
      return 'Medium Risk - Proceed with Caution';
    } else {
      return 'Low Risk - Appears Legitimate';
    }
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

  return (
    <>
      <section className="card" style={{
        background: `linear-gradient(135deg, ${getRiskColor()}10 0%, var(--bg) 100%)`,
        border: `2px solid ${getRiskColor()}`
      }}>
        <div className="kicker" style={{ marginBottom: 8 }}>Step 3 of 3</div>
        <div style={{ display: 'flex', alignItems: 'start', gap: 16, marginBottom: 16 }}>
          <div style={{
            padding: 16,
            borderRadius: 16,
            backgroundColor: `${getRiskColor()}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {getRiskIcon()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 className="h2" style={{ margin: 0, color: getRiskColor() }}>
              {getRiskMessage()}
            </h2>
            <p className="p" style={{ margin: 0, marginTop: 8 }}>
              {getRiskDescription()}
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 16,
          marginTop: 20,
          padding: 20,
          backgroundColor: 'var(--bg)',
          borderRadius: 8
        }}>
          <div>
            <div className="small" style={{ opacity: 0.7, marginBottom: 4 }}>Risk Score</div>
            <div className="h2" style={{ color: getRiskColor(), margin: 0 }}>
              {session.overallRiskScore}/100
            </div>
          </div>
          <div>
            <div className="small" style={{ opacity: 0.7, marginBottom: 4 }}>Confidence</div>
            <div className="h2" style={{ margin: 0 }}>
              {Math.round(session.confidence * 100)}%
            </div>
          </div>
          <div>
            <div className="small" style={{ opacity: 0.7, marginBottom: 4 }}>Evidence</div>
            <div className="h2" style={{ margin: 0 }}>
              {session.evidence.length}
            </div>
          </div>
          <div>
            <div className="small" style={{ opacity: 0.7, marginBottom: 4 }}>Patterns</div>
            <div className="h2" style={{ margin: 0 }}>
              {session.patternMatches.length}
            </div>
          </div>
        </div>
      </section>

      {session.threatCategory && session.threatCategory !== 'unknown' && (
        <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div className="kicker" style={{ marginBottom: 8 }}>
            <AlertTriangle size={16} /> Threat Category
          </div>
          <div style={{
            padding: 16,
            backgroundColor: 'var(--bg)',
            borderRadius: 8,
            border: '1px solid var(--border)'
          }}>
            <div className="h3" style={{ margin: 0, textTransform: 'capitalize' }}>
              {session.threatCategory.replace(/_/g, ' ')}
            </div>
          </div>
        </section>
      )}

      {session.patternMatches.length > 0 && (
        <section className="card">
          <div className="kicker" style={{ marginBottom: 12 }}>
            <TrendingUp size={16} /> Pattern Matches Detected
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {session.patternMatches.map((pattern, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: 16,
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="small" style={{ fontWeight: 600, marginBottom: 6 }}>
                      {pattern.patternName}
                    </div>
                    <div className="small" style={{ opacity: 0.8 }}>
                      {pattern.description}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: 12,
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}>
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
          <div className="kicker" style={{ marginBottom: 12 }}>
            <Info size={16} /> Cross-Reference Findings
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {session.crossReferences.map((ref, index) => (
              <div
                key={index}
                style={{
                  padding: 14,
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 6,
                  border: '1px solid var(--border)'
                }}
              >
                <div className="small">{ref.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="card">
        <div className="kicker" style={{ marginBottom: 12 }}>
          <FileText size={16} /> Evidence Analyzed ({session.evidence.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {session.evidence.map((evidence) => (
            <div
              key={evidence.id}
              className="card"
              style={{
                padding: 16,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div className="small" style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {evidence.type}
                </div>
                <div style={{
                  padding: '4px 10px',
                  borderRadius: 10,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: evidence.riskLevel === 'high' ? 'rgb(239 68 68)' :
                                 evidence.riskLevel === 'medium' ? 'rgb(251 146 60)' : 'rgb(34 197 94)',
                  color: 'white'
                }}>
                  {evidence.riskLevel}
                </div>
              </div>
              <div className="small" style={{ opacity: 0.7 }}>
                {evidence.signals.length} signal{evidence.signals.length !== 1 ? 's' : ''} detected
              </div>
              {evidence.signals.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {evidence.signals.slice(0, 3).map((signal, idx) => (
                    <div
                      key={idx}
                      className="small"
                      style={{
                        padding: '6px 10px',
                        backgroundColor: 'var(--bg)',
                        borderRadius: 4,
                        fontSize: '0.85rem'
                      }}
                    >
                      {signal.description}
                    </div>
                  ))}
                  {evidence.signals.length > 3 && (
                    <div className="small" style={{ opacity: 0.6, fontSize: '0.85rem', marginTop: 4 }}>
                      +{evidence.signals.length - 3} more signal{evidence.signals.length - 3 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {session.nextSteps.length > 0 && (
        <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: `2px solid ${getRiskColor()}` }}>
          <div className="kicker" style={{ marginBottom: 12, color: getRiskColor() }}>
            <Shield size={16} /> Recommended Actions
          </div>
          <ul style={{ marginTop: 12, paddingLeft: 20, marginBottom: 0 }}>
            {session.nextSteps.map((step, index) => (
              <li key={index} className="p" style={{ marginTop: index > 0 ? 10 : 0 }}>
                {step}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card">
        <div className="kicker" style={{ marginBottom: 8 }}>What's Next?</div>
        <p className="p">
          This scan session has been saved to your dashboard. You can review it anytime or start a new analysis.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <button
            onClick={onComplete}
            className="btn primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <FileText size={16} /> Save to Dashboard
          </button>
          <button
            onClick={onStartNew}
            className="btn"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <RotateCcw size={16} /> Start New Scan
          </button>
          <Link
            to="/"
            className="btn"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Home size={16} /> Home
          </Link>
        </div>
      </section>
    </>
  );
}
