import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { FileText, Trash2, Clock, Settings, Home, Download, Upload, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useSessionStore } from '../../state/sessionStore';

interface Report {
  id: string;
  title: string;
  tool_type: string;
  risk_level: string;
  created_at: string;
  content: any;
}

export default function Dashboard() {
  const [allReports, setAllReports] = useLocalStorage<Report[]>('cyberstition_reports', []);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'sessions' | 'reports'>('sessions');
  const { preferences, updatePreferences } = usePreferences();
  const { sessions } = useSessionStore();
  const navigate = useNavigate();

  const reports = allReports;

  const exportData = () => {
    const data = {
      reports: allReports,
      preferences: preferences,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberstition-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (confirm('This will replace your current data. Continue?')) {
          if (data.reports) setAllReports(data.reports);
          if (data.preferences) {
            updatePreferences(data.preferences);
          }
          alert('Data imported successfully!');
        }
      } catch (err) {
        alert('Invalid backup file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const deleteReport = (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    setAllReports(allReports.filter((r) => r.id !== id));
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="grid" style={{ gap: 14 }}>
      <section className="card">
        <div className="d-flex justify-between items-center">
          <div>
            <div className="kicker"><FileText size={16} /> Dashboard</div>
            <h1 className="h1">Analysis History</h1>
            <p className="p">View and manage your saved reports and documents.</p>
          </div>
          <div className="d-flex gap-12">
            <Link to="/" className="btn d-flex gap-8 items-center">
              <Home size={16} /> Home
            </Link>
            <Link to="/account" className="btn d-flex gap-8 items-center">
              <Settings size={16} /> Preferences
            </Link>
            <button
              onClick={exportData}
              className="btn d-flex gap-8 items-center"
            >
              <Download size={16} /> Export
            </button>
            <label className="btn d-flex gap-8 items-center cursor-pointer">
              <Upload size={16} /> Import
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="d-none"
              />
            </label>
          </div>
        </div>
      </section>

      <div className="card p-0 overflow-hidden">
        <div className="tab-nav">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`tab-btn${activeTab === 'sessions' ? ' tab-active' : ''}`}
          >
            Scan Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`tab-btn${activeTab === 'reports' ? ' tab-active' : ''}`}
          >
            Reports ({reports.length})
          </button>
        </div>

        <div className="p-20">
          {loading ? (
            <div className="text-center p-40">
              <p className="p">Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'sessions' && (
                <div>
                  {sessions.length === 0 ? (
                    <div className="text-center p-40">
                      <Shield size={48} className="mx-auto mb-16 opacity-3" />
                      <p className="p">No scan sessions yet.</p>
                      <p className="small mt-8 mb-16">
                        Start a guided scan to analyze content with context-aware pattern detection.
                      </p>
                      <Link to="/scan" className="btn primary">Start Your First Scan</Link>
                    </div>
                  ) : (
                    <div className="grid gap-12">
                      {sessions.slice().reverse().map((session) => (
                        <Link
                          key={session.id}
                          to={`/scan?session=${session.id}`}
                          className="card d-flex justify-between items-center p-16"
                          style={{ textDecoration: 'none' }}
                        >
                          <div className="flex-1">
                            <div className="d-flex items-center gap-10">
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
                                {session.overallRiskLevel} risk
                              </span>
                            </div>
                            <div className="small mt-4 d-flex gap-12">
                              <span className="capitalize">
                                {session.context.origin.replace('_', ' ')}
                              </span>
                              <span className="opacity-6">
                                {session.evidence.length} evidence • {session.patternMatches.length} patterns
                              </span>
                              <span className="opacity-6 d-flex gap-4 items-center">
                                <Clock size={12} /> {formatDate(new Date(session.updatedAt).toISOString())}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reports' && (
                <div>
                  {reports.length === 0 ? (
                    <div className="text-center p-40">
                      <FileText size={48} className="mx-auto mb-16 opacity-3" />
                      <p className="p">No reports saved yet.</p>
                      <p className="small mt-8 mb-16">
                        Use the analysis tools to create reports. They will appear here once saved.
                      </p>
                      <div className="d-flex gap-10 justify-center flex-wrap mt-20">
                        <Link to="/scan" className="btn primary">Start a Guided Scan</Link>
                        <Link to="/tools" className="btn">Use Analysis Tools</Link>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-12">
                      {reports.map((report) => (
                        <div
                          key={report.id}
                          className="card d-flex justify-between items-center p-16"
                        >
                          <div className="flex-1">
                            <div className="d-flex items-center gap-10">
                              <h3 className="h3 m-0">{report.title}</h3>
                              <span
                                className="badge capitalize"
                                style={{
                                  backgroundColor: getRiskColor(report.risk_level),
                                  color: 'white',
                                }}
                              >
                                {report.risk_level} risk
                              </span>
                            </div>
                            <div className="small mt-4 d-flex gap-12">
                              <span className="capitalize">{report.tool_type}</span>
                              <span className="opacity-6 d-flex gap-4 items-center">
                                <Clock size={12} /> {formatDate(report.created_at)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="btn p-8 min-w-auto"
                            style={{ color: 'rgb(239 68 68)' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
