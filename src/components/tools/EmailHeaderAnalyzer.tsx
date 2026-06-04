import React, { useState, useEffect, useRef } from 'react';
import { Mail, AlertTriangle, ShieldCheck, XCircle, Info, HelpCircle, Download } from 'lucide-react';
import { analyzeEmailHeaders, getEmailRiskLevel } from '../../utils/emailHeaderAnalyzer';
import { mapEmailAnalysisToAlert } from '../../mappers/emailToCautionAlert';
import { useCautionStore } from '../../state/cautionStore';

const s = {
  wrap: { maxWidth: 768 } as React.CSSProperties,
  card: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 16,
  } as React.CSSProperties,
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: 6,
  } as React.CSSProperties,
  textarea: {
    width: '100%',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 12,
    background: 'var(--bg)',
    color: 'var(--text)',
    resize: 'vertical',
    fontFamily: 'monospace',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  row: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const, marginTop: 12 },
  hint: { fontSize: 12, color: 'var(--text-secondary)', marginLeft: 'auto' },
  resultCard: (color: string) => ({
    border: `2px solid ${color}`,
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 16,
    background: 'var(--bg-secondary)',
  } as React.CSSProperties),
  infoBox: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 16,
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  } as React.CSSProperties,
  helpBox: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '16px 20px',
    marginBottom: 16,
  } as React.CSSProperties,
  eduBox: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '16px 20px',
    marginTop: 24,
  } as React.CSSProperties,
  subCard: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '12px 16px',
    marginBottom: 12,
  } as React.CSSProperties,
};

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
    <div style={s.wrap}>
      {/* Description + privacy notice */}
      <div style={{ marginBottom: 20 }}>
        <p className="p" style={{ marginBottom: 12 }}>
          Paste email headers to analyze for spoofing, authentication failures, and phishing indicators
        </p>
        <div style={s.infoBox}>
          <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
          <p className="small" style={{ margin: 0 }}>
            <strong>Privacy First:</strong> All analysis happens in your browser. Email headers never leave your device.
          </p>
        </div>
      </div>

      {/* Help toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button
          onClick={() => setShowHelp(!showHelp)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text-secondary)' }}
          title="Show help"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      {showHelp && (
        <div style={s.helpBox}>
          <p className="small" style={{ fontWeight: 600, marginBottom: 8 }}>How to get email headers:</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              ['Gmail', 'Open email → Click three dots → "Show original" → Copy all text'],
              ['Outlook', 'Right-click email → "View source" → Copy all text'],
              ['Apple Mail', 'View → Message → Raw Source → Copy all text'],
              ['Other clients', 'Look for "View source" or "Show headers" option'],
            ].map(([client, desc]) => (
              <li key={client} className="small" style={{ display: 'flex', gap: 6 }}>
                <span style={{ color: 'var(--primary)' }}>•</span>
                <span><strong>{client}:</strong> {desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={s.card}>
        <label style={s.label}>Paste email headers here:</label>
        <textarea
          ref={textareaRef}
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          rows={12}
          style={s.textarea}
          placeholder={`From: sender@example.com\nTo: recipient@example.com\nSubject: Test Email\nDate: Mon, 1 Jan 2024 12:00:00 +0000\nAuthentication-Results: ... (Auto-detects from clipboard on focus)`}
        />
        <div style={s.row}>
          <button
            onClick={handleAnalyze}
            disabled={!headerText.trim()}
            className="btn primary"
            style={{ opacity: !headerText.trim() ? 0.5 : 1, cursor: !headerText.trim() ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}
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
            className="btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            title="Paste from clipboard"
          >
            <Download size={14} /> Paste
          </button>
          <button
            onClick={handleClear}
            disabled={!headerText && !result}
            className="btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: (!headerText && !result) ? 0.5 : 1, cursor: (!headerText && !result) ? 'not-allowed' : 'pointer' }}
          >
            <XCircle size={14} /> Clear
          </button>
          <span style={s.hint}>Ctrl+Enter to analyze</span>
        </div>
      </div>

      {result && (
        <div style={s.resultCard(riskColor)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            {result.isSuspicious
              ? <AlertTriangle size={28} style={{ color: riskColor, flexShrink: 0 }} />
              : <ShieldCheck size={28} style={{ color: '#22c55e', flexShrink: 0 }} />}
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: riskColor }}>
                {result.isSuspicious
                  ? result.riskScore >= 70 ? '🚨 CRITICAL RISK' : '⚠️ HIGH RISK'
                  : '✓ Low Risk'}
              </p>
              <p className="small" style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Risk Score: <strong>{result.riskScore}%</strong> ({riskLevel})
              </p>
            </div>
          </div>

          {result.issues.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p className="small" style={{ fontWeight: 600, marginBottom: 6 }}>Detected Issues:</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {result.issues.map((issue: string, i: number) => (
                  <li key={i} className="small" style={{ display: 'flex', gap: 6 }}>
                    <span style={{ color: '#ef4444' }}>•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={s.subCard}>
            <p className="small" style={{ fontWeight: 600, marginBottom: 6 }}>Header Information:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {result.headerInfo.from && (
                <p className="small" style={{ margin: 0 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>From:</span>{' '}
                  <strong>{result.headerInfo.from}</strong>
                </p>
              )}
              {result.headerInfo.spf && (
                <p className="small" style={{ margin: 0 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>SPF:</span>{' '}
                  <strong style={{ color: result.headerInfo.spf === 'pass' ? '#22c55e' : '#ef4444' }}>
                    {result.headerInfo.spf.toUpperCase()}
                  </strong>
                </p>
              )}
              {result.headerInfo.dkim && (
                <p className="small" style={{ margin: 0 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>DKIM:</span>{' '}
                  <strong style={{ color: result.headerInfo.dkim === 'pass' ? '#22c55e' : '#ef4444' }}>
                    {result.headerInfo.dkim.toUpperCase()}
                  </strong>
                </p>
              )}
              {result.headerInfo.dmarc && (
                <p className="small" style={{ margin: 0 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>DMARC:</span>{' '}
                  <strong style={{ color: result.headerInfo.dmarc === 'pass' ? '#22c55e' : '#ef4444' }}>
                    {result.headerInfo.dmarc.toUpperCase()}
                  </strong>
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="small" style={{ fontWeight: 600, marginBottom: 6 }}>Recommendations:</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {result.recommendations.map((rec: string, i: number) => (
                <li key={i} className="small">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div style={s.eduBox}>
        <p className="small" style={{ fontWeight: 600, marginBottom: 8 }}>💡 What to look for:</p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[
            'SPF, DKIM, and DMARC authentication failures',
            'Mismatched From and Reply-To domains',
            'Suspicious or typosquatting domains',
            'Invalid or future dates',
            'Missing standard email headers',
          ].map((item) => (
            <li key={item} className="small" style={{ color: 'var(--text-secondary)' }}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmailHeaderAnalyzer;
