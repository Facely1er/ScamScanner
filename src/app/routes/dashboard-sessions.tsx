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
    <div className="grid" style={{ gap: 14 }}>
      <section className="card">
        <div className="d-flex justify-between items-center flex-wrap gap-12">
          <div>
            <div className="kicker"><Shield size={16} /> Scan Sessions</div>
            <h1 className="h1">Analysis History</h1>
            <p className="p">View and manage your complete scan sessions with pattern detection and confidence scores.</p>
          </div>
          <div className="d-flex gap-12">
            <Link to="/scan" className="btn primary d-flex gap-8 items-center">
              <Shield size={16} /> New Scan
            </Link>
            <Link to="/" className="btn d-flex gap-8 items-center">
              <Home size={16} /> Home
            </Link>
          </div>
        </div>
      </section>

      {sortedSessions.length === 0 ? (
        <section className="card text-center p-40">
          <Shield size={48} className="mx-auto mb-16 opacity-3" />
          <p className="p">No scan sessions yet.</p>
          <p className="small mt-8 mb-16">
            Start a guided scan to analyze content with context-aware pattern detection.
          </p>
          <Link to="/scan" className="btn primary">Start Your First Scan</Link>
        </section>
      ) : (
        <div className="grid gap-12">
          {sortedSessions.map((session) => (
            <div
              key={session.id}
              className="card d-flex flex-col gap-12 p-16"
            >
              <div className="d-flex justify-between items-start">
                <div className="flex-1">
                  <div className="d-flex items-center gap-10 flex-wrap">
                    <h3 className="h3 m-0">
                      {session.context.senderName || 'Unknown Sender'}
                    </h3>
                    <span
                      className="badge capitalize"
                      style={{
                        backgroundColor: getRiskColor(session.overallRiskLevel),
                        color: 'white',
                      }}
                    >
                      {session.overallRiskLevel} Risk
                    </span>
                    <span
                      className="badge capitalize"
                      style={{
                        backgroundColor: session.status === 'completed' ? 'var(--primary)' : 'var(--border)',
                        color: session.status === 'completed' ? 'white' : 'var(--text)',
                      }}
                    >
                      {session.status === 'in_progress' ? 'In Progress' : session.status}
                    </span>
                  </div>

                  <div className="small mt-6 d-flex gap-12 flex-wrap">
                    <span className="capitalize">
                      {session.context.origin.replace('_', ' ')}
                    </span>
                    {session.threatCategory !== 'unknown' && (
                      <span className="text-primary font-semibold">
                        {session.threatCategory.replace('_', ' ')}
                      </span>
                    )}
                    <span className="opacity-6 d-flex gap-4 items-center">
                      <Clock size={12} /> {formatDate(session.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="d-grid gap-12 p-12 bg-secondary"
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  borderRadius: 6,
                }}
              >
                <div>
                  <div className="small opacity-7">Confidence</div>
                  <div className="kicker mt-2">
                    {Math.round(session.confidence * 100)}%
                  </div>
                </div>
                <div>
                  <div className="small opacity-7">Risk Score</div>
                  <div className="kicker mt-2" style={{ color: getRiskColor(session.overallRiskLevel) }}>
                    {session.overallRiskScore}/100
                  </div>
                </div>
                <div>
                  <div className="small opacity-7">Evidence</div>
                  <div className="kicker mt-2">
                    {session.evidence.length} items
                  </div>
                </div>
                <div>
                  <div className="small opacity-7">Patterns</div>
                  <div className="kicker mt-2">
                    {session.patternMatches.length} found
                  </div>
                </div>
              </div>

              <div className="d-flex gap-8 flex-wrap">
                <button
                  onClick={() => setViewingSession(session.id)}
                  className="btn primary d-flex gap-8 items-center"
                >
                  <Eye size={16} /> View Details
                </button>
                {session.status !== 'completed' && (
                  <button
                    onClick={() => handleResume(session.id)}
                    className="btn d-flex gap-8 items-center"
                  >
                    <Play size={16} /> Resume
                  </button>
                )}
                <button
                  onClick={() => handleDelete(session.id)}
                  className="btn ml-auto"
                  style={{ color: 'rgb(239 68 68)' }}
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
    <div className="grid" style={{ gap: 14 }}>
      <section className="card">
        <button onClick={onBack} className="btn mb-12">
          ← Back to Sessions
        </button>
        <div className="kicker"><Shield size={16} /> Scan Session Details</div>
        <h1 className="h1">{session.context.senderName || 'Unknown Sender'}</h1>
        <div className="small d-flex gap-12 flex-wrap mt-6">
          <span>Origin: {session.context.origin.replace('_', ' ')}</span>
          <span>•</span>
          <span>{formatDate(session.createdAt)}</span>
        </div>
      </section>

      <section className="card">
        <div className="kicker"><TrendingUp size={16} /> Risk Assessment</div>
        <div className="stats-grid mt-16">
          <div className="stat-box">
            <div className="small opacity-7">Overall Risk</div>
            <div className="h2 mt-4" style={{ color: getRiskColor(session.overallRiskLevel) }}>
              {session.overallRiskLevel}
            </div>
          </div>
          <div className="stat-box">
            <div className="small opacity-7">Risk Score</div>
            <div className="h2 mt-4" style={{ color: getRiskColor(session.overallRiskLevel) }}>
              {session.overallRiskScore}/100
            </div>
          </div>
          <div className="stat-box">
            <div className="small opacity-7">Confidence</div>
            <div className="h2 mt-4">
              {Math.round(session.confidence * 100)}%
            </div>
          </div>
          {session.threatCategory !== 'unknown' && (
            <div className="stat-box">
              <div className="small opacity-7">Threat Category</div>
              <div className="kicker mt-4 capitalize">
                {session.threatCategory.replace('_', ' ')}
              </div>
            </div>
          )}
        </div>
      </section>

      {session.context.requestedAction && (
        <section className="card bg-secondary">
          <div className="kicker">Requested Action</div>
          <p className="p mt-8">{session.context.requestedAction}</p>
        </section>
      )}

      {session.patternMatches.length > 0 && (
        <section className="card">
          <div className="kicker"><AlertTriangle size={16} /> Pattern Matches ({session.patternMatches.length})</div>
          <div className="mt-12 d-flex flex-col gap-12">
            {session.patternMatches.map((pattern: any, index: number) => (
              <div
                key={index}
                className="p-12 bg-secondary"
                style={{
                  borderRadius: 6,
                  borderLeft: `4px solid ${getRiskColor(pattern.confidence > 0.7 ? 'high' : pattern.confidence > 0.4 ? 'medium' : 'low')}`,
                }}
              >
                <div className="d-flex justify-between items-start">
                  <div>
                    <div className="small font-semibold">{pattern.patternName}</div>
                    <div className="small mt-4 opacity-8">{pattern.description}</div>
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
          <div className="mt-12 d-flex flex-col gap-8">
            {session.crossReferences.map((ref: any, index: number) => (
              <div
                key={index}
                className="p-12 bg-secondary"
                style={{ borderRadius: 6 }}
              >
                <div className="small">{ref.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {session.evidence.length > 0 && (
        <section className="card">
          <div className="kicker">Evidence Analyzed ({session.evidence.length})</div>
          <div className="mt-12 d-flex flex-col gap-12">
            {session.evidence.map((evidence: any) => (
              <div
                key={evidence.id}
                className="p-12 bg-secondary"
                style={{ borderRadius: 6 }}
              >
                <div className="d-flex justify-between items-center mb-8">
                  <div className="small font-semibold capitalize">
                    {evidence.type}
                  </div>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: getRiskColor(evidence.riskLevel),
                      color: 'white',
                    }}
                  >
                    {evidence.riskLevel} risk
                  </span>
                </div>
                <div className="small opacity-8">
                  {evidence.signals.length} signals detected
                </div>
                {evidence.signals.length > 0 && (
                  <ul className="mt-8 pl-5">
                    {evidence.signals.slice(0, 3).map((signal: any, idx: number) => (
                      <li key={idx} className="small mt-4 opacity-9">
                        {signal.description}
                      </li>
                    ))}
                    {evidence.signals.length > 3 && (
                      <li className="small mt-4 opacity-7 italic">
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
        <section className="card card-secondary">
          <div className="kicker">Recommended Actions</div>
          <ul className="mt-12 pl-5">
            {session.nextSteps.map((step: string, index: number) => (
              <li key={index} className="p mt-8">{step}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
