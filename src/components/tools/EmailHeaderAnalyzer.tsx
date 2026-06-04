import React, { useState, useEffect, useRef } from 'react';
import { Mail, AlertTriangle, ShieldCheck, XCircle, Info, HelpCircle, Download } from 'lucide-react';
import { analyzeEmailHeaders, getEmailRiskLevel } from '../../utils/emailHeaderAnalyzer';
import { mapEmailAnalysisToAlert } from '../../mappers/emailToCautionAlert';
import { useCautionStore } from '../../state/cautionStore';

const EmailHeaderAnalyzer: React.FC = () => {
  const [headerText, setHeaderText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addAlert = useCautionStore((st) => st.addAlert);

  const handleAnalyze = () => {
    if (!headerText.trim()) return;
    const analysis = analyzeEmailHeaders(headerText);
    setResult(analysis);
    if (analysis.isSuspicious) {
      const alert = mapEmailAnalysisToAlert(analysis, { id: `email-${Date.now()}`, from: analysis.headerInfo.from });
      if (alert) addAlert(alert);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleClear = () => { setHeaderText(''); setResult(null); };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const handleFocus = async () => {
      if (headerText.trim()) return;
      try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText.includes('From:') && clipboardText.includes('To:')) setHeaderText(clipboardText);
      } catch {}
    };
    textarea.addEventListener('focus', handleFocus);
    return () => textarea.removeEventListener('focus', handleFocus);
  }, [headerText]);

  const riskLevel = result ? getEmailRiskLevel(result.riskScore) : null;

  const riskColor = result
    ? result.isSuspicious
      ? result.riskScore >= 70 ? 'var(--danger, #ef4444)' : '#f97316'
      : '#22c55e'
    : 'var(--border)';

  return (
    <div style={{ maxWidth: 768 }}>
      <div className="mb-20">
        <p className="p mb-12">
          Paste email headers to analyze for spoofing, authentication failures, and phishing indicators
        </p>
        <div className="tool-info-box">
          <Info size={16} className="text-primary flex-shrink-0 mt-2" />
          <p className="small m-0">
            <strong>Privacy First:</strong> All analysis happens in your browser. Email headers never leave your device.
          </p>
        </div>
      </div>

      <div className="d-flex justify-end mb-8">
        <button
          onClick={() => setShowHelp(!showHelp)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text-secondary)' }}
          title="Show help"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      {showHelp && (
        <div className="tool-help-box">
          <p className="small font-semibold mb-8">How to get email headers:</p>
          <ul className="tool-list-none-gap4">
            {[
              ['Gmail', 'Open email → Click three dots → "Show original" → Copy all text'],
              ['Outlook', 'Right-click email → "View source" → Copy all text'],
              ['Apple Mail', 'View → Message → Raw Source → Copy all text'],
              ['Other clients', 'Look for "View source" or "Show headers" option'],
            ].map(([client, desc]) => (
              <li key={client} className="small d-flex gap-6">
                <span className="text-primary">•</span>
                <span><strong>{client}:</strong> {desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="tool-card">
        <label className="tool-label">Paste email headers here:</label>
        <textarea
          ref={textareaRef}
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          rows={12}
          className="tool-textarea-mono"
          placeholder={`From: sender@example.com\nTo: recipient@example.com\nSubject: Test Email\nDate: Mon, 1 Jan 2024 12:00:00 +0000\nAuthentication-Results: ... (Auto-detects from clipboard on focus)`}
        />
        <div className="tool-row">
          <button
            onClick={handleAnalyze}
            disabled={!headerText.trim()}
            className="btn primary d-inline-flex items-center gap-6 flex-1 justify-center"
            style={{ opacity: !headerText.trim() ? 0.5 : 1, cursor: !headerText.trim() ? 'not-allowed' : 'pointer' }}
          >
            <Mail size={14} /> Analyze Headers
          </button>
          <button
            onClick={async () => {
              try {
                const t = await navigator.clipboard.readText();
                if (t) setHeaderText(t);
              } catch { handleClear(); }
            }}
            className="btn d-inline-flex items-center gap-6"
            title="Paste from clipboard"
          >
            <Download size={14} /> Paste
          </button>
          <button
            onClick={handleClear}
            disabled={!headerText && !result}
            className="btn d-inline-flex items-center gap-6"
            style={{ opacity: (!headerText && !result) ? 0.5 : 1, cursor: (!headerText && !result) ? 'not-allowed' : 'pointer' }}
          >
            <XCircle size={14} /> Clear
          </button>
          <span className="tool-hint">Ctrl+Enter to analyze</span>
        </div>
      </div>

      {result && (
        <div style={{
          border: `2px solid ${riskColor}`,
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 16,
          background: 'var(--bg-secondary)',
        }}>
          <div className="tool-result-header">
            {result.isSuspicious
              ? <AlertTriangle size={28} style={{ color: riskColor, flexShrink: 0 }} />
              : <ShieldCheck size={28} style={{ color: '#22c55e', flexShrink: 0 }} />}
            <div>
              <p className="m-0 font-bold" style={{ fontSize: 16, color: riskColor }}>
                {result.isSuspicious
                  ? result.riskScore >= 70 ? '🚨 CRITICAL RISK' : '⚠️ HIGH RISK'
                  : '✓ Low Risk'}
              </p>
              <p className="small m-0 text-secondary-color">
                Risk Score: <strong>{result.riskScore}%</strong> ({riskLevel})
              </p>
            </div>
          </div>

          {result.issues.length > 0 && (
            <div className="mb-12">
              <p className="small font-semibold mb-6">Detected Issues:</p>
              <ul className="tool-list-none">
                {result.issues.map((issue: string, i: number) => (
                  <li key={i} className="small d-flex gap-6">
                    <span style={{ color: '#ef4444' }}>•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="tool-sub-card">
            <p className="small font-semibold mb-6">Header Information:</p>
            <div className="d-flex flex-col gap-4">
              {result.headerInfo.from && (
                <p className="small m-0">
                  <span className="text-secondary-color">From:</span>{' '}
                  <strong>{result.headerInfo.from}</strong>
                </p>
              )}
              {result.headerInfo.spf && (
                <p className="small m-0">
                  <span className="text-secondary-color">SPF:</span>{' '}
                  <strong style={{ color: result.headerInfo.spf === 'pass' ? '#22c55e' : '#ef4444' }}>
                    {result.headerInfo.spf.toUpperCase()}
                  </strong>
                </p>
              )}
              {result.headerInfo.dkim && (
                <p className="small m-0">
                  <span className="text-secondary-color">DKIM:</span>{' '}
                  <strong style={{ color: result.headerInfo.dkim === 'pass' ? '#22c55e' : '#ef4444' }}>
                    {result.headerInfo.dkim.toUpperCase()}
                  </strong>
                </p>
              )}
              {result.headerInfo.dmarc && (
                <p className="small m-0">
                  <span className="text-secondary-color">DMARC:</span>{' '}
                  <strong style={{ color: result.headerInfo.dmarc === 'pass' ? '#22c55e' : '#ef4444' }}>
                    {result.headerInfo.dmarc.toUpperCase()}
                  </strong>
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="small font-semibold mb-6">Recommendations:</p>
            <ul className="tool-list-none">
              {result.recommendations.map((rec: string, i: number) => (
                <li key={i} className="small">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="tool-edu-box">
        <p className="small font-semibold mb-8">💡 What to look for:</p>
        <ul className="tool-list-none">
          {[
            'SPF, DKIM, and DMARC authentication failures',
            'Mismatched From and Reply-To domains',
            'Suspicious or typosquatting domains',
            'Invalid or future dates',
            'Missing standard email headers',
          ].map((item) => (
            <li key={item} className="small text-secondary-color">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmailHeaderAnalyzer;
