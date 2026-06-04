import React, { useState, useEffect, useRef } from 'react';
import { Brain, AlertTriangle, ShieldCheck, XCircle, HelpCircle, Info, Download } from 'lucide-react';
import { analyzeMessageForPhishingRisk } from '../../utils/aiRiskDetector';
import { mapAIRiskToAlert } from '../../mappers/aiToCautionAlert';
import { useCautionStore } from '../../state/cautionStore';

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
    <div style={{ maxWidth: 768 }}>
      <div className="mb-20">
        <div className="d-flex items-start justify-between mb-12">
          <p className="p m-0">
            Paste suspicious messages to surface common phishing, scam, and manipulation patterns.
          </p>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="border-none bg-base cursor-pointer text-secondary-color flex-shrink-0 ml-8"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text-secondary)', flexShrink: 0, marginLeft: 8 }}
            title="Show help"
          >
            <HelpCircle size={20} />
          </button>
        </div>
        <div className="tool-info-box">
          <Info size={16} className="text-primary flex-shrink-0 mt-2" />
          <p className="small m-0">
            <strong>Privacy First:</strong> All analysis runs on your device. Text is not uploaded.
          </p>
        </div>
      </div>

      {showHelp && (
        <div className="tool-help-box">
          <p className="small font-semibold mb-8">What to look for in suspicious messages:</p>
          <ul className="tool-list-none-gap4">
            {[
              ['Urgency tactics', '"Act now!", "Expires today!", "Immediate action required"'],
              ['Account threats', '"Your account will be suspended", "Unusual activity detected"'],
              ['Pressure to click', '"Click here to verify", "Tap now to confirm"'],
              ['Sensitive info requests', 'Asking for passwords, SSN, credit card numbers'],
              ['Generic greetings', '"Dear customer" instead of your actual name'],
            ].map(([label, desc]) => (
              <li key={label} className="small d-flex gap-6">
                <span style={{ color: '#ef4444' }}>•</span>
                <span><strong>{label}:</strong> {desc}</span>
              </li>
            ))}
          </ul>
          <p className="small mt-12 mb-0 text-secondary-color">
            Legitimate companies rarely create artificial urgency or ask for sensitive information via email/text.
          </p>
        </div>
      )}

      <div className="tool-card">
        <label className="tool-label">Paste message content here:</label>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          rows={8}
          className="tool-textarea"
          placeholder="Example: URGENT! Your account will be suspended within 24 hours... (Auto-pastes from clipboard on focus)"
        />
        <div className="d-flex justify-between mt-6">
          <span className="small text-secondary-color">{charCount} character{charCount !== 1 ? 's' : ''}</span>
          {charCount > 1000 && (
            <span className="small" style={{ color: '#f97316' }}>Long messages may have more false positives</span>
          )}
        </div>
        <div className="tool-row">
          <button
            onClick={handleAnalyze}
            disabled={disabled}
            className="btn primary d-inline-flex items-center gap-6"
            style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
          >
            <Brain size={14} /> Analyze for Risks
          </button>
          <button
            onClick={async () => {
              try {
                const t = await navigator.clipboard.readText();
                if (t) setText(t);
              } catch { handleClear(); }
            }}
            className="btn d-inline-flex items-center gap-6"
            title="Paste from clipboard"
          >
            <Download size={14} /> Paste
          </button>
          <button
            onClick={handleClear}
            disabled={!text && !result}
            className="btn d-inline-flex items-center gap-6"
            style={{ opacity: (!text && !result) ? 0.5 : 1, cursor: (!text && !result) ? 'not-allowed' : 'pointer' }}
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
          marginTop: 16,
          background: 'var(--bg-secondary)',
        }}>
          <div className="tool-result-header">
            {result.isPotentialThreat
              ? <AlertTriangle size={28} style={{ color: riskColor, flexShrink: 0 }} />
              : <ShieldCheck size={28} style={{ color: '#22c55e', flexShrink: 0 }} />}
            <div>
              <p className="m-0 font-bold" style={{ fontSize: 16, color: riskColor }}>
                {result.isPotentialThreat
                  ? result.riskScore >= 80 ? '🚨 CRITICAL RISK' : '⚠️ HIGH RISK'
                  : '✓ Low Risk'}
              </p>
              <p className="small m-0 text-secondary-color">
                Risk Score: <strong>{result.riskScore}%</strong>
              </p>
            </div>
          </div>

          {result.reasons.length > 0 && (
            <div className="mb-12">
              <p className="small font-semibold mb-6">Detected Patterns:</p>
              <ul className="tool-list-none-gap4">
                {result.reasons.map((reason, i) => (
                  <li key={i} className="small d-flex gap-6">
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="tool-sub-card">
            {result.isPotentialThreat ? (
              <>
                <p className="small font-semibold mb-6">What you should do:</p>
                <ul className="tool-list-none" style={{ gap: 3 }}>
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
              <p className="small m-0">
                While the risk appears low, always verify unexpected messages through official channels.
                When in doubt, contact the service directly using contact information from their official website.
              </p>
            )}
          </div>

          <div className="mt-16 pt-12 border-top">
            <p className="small m-0 text-secondary-color">
              <strong>Disclaimer:</strong> This is an automated risk assessment based on common phishing and manipulation patterns.
              It is not perfect and should not be the only factor in your decision.
            </p>
          </div>
        </div>
      )}

      <div className="tool-edu-box">
        <p className="small font-semibold mb-8">💡 Remember: Legitimate services never...</p>
        <ul className="tool-list-none" style={{ gap: 3 }}>
          {[
            'Create artificial urgency or pressure you to act immediately',
            'Threaten account suspension without prior warning through official channels',
            'Ask for sensitive information (passwords, SSN, credit cards) via email or text',
            'Use generic greetings when they have your account information',
            'Send links that lead to suspicious or misspelled domains',
          ].map((item) => (
            <li key={item} className="small text-secondary-color">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AICheckMessagePanel;
