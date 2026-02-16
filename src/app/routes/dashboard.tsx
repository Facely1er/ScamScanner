import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { FileText, Trash2, Clock, Settings, Home, Download, Upload, Shield, Search, X, FileDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useSessionStore } from '../../state/sessionStore';
import { useLocale } from '../../contexts/LocaleContext';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { exportReportToPDF, exportAllReportsToPDF, exportSessionToPDF } from '../../utils/pdfExporter';

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
  const { t } = useLocale();
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

  const exportToPDF = () => {
    if (allReports.length === 0) {
      alert(t('dashboard.noReportsToExport'));
      return;
    }
    exportAllReportsToPDF(allReports);
  };

  const exportReportPDF = (report: Report) => {
    exportReportToPDF(report);
  };

  const exportSessionPDF = (session: any) => {
    exportSessionToPDF(session);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = e.target?.result;
        if (typeof raw !== 'string') {
          alert(t('dashboard.invalidBackupFile'));
          return;
        }
        const data = JSON.parse(raw);
        if (confirm(t('dashboard.importReplaceConfirm'))) {
          if (data.reports) setAllReports(data.reports);
          if (data.documents) setAllDocuments(data.documents);
          if (data.preferences) {
            updatePreferences(data.preferences);
          }
          alert(t('dashboard.dataImportedSuccess'));
        }
      } catch (err) {
        alert(t('dashboard.invalidBackupFormat'));
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const deleteReport = (id: string) => {
    if (!confirm(t('dashboard.deleteReportConfirm'))) return;
    setAllReports(allReports.filter((r) => r.id !== id));
  };

  const deleteDocument = (id: string) => {
    if (!confirm(t('dashboard.deleteDocumentConfirm'))) return;
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
            <div className="kicker"><FileText size={16} /> {t('dashboard.kicker')}</div>
            <h1 className="h1">{t('dashboard.title')}</h1>
            <p className="p">{t('dashboard.subtitle')}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/" className="btn" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Home size={16} aria-hidden="true" /> <span>{t('dashboard.home')}</span>
            </Link>
            <Link to="/account" className="btn" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Settings size={16} aria-hidden="true" /> <span>{t('dashboard.preferences')}</span>
            </Link>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={exportToPDF}
                className="btn primary"
                style={{ display: 'flex', gap: 8, alignItems: 'center' }}
                aria-label={t('dashboard.ariaExportPdf')}
                title={t('dashboard.exportToPdf')}
              >
                <FileDown size={16} aria-hidden="true" /> <span>{t('dashboard.exportPdf')}</span>
              </button>
            </div>
            <button
              onClick={exportData}
              className="btn"
              style={{ display: 'flex', gap: 8, alignItems: 'center' }}
              aria-label={t('dashboard.ariaExportJson')}
              title={t('dashboard.ariaExportJson')}
            >
              <Download size={16} aria-hidden="true" /> <span>{t('dashboard.exportJson')}</span>
            </button>
            <label className="btn" style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
              <Upload size={16} aria-hidden="true" /> <span>{t('dashboard.import')}</span>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                style={{ display: 'none' }}
                aria-label={t('dashboard.ariaImport')}
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
            placeholder={t('dashboard.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ paddingLeft: 40, paddingRight: searchQuery ? 40 : 16 }}
            aria-label={t('dashboard.ariaSearch')}
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
              aria-label={t('dashboard.clearSearch')}
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </section>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('sessions')}
            className={activeTab === 'sessions' ? 'tab-active' : 'tab'}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              background: activeTab === 'sessions' ? 'var(--card)' : 'transparent',
              borderBottom: activeTab === 'sessions' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'sessions' ? 'var(--text)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'sessions' ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'sessions') {
                e.currentTarget.style.background = 'var(--bg-secondary)';
                e.currentTarget.style.color = 'var(--text)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'sessions') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            {t('dashboard.tabSessions')} ({searchQuery ? filteredSessions.length : sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={activeTab === 'reports' ? 'tab-active' : 'tab'}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              background: activeTab === 'reports' ? 'var(--card)' : 'transparent',
              borderBottom: activeTab === 'reports' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'reports' ? 'var(--text)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'reports' ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'reports') {
                e.currentTarget.style.background = 'var(--bg-secondary)';
                e.currentTarget.style.color = 'var(--text)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'reports') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            {t('dashboard.tabReports')} ({searchQuery ? filteredReports.length : reports.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={activeTab === 'documents' ? 'tab-active' : 'tab'}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              background: activeTab === 'documents' ? 'var(--card)' : 'transparent',
              borderBottom: activeTab === 'documents' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'documents' ? 'var(--text)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'documents' ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'documents') {
                e.currentTarget.style.background = 'var(--bg-secondary)';
                e.currentTarget.style.color = 'var(--text)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'documents') {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            {t('dashboard.tabDocuments')} ({searchQuery ? filteredDocuments.length : documents.length})
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <LoadingSpinner size={32} label={t('dashboard.loading')} />
            </div>
          ) : (
            <>
              {activeTab === 'sessions' && (
                <div>
                  {filteredSessions.length === 0 ? (
                    searchQuery ? (
                      <EmptyState
                        icon={Search}
                        title={t('dashboard.noSessionsFound')}
                        description={t('dashboard.noSessionsMatch', { query: searchQuery })}
                        action={{
                          label: t('dashboard.clearSearchAction'),
                          onClick: () => setSearchQuery('')
                        }}
                      />
                    ) : (
                      <EmptyState
                        icon={Shield}
                        title={t('dashboard.noScanSessionsYet')}
                        description={t('dashboard.noScanSessionsDesc')}
                        action={{
                          label: t('dashboard.startNewScan'),
                          onClick: () => navigate('/scan')
                        }}
                      />
                    )
                  ) : (
                    <div className="grid nested">
                      {filteredSessions.slice().reverse().map((session) => (
                        <div
                          key={session.id}
                          className="card"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 16,
                          }}
                        >
                          <Link
                            to="/scan"
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/scan?session=${session.id}`;
                            }}
                            style={{
                              flex: 1,
                              textDecoration: 'none',
                              color: 'inherit'
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <h3 className="h3" style={{ margin: 0 }}>
                                  {session.context.senderName || t('dashboard.unknownSender')}
                                </h3>
                                <span
                                  className="badge"
                                  style={{
                                    backgroundColor: getRiskColor(session.overallRiskLevel),
                                    color: 'white',
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {session.overallRiskLevel} {t('dashboard.risk')}
                                </span>
                              </div>
                              <div className="small" style={{ marginTop: 4, display: 'flex', gap: 12 }}>
                                <span style={{ textTransform: 'capitalize' }}>
                                  {session.context.origin.replace('_', ' ')}
                                </span>
                              <span style={{ color: 'var(--text-muted)' }}>
                                {session.evidence.length} {t('dashboard.evidence')} • {session.patternMatches.length} {t('dashboard.patterns')}
                              </span>
                              <span style={{ color: 'var(--text-muted)', display: 'flex', gap: 4, alignItems: 'center' }}>
                                <Clock size={12} /> {formatDate(new Date(session.updatedAt).toISOString())}
                              </span>
                              </div>
                            </div>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              exportSessionPDF(session);
                            }}
                            className="btn icon-only"
                            style={{
                              color: 'var(--primary)',
                              marginLeft: 8
                            }}
                            aria-label={`${t('dashboard.exportToPdf')}: ${session.context.senderName || t('dashboard.unknownSender')}`}
                            title={t('dashboard.exportToPdf')}
                          >
                            <FileDown size={16} aria-hidden="true" />
                          </button>
                        </div>
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
                        title={t('dashboard.noReportsFound')}
                        description={t('dashboard.noReportsMatch', { query: searchQuery })}
                        action={{
                          label: t('dashboard.clearSearchAction'),
                          onClick: () => setSearchQuery('')
                        }}
                      />
                    ) : (
                      <EmptyState
                        icon={FileText}
                        title={t('dashboard.noReportsYet')}
                        description={t('dashboard.noReportsDesc')}
                        action={{
                          label: t('dashboard.goToTools'),
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
                                {report.risk_level} {t('dashboard.risk')}
                              </span>
                            </div>
                            <div className="small" style={{ marginTop: 4, display: 'flex', gap: 12 }}>
                              <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{report.tool_type}</span>
                              <span style={{ color: 'var(--text-muted)', display: 'flex', gap: 4, alignItems: 'center' }}>
                                <Clock size={12} /> {formatDate(report.created_at)}
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <button
                              onClick={() => exportReportPDF(report)}
                              className="btn icon-only"
                              style={{
                                color: 'var(--primary)',
                              }}
                              aria-label={`Export report to PDF: ${report.title}`}
                              title={t('dashboard.exportToPdf')}
                            >
                              <FileDown size={16} aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => deleteReport(report.id)}
                              className="btn icon-only"
                              style={{
                                color: 'var(--error)',
                              }}
                              aria-label={`${t('dashboard.deleteReportConfirm')} ${report.title}`}
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          </div>
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
                        title={t('dashboard.noDocumentsFound')}
                        description={t('dashboard.noDocumentsMatch', { query: searchQuery })}
                        action={{
                          label: t('dashboard.clearSearchAction'),
                          onClick: () => setSearchQuery('')
                        }}
                      />
                    ) : (
                      <EmptyState
                        icon={FileText}
                        title={t('dashboard.noDocumentsYet')}
                        description={t('dashboard.noDocumentsDesc')}
                        action={{
                          label: t('dashboard.goToTools'),
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
                            <p className="small" style={{ marginTop: 4, color: 'var(--text-secondary)' }}>
                              {doc.description || t('dashboard.noDescription')}
                            </p>
                            <div className="small" style={{ marginTop: 4, display: 'flex', gap: 12 }}>
                              <span className="badge">{doc.file_type}</span>
                              <span style={{ color: 'var(--text-muted)', display: 'flex', gap: 4, alignItems: 'center' }}>
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
                            aria-label={`${t('dashboard.deleteDocumentConfirm')} ${doc.title}`}
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
