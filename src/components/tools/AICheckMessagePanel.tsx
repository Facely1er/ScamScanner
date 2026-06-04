import React, { useState, useEffect, useRef } from 'react';
import { Brain, AlertTriangle, ShieldCheck, XCircle, HelpCircle, Info, Download } from 'lucide-react';
import { analyzeMessageForPhishingRisk } from '../../utils/aiRiskDetector';
import { mapAIRiskToAlert } from '../../mappers/aiToCautionAlert';
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
    fontSize: 13,
    background: 'var(--bg)',
    color: 'var(--text)',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  row: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const, marginTop: 12 },
  hint: { fontSize: 12, color: 'var(--text-secondary)', marginLeft: 'auto' },
  resultCard: (color: string) => ({
    border: `2px solid ${color}`,
    borderRadius: 12,
    padding: '20px 24px',
    marginTop: 16,
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
    marginTop: 12,
  } as React.CSSProperties,
};

const AICheckMessagePanel: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{
    riskScore: number;
    reasons: string[];
    isPotentialThreat: boolean;
  } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addAlert = useCautionStore((st) => st.addAlert);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    const risk = analyzeMessageForPhishingRisk(text);
    setResult(risk);
    const id = `user-paste-${Date.now()}`;
    const cautionAlert = mapAIRiskToAlert(risk, { id }, 'user_paste');
    if (cautionAlert) addAlert(cautionAlert);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleClear = () => { setText(''); setResult(null); };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const handleFocus = async () => {
      if (text.trim()) return;
      try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText.length > 10 && clipboardText.length < 10000) setText(clipboardText);
      } catch {}
    };
    textarea.addEventListener('focus', handleFocus);
    return () => textarea.removeEventListener('focus', handleFocus);
  }, [text]);

  const disabled = !text.trim();
  const charCount = text.length;

  const riskColor = result
    ? result.isPotentialThreat
      ? result.riskScore >= 80 ? 'var(--danger, #ef4444)' : '#f97316'
      : '#22c55e'
    : 'var(--border)';

  return (
    <div style={s.wrap}>
      {/* Description + privacy notice */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <p className="p" style={{ margin: 0 }}>
            Paste suspicious messages to surface common phishing, scam, and manipulation patterns.
          </p>
          <button
            onClick={() => setShowHelp(!showHelp)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text-secondary)', flexShrink: 0, marginLeft: 8 }}
            title="Show help"
          >
            <HelpCircle size={20} />
          </button>
        </div>
        <div style={s.infoBox}>
          <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
          <p className="small" style={{ margin: 0 }}>
            <strong>Privacy First:</strong> All analysis runs on your device. Text is not uploaded.
          </p>
        </div>
      </div>

      {showHelp && (
        <div style={s.helpBox}>
          <p className="small" style={{ fontWeight: 600, marginBottom: 8 }}>What to look for in suspicious messages:</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              ['Urgency tactics', '"Act now!", "Expires today!", "Immediate action required"'],
              ['Account threats', '"Your account will be suspended", "Unusual activity detected"'],
              ['Pressure to click', '"Click here to verify", "Tap now to confirm"'],
              ['Sensitive info requests', 'Asking for passwords, SSN, credit card numbers'],
              ['Generic greetings', '"Dear customer" instead of your actual name'],
            ].map(([label, desc]) => (
              <li key={label} className="small" style={{ display: 'flex', gap: 6 }}>
                <span style={{ color: '#ef4444' }}>•</span>
                <span><strong>{label}:</strong> {desc}</span>
              </li>
            ))}
          </ul>
          <p className="small" style={{ marginTop: 12, marginBottom: 0, color: 'var(--text-secondary)' }}>
            Legitimate companies rarely create artificial urgency or ask for sensitive information via email/text.
          </p>
        </div>
      )}

      <div style={s.card}>
        <label style={s.label}>Paste message content here:</label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          rows={8}
          style={s.textarea}
          placeholder="Example: URGENT! Your account will be suspended within 24 hours... (Auto-pastes from clipboard on focus)"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span className="small" style={{ color: 'var(--text-secondary)' }}>{charCount} character{charCount !== 1 ? 's' : ''}</span>
          {charCount > 1000 && (
            <span className="small" style={{ color: '#f97316' }}>Long messages may have more false positives</span>
          )}
        </div>
        <div style={s.row}>
          <button onClick={handleAnalyze} disabled={disabled} className={`btn primary${disabled ? ' disabled' : ''}`} style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Brain size={14} /> Analyze for Risks
          </button>
          <button
            onClick={async () => {
              try {
                const t = await navigator.clipboard.readText();
                if (t) setText(t);
              } catch { handleClear(); }
            }}
            className="btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            title="Paste from clipboard"
          >
            <Download size={14} /> Paste
          </button>
          <button onClick={handleClear} disabled={!text && !result} className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: (!text && !result) ? 0.5 : 1, cursor: (!text && !result) ? 'not-allowed' : 'pointer' }}>
            <XCircle size={14} /> Clear
          </button>
          <span style={s.hint}>Ctrl+Enter to analyze</span>
        </div>
      </div>

      {result && (
        <div style={s.resultCard(riskColor)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            {result.isPotentialThreat
              ? <AlertTriangle size={28} style={{ color: riskColor, flexShrink: 0 }} />
              : <ShieldCheck size={28} style={{ color: '#22c55e', flexShrink: 0 }} />}
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: riskColor }}>
                {result.isPotentialThreat
                  ? result.riskScore >= 80 ? '🚨 CRITICAL RISK' : '⚠️ HIGH RISK'
                  : '✓ Low Risk'}
              </p>
              <p className="small" style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Risk Score: <strong>{result.riskScore}%</strong>
              </p>
            </div>
          </div>

          {result.reasons.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p className="small" style={{ fontWeight: 600, marginBottom: 6 }}>Detected Patterns:</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {result.reasons.map((reason, i) => (
                  <li key={i} className="small" style={{ display: 'flex', gap: 6 }}>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={s.subCard}>
            {result.isPotentialThreat ? (
              <>
                <p className="small" style={{ fontWeight: 600, marginBottom: 6 }}>What you should do:</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {result.riskScore >= 80 ? (
                    <>
                      <li className="small">🚫 <strong>Do NOT click any links in this message</strong></li>
                      <li className="small">🚫 <strong>Do NOT provide any information</strong></li>
                      <li className="small">🗑️ Delete this message immediately</li>
                      <li className="small">✓ If you have an account with this service, visit their official website directly</li>
                      <li className="small">✓ Contact the company through official support channels to verify</li>
                    </>
                  ) : (
                    <>
                      <li className="small">⚠️ Do not click any links in this message</li>
                      <li className="small">✓ Visit the official website directly by typing the URL</li>
                      <li className="small">✓ Contact the service through official support channels</li>
                      <li className="small">✓ Verify if you actually have an account with this service</li>
                    </>
                  )}
                </ul>
              </>
            ) : (
              <p className="small" style={{ margin: 0 }}>
                While the risk appears low, always verify unexpected messages through official channels.
                When in doubt, contact the service directly using contact information from their official website.
              </p>
            )}
          </div>

          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <p className="small" style={{ margin: 0, color: 'var(--text-secondary)' }}>
              <strong>Disclaimer:</strong> This is an automated risk assessment based on common phishing and manipulation patterns.
              It is not perfect and should not be the only factor in your decision.
            </p>
          </div>
        </div>
      )}

      <div style={s.eduBox}>
        <p className="small" style={{ fontWeight: 600, marginBottom: 8 }}>💡 Remember: Legitimate services never...</p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[
            'Create artificial urgency or pressure you to act immediately',
            'Threaten account suspension without prior warning through official channels',
            'Ask for sensitive information (passwords, SSN, credit cards) via email or text',
            'Use generic greetings when they have your account information',
            'Send links that lead to suspicious or misspelled domains',
          ].map((item) => (
            <li key={item} className="small" style={{ color: 'var(--text-secondary)' }}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AICheckMessagePanel;
