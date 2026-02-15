import React, { useEffect, useState, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { FileText, Trash2, Clock, Settings, Home, Download, Upload, Shield, Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useSessionStore } from '../../state/sessionStore';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface Report {
  id: string;
  title: string;
  tool_type: string;
  risk_level: string;
  created_at: string;
  content: any;
}

interface Document {
  id: string;
  title: string;
  description: string;
  file_type: string;
  created_at: string;
}

export default function Dashboard() {
  const [allReports, setAllReports] = useLocalStorage<Report[]>('cyberstition_reports', []);
  const [allDocuments, setAllDocuments] = useLocalStorage<Document[]>('cyberstition_documents', []);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'sessions' | 'reports' | 'documents'>('sessions');
  const [searchQuery, setSearchQuery] = useState('');
  const { preferences, updatePreferences } = usePreferences();
  const { sessions } = useSessionStore();
  const navigate = useNavigate();

  const reports = allReports;
  const documents = allDocuments;

  // Filter sessions based on search
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const query = searchQuery.toLowerCase();
    return sessions.filter(session => 
      session.context.senderName?.toLowerCase().includes(query) ||
      session.context.origin?.toLowerCase().includes(query) ||
      session.patternMatches.some(p => p.patternName.toLowerCase().includes(query))
    );
  }, [sessions, searchQuery]);

  // Filter reports based on search
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;
    const query = searchQuery.toLowerCase();
    return reports.filter(report =>
      report.title.toLowerCase().includes(query) ||
      report.tool_type.toLowerCase().includes(query) ||
      report.risk_level.toLowerCase().includes(query)
    );
  }, [reports, searchQuery]);

  // Filter documents based on search
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const query = searchQuery.toLowerCase();
    return documents.filter(doc =>
      doc.title.toLowerCase().includes(query) ||
      doc.description?.toLowerCase().includes(query) ||
      doc.file_type.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  const exportData = () => {
    const data = {
      reports: allReports,
      documents: allDocuments,
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
          if (data.documents) setAllDocuments(data.documents);
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
    // Reset input
    event.target.value = '';
  };

  const deleteReport = (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    setAllReports(allReports.filter((r) => r.id !== id));
  };

  const deleteDocument = (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    setAllDocuments(allDocuments.filter((d) => d.id !== id));
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
    <div className="grid">
      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="kicker"><FileText size={16} /> Dashboard</div>
            <h1 className="h1">Analysis History</h1>
            <p className="p">View and manage your saved reports and documents.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/" className="btn" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Home size={16} aria-hidden="true" /> <span>Home</span>
            </Link>
            <Link to="/account" className="btn" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Settings size={16} aria-hidden="true" /> <span>Preferences</span>
            </Link>
            <button
              onClick={exportData}
              className="btn"
              style={{ display: 'flex', gap: 8, alignItems: 'center' }}
              aria-label="Export all data"
            >
              <Download size={16} aria-hidden="true" /> <span>Export</span>
            </button>
            <label className="btn" style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
              <Upload size={16} aria-hidden="true" /> <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                style={{ display: 'none' }}
                aria-label="Import data from file"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="card">
        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: 14, 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search sessions, reports, documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ paddingLeft: 40, paddingRight: searchQuery ? 40 : 16 }}
            aria-label="Search dashboard"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn icon-only"
              style={{ 
                position: 'absolute', 
                right: 4, 
                top: '50%', 
                transform: 'translateY(-50%)',
                padding: 6
              }}
              aria-label="Clear search"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </section>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
          <button
            onClick={() => setActiveTab('sessions')}
            className={activeTab === 'sessions' ? 'tab-active' : 'tab'}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              background: activeTab === 'sessions' ? 'white' : 'transparent',
              borderBottom: activeTab === 'sessions' ? '2px solid var(--primary)' : 'none',
              fontWeight: activeTab === 'sessions' ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            Scan Sessions ({searchQuery ? filteredSessions.length : sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={activeTab === 'reports' ? 'tab-active' : 'tab'}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              background: activeTab === 'reports' ? 'white' : 'transparent',
              borderBottom: activeTab === 'reports' ? '2px solid var(--primary)' : 'none',
              fontWeight: activeTab === 'reports' ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            Reports ({searchQuery ? filteredReports.length : reports.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={activeTab === 'documents' ? 'tab-active' : 'tab'}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              background: activeTab === 'documents' ? 'white' : 'transparent',
              borderBottom: activeTab === 'documents' ? '2px solid var(--primary)' : 'none',
              fontWeight: activeTab === 'documents' ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            Documents ({searchQuery ? filteredDocuments.length : documents.length})
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <LoadingSpinner size={32} label="Loading..." />
            </div>
          ) : (
            <>
              {activeTab === 'sessions' && (
                <div>
                  {filteredSessions.length === 0 ? (
                    searchQuery ? (
                      <EmptyState
                        icon={Search}
                        title="No sessions found"
                        description={`No scan sessions match "${searchQuery}". Try a different search term.`}
                        action={{
                          label: "Clear Search",
                          onClick: () => setSearchQuery('')
                        }}
                      />
                    ) : (
                      <EmptyState
                        icon={Shield}
                        title="No scan sessions yet"
                        description="Start a new guided scan to analyze suspicious content. The guided workflow will help you through the analysis process."
                        action={{
                          label: "Start New Scan",
                          onClick: () => navigate('/scan')
                        }}
                      />
                    )
                  ) : (
                    <div className="grid nested">
                      {filteredSessions.slice().reverse().map((session) => (
                        <Link
                          key={session.id}
                          to="/scan"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/scan?session=${session.id}`;
                          }}
                          className="card"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 16,
                            textDecoration: 'none'
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                                {session.overallRiskLevel} risk
                              </span>
                            </div>
                            <div className="small" style={{ marginTop: 4, display: 'flex', gap: 12 }}>
                              <span style={{ textTransform: 'capitalize' }}>
                                {session.context.origin.replace('_', ' ')}
                              </span>
                              <span style={{ opacity: 0.6 }}>
                                {session.evidence.length} evidence • {session.patternMatches.length} patterns
                              </span>
                              <span style={{ opacity: 0.6, display: 'flex', gap: 4, alignItems: 'center' }}>
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
                  {filteredReports.length === 0 ? (
                    searchQuery ? (
                      <EmptyState
                        icon={Search}
                        title="No reports found"
                        description={`No reports match "${searchQuery}". Try a different search term.`}
                        action={{
                          label: "Clear Search",
                          onClick: () => setSearchQuery('')
                        }}
                      />
                    ) : (
                      <EmptyState
                        icon={FileText}
                        title="No reports yet"
                        description="Reports from individual tool analyses will appear here. Try analyzing a message, email, image, or profile."
                        action={{
                          label: "Go to Tools",
                          onClick: () => navigate('/tools')
                        }}
                      />
                    )
                  ) : (
                    <div className="grid nested">
                      {filteredReports.map((report) => (
                        <div
                          key={report.id}
                          className="card"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 16,
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <h3 className="h3" style={{ margin: 0 }}>{report.title}</h3>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: getRiskColor(report.risk_level),
                                  color: 'white',
                                  textTransform: 'capitalize',
                                }}
                              >
                                {report.risk_level} risk
                              </span>
                            </div>
                            <div className="small" style={{ marginTop: 4, display: 'flex', gap: 12 }}>
                              <span style={{ textTransform: 'capitalize' }}>{report.tool_type}</span>
                              <span style={{ opacity: 0.6, display: 'flex', gap: 4, alignItems: 'center' }}>
                                <Clock size={12} /> {formatDate(report.created_at)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteReport(report.id)}
                            className="btn icon-only"
                            style={{
                              color: 'var(--error)',
                            }}
                            aria-label={`Delete report: ${report.title}`}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div>
                  {filteredDocuments.length === 0 ? (
                    searchQuery ? (
                      <EmptyState
                        icon={Search}
                        title="No documents found"
                        description={`No documents match "${searchQuery}". Try a different search term.`}
                        action={{
                          label: "Clear Search",
                          onClick: () => setSearchQuery('')
                        }}
                      />
                    ) : (
                      <EmptyState
                        icon={FileText}
                        title="No documents saved yet"
                        description="Documents uploaded for analysis will appear here once saved."
                        action={{
                          label: "Go to Tools",
                          onClick: () => navigate('/tools')
                        }}
                      />
                    )
                  ) : (
                    <div className="grid nested">
                      {filteredDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="card"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 16,
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <h3 className="h3" style={{ margin: 0 }}>{doc.title}</h3>
                            <p className="small" style={{ marginTop: 4, opacity: 0.8 }}>
                              {doc.description || 'No description'}
                            </p>
                            <div className="small" style={{ marginTop: 4, display: 'flex', gap: 12 }}>
                              <span className="badge">{doc.file_type}</span>
                              <span style={{ opacity: 0.6, display: 'flex', gap: 4, alignItems: 'center' }}>
                                <Clock size={12} /> {formatDate(doc.created_at)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="btn icon-only"
                            style={{
                              color: 'var(--error)',
                            }}
                            aria-label={`Delete document: ${doc.title}`}
                          >
                            <Trash2 size={16} aria-hidden="true" />
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
