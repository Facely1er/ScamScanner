import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSessionStore } from '../../state/sessionStore';
import {
  FileText, Trash2, Clock, Settings, Home, Shield,
  AlertTriangle, CheckCircle, Play, Eye, TrendingUp
} from 'lucide-react';

export default function DashboardSessions() {
  const { sessions, deleteSession, resumeSession } = useSessionStore();
  const [viewingSession, setViewingSession] = useState<string | null>(null);

  const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  const handleResume = (sessionId: string) => {
    resumeSession(sessionId);
    window.location.href = '/scan';
  };

  const handleDelete = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this scan session?')) {
      deleteSession(sessionId);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'rgb(239 68 68)';
      case 'medium':
        return 'rgb(251 146 60)';
      default:
        return 'rgb(34 197 94)';
    }
  };

  const viewingSessionData = viewingSession
    ? sessions.find(s => s.id === viewingSession)
    : null;

  if (viewingSessionData) {
    return <SessionDetailView session={viewingSessionData} onBack={() => setViewingSession(null)} />;
  }

  return (
    <div className="grid">
      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="kicker"><Shield size={16} /> Scan Sessions</div>
            <h1 className="h1">Analysis History</h1>
            <p className="p">View and manage your complete scan sessions with pattern detection and confidence scores.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/scan" className="btn primary" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Shield size={16} /> New Scan
            </Link>
            <Link to="/" className="btn" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Home size={16} /> Home
            </Link>
          </div>
        </div>
      </section>

      {sortedSessions.length === 0 ? (
        <section className="card" style={{ textAlign: 'center', padding: 40 }}>
          <Shield size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p className="p">No scan sessions yet.</p>
          <p className="small" style={{ marginTop: 8, marginBottom: 16 }}>
            Start a guided scan to analyze content with context-aware pattern detection.
          </p>
          <Link to="/scan" className="btn primary">Start Your First Scan</Link>
        </section>
      ) : (
        <div className="grid" style={{ gap: 12 }}>
          {sortedSessions.map((session) => (
            <div
              key={session.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h3 className="h3" style={{ margin: 0 }}>
                      {session.context.senderName || 'Unknown Sender'}
                    </h3>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: getRiskColor(session.overallRiskLevel),
                        color: 'white',
                        textTransform: 'capitalize',
                      }}
                    >
                      {session.overallRiskLevel} Risk
                    </span>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: session.status === 'completed' ? 'var(--primary)' : 'var(--border)',
                        color: session.status === 'completed' ? 'white' : 'var(--text)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {session.status === 'in_progress' ? 'In Progress' : session.status}
                    </span>
                  </div>

                  <div className="small" style={{ marginTop: 6, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ textTransform: 'capitalize' }}>
                      {session.context.origin.replace('_', ' ')}
                    </span>
                    {session.threatCategory !== 'unknown' && (
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        {session.threatCategory.replace('_', ' ')}
                      </span>
                    )}
                    <span style={{ opacity: 0.6, display: 'flex', gap: 4, alignItems: 'center' }}>
                      <Clock size={12} /> {formatDate(session.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 12,
                padding: 12,
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 6
              }}>
                <div>
                  <div className="small" style={{ opacity: 0.7 }}>Confidence</div>
                  <div className="kicker" style={{ marginTop: 2 }}>
                    {Math.round(session.confidence * 100)}%
                  </div>
                </div>
                <div>
                  <div className="small" style={{ opacity: 0.7 }}>Risk Score</div>
                  <div className="kicker" style={{ marginTop: 2, color: getRiskColor(session.overallRiskLevel) }}>
                    {session.overallRiskScore}/100
                  </div>
                </div>
                <div>
                  <div className="small" style={{ opacity: 0.7 }}>Evidence</div>
                  <div className="kicker" style={{ marginTop: 2 }}>
                    {session.evidence.length} items
                  </div>
                </div>
                <div>
                  <div className="small" style={{ opacity: 0.7 }}>Patterns</div>
                  <div className="kicker" style={{ marginTop: 2 }}>
                    {session.patternMatches.length} found
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setViewingSession(session.id)}
                  className="btn primary"
                  style={{ display: 'flex', gap: 8, alignItems: 'center' }}
                >
                  <Eye size={16} /> View Details
                </button>
                {session.status !== 'completed' && (
                  <button
                    onClick={() => handleResume(session.id)}
                    className="btn"
                    style={{ display: 'flex', gap: 8, alignItems: 'center' }}
                  >
                    <Play size={16} /> Resume
                  </button>
                )}
                <button
                  onClick={() => handleDelete(session.id)}
                  className="btn"
                  style={{
                    marginLeft: 'auto',
                    color: 'rgb(239 68 68)',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SessionDetailView({ session, onBack }: any) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'rgb(239 68 68)';
      case 'medium':
        return 'rgb(251 146 60)';
      default:
        return 'rgb(34 197 94)';
    }
  };

  return (
    <div className="grid">
      <section className="card">
        <button onClick={onBack} className="btn" style={{ marginBottom: 12 }}>
          ← Back to Sessions
        </button>
        <div className="kicker"><Shield size={16} /> Scan Session Details</div>
        <h1 className="h1">{session.context.senderName || 'Unknown Sender'}</h1>
        <div className="small" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
          <span>Origin: {session.context.origin.replace('_', ' ')}</span>
          <span>•</span>
          <span>{formatDate(session.createdAt)}</span>
        </div>
      </section>

      <section className="card">
        <div className="kicker"><TrendingUp size={16} /> Risk Assessment</div>
        <div style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 16
        }}>
          <div style={{ padding: 16, backgroundColor: 'var(--bg-secondary)', borderRadius: 6 }}>
            <div className="small" style={{ opacity: 0.7 }}>Overall Risk</div>
            <div className="h2" style={{ marginTop: 4, color: getRiskColor(session.overallRiskLevel) }}>
              {session.overallRiskLevel}
            </div>
          </div>
          <div style={{ padding: 16, backgroundColor: 'var(--bg-secondary)', borderRadius: 6 }}>
            <div className="small" style={{ opacity: 0.7 }}>Risk Score</div>
            <div className="h2" style={{ marginTop: 4, color: getRiskColor(session.overallRiskLevel) }}>
              {session.overallRiskScore}/100
            </div>
          </div>
          <div style={{ padding: 16, backgroundColor: 'var(--bg-secondary)', borderRadius: 6 }}>
            <div className="small" style={{ opacity: 0.7 }}>Confidence</div>
            <div className="h2" style={{ marginTop: 4 }}>
              {Math.round(session.confidence * 100)}%
            </div>
          </div>
          {session.threatCategory !== 'unknown' && (
            <div style={{ padding: 16, backgroundColor: 'var(--bg-secondary)', borderRadius: 6 }}>
              <div className="small" style={{ opacity: 0.7 }}>Threat Category</div>
              <div className="kicker" style={{ marginTop: 4, textTransform: 'capitalize' }}>
                {session.threatCategory.replace('_', ' ')}
              </div>
            </div>
          )}
        </div>
      </section>

      {session.context.requestedAction && (
        <section className="card" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="kicker">Requested Action</div>
          <p className="p" style={{ marginTop: 8 }}>{session.context.requestedAction}</p>
        </section>
      )}

      {session.patternMatches.length > 0 && (
        <section className="card">
          <div className="kicker"><AlertTriangle size={16} /> Pattern Matches ({session.patternMatches.length})</div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {session.patternMatches.map((pattern: any, index: number) => (
              <div key={index} style={{
                padding: 12,
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 6,
                borderLeft: `4px solid ${getRiskColor(pattern.confidence > 0.7 ? 'high' : pattern.confidence > 0.4 ? 'medium' : 'low')}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div className="small" style={{ fontWeight: 600 }}>{pattern.patternName}</div>
                    <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>{pattern.description}</div>
                  </div>
                  <span className="badge">{Math.round(pattern.confidence * 100)}% match</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {session.crossReferences.length > 0 && (
        <section className="card">
          <div className="kicker">Cross-Reference Findings ({session.crossReferences.length})</div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {session.crossReferences.map((ref: any, index: number) => (
              <div key={index} style={{
                padding: 12,
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 6
              }}>
                <div className="small">{ref.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {session.evidence.length > 0 && (
        <section className="card">
          <div className="kicker">Evidence Analyzed ({session.evidence.length})</div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {session.evidence.map((evidence: any) => (
              <div key={evidence.id} style={{
                padding: 12,
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 6
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div className="small" style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {evidence.type}
                  </div>
                  <span className="badge" style={{
                    backgroundColor: getRiskColor(evidence.riskLevel),
                    color: 'white'
                  }}>
                    {evidence.riskLevel} risk
                  </span>
                </div>
                <div className="small" style={{ opacity: 0.8 }}>
                  {evidence.signals.length} signals detected
                </div>
                {evidence.signals.length > 0 && (
                  <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                    {evidence.signals.slice(0, 3).map((signal: any, idx: number) => (
                      <li key={idx} className="small" style={{ marginTop: 4, opacity: 0.9 }}>
                        {signal.description}
                      </li>
                    ))}
                    {evidence.signals.length > 3 && (
                      <li className="small" style={{ marginTop: 4, opacity: 0.7, fontStyle: 'italic' }}>
                        +{evidence.signals.length - 3} more signals
                      </li>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {session.nextSteps.length > 0 && (
        <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div className="kicker">Recommended Actions</div>
          <ul style={{ marginTop: 12, paddingLeft: 20 }}>
            {session.nextSteps.map((step: string, index: number) => (
              <li key={index} className="p" style={{ marginTop: 8 }}>{step}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
