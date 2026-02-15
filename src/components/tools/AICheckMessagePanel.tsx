// AI-Style Phishing Risk Analysis Tool
// User-facing component for analyzing suspicious messages

import React, { useState, useEffect, useRef } from 'react';
import { Brain, AlertTriangle, ShieldCheck, XCircle, HelpCircle, Info, Download } from 'lucide-react';
import { analyzeMessageForPhishingRisk } from '../../utils/aiRiskDetector';
import { mapAIRiskToAlert } from '../../mappers/aiToCautionAlert';
import { useCautionStore } from '../../state/cautionStore';
import { showToast } from '../common/Toast';

const AICheckMessagePanel: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{
    riskScore: number;
    reasons: string[];
    isPotentialThreat: boolean;
  } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const addAlert = useCautionStore((s) => s.addAlert);

  const handleAnalyze = () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    // Brief delay for visual feedback
    setTimeout(() => {
      const risk = analyzeMessageForPhishingRisk(text);
      setResult(risk);
      setIsAnalyzing(false);
      showToast(
        risk.isPotentialThreat ? `Risk detected: ${risk.riskScore}% threat score` : 'Analysis complete — low risk',
        risk.isPotentialThreat ? 'warning' : 'success'
      );

      // Create alert and add to store if threat detected
      const id = `user-paste-${Date.now()}`;
      const cautionAlert = mapAIRiskToAlert(risk, { id }, 'user_paste');
      if (cautionAlert) {
        addAlert(cautionAlert);
      }
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
  };

  const disabled = !text.trim();
  const charCount = text.length;

  // Free preview (description + privacy notice)
  const freePreview = (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 16 }}>
        <p className="p" style={{ margin: 0 }}>
          Paste suspicious messages to surface common phishing, scam, and manipulation patterns.
        </p>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="btn"
          title="Show help"
          style={{ minWidth: 'auto', padding: '10px' }}
        >
          <HelpCircle size={20} />
        </button>
      </div>

      <div className="info-box primary" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
          <Info size={20} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <p className="small" style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Privacy First:</strong>{' '}
              All analysis runs on your device. Text is not uploaded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Locked content (actual tool)
  const lockedContent = (
    <>

      {/* Help Section */}
      {showHelp && (
        <div className="card" style={{ marginBottom: 28, backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--border)' }}>
          <h3 className="h3" style={{ marginBottom: 16 }}>
            What to look for in suspicious messages:
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <li style={{ display: 'flex', alignItems: 'start', gap: 10 }}>
              <span style={{ color: 'var(--error)', fontSize: 18 }}>•</span>
              <span className="small" style={{ lineHeight: 1.7 }}><strong>Urgency tactics:</strong> &quot;Act now!&quot;, &quot;Expires today!&quot;, &quot;Immediate action required&quot;</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: 10 }}>
              <span style={{ color: 'var(--error)', fontSize: 18 }}>•</span>
              <span className="small" style={{ lineHeight: 1.7 }}><strong>Account threats:</strong> &quot;Your account will be suspended&quot;, &quot;Unusual activity detected&quot;</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: 10 }}>
              <span style={{ color: 'var(--error)', fontSize: 18 }}>•</span>
              <span className="small" style={{ lineHeight: 1.7 }}><strong>Pressure to click:</strong> &quot;Click here to verify&quot;, &quot;Tap now to confirm&quot;</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: 10 }}>
              <span style={{ color: 'var(--error)', fontSize: 18 }}>•</span>
              <span className="small" style={{ lineHeight: 1.7 }}><strong>Sensitive info requests:</strong> Asking for passwords, SSN, credit card numbers</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: 10 }}>
              <span style={{ color: 'var(--error)', fontSize: 18 }}>•</span>
              <span className="small" style={{ lineHeight: 1.7 }}><strong>Generic greetings:</strong> &quot;Dear customer&quot; instead of your actual name</span>
            </li>
          </ul>
          <p className="small" style={{ marginTop: 20, opacity: 0.7, lineHeight: 1.7 }}>
            Remember: Legitimate companies rarely create artificial urgency or ask for sensitive information via email/text.
          </p>
        </div>
      )}

      {/* Main Input Area */}
      <div className="card" style={{ padding: 28 }}>
        <div>
          <label className="form-label" style={{ marginBottom: 8 }}>
            Paste message content here:
          </label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            rows={8}
            className="input"
            style={{ fontFamily: 'inherit', resize: 'vertical', minHeight: 160 }}
            placeholder="Example: URGENT! Your account will be suspended within 24 hours. Click here to verify your identity immediately..."
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span className="small" style={{ opacity: 0.7 }}>
              {charCount} character{charCount !== 1 ? 's' : ''}
            </span>
            {charCount > 1000 && (
              <span className="small" style={{ color: 'var(--warning)' }}>
                Long messages may have more false positives
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 20 }}>
          <button
            onClick={handleAnalyze}
            disabled={disabled || isAnalyzing}
            className="btn primary"
            style={{ padding: '12px 22px' }}
          >
            {isAnalyzing ? <span className="spinner" style={{ marginRight: 8 }} /> : <Brain size={18} />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze for Risks'}
          </button>
          
          <button
            onClick={async () => {
              try {
                const clipboardText = await navigator.clipboard.readText();
                if (clipboardText) {
                  setText(clipboardText);
                }
              } catch (err) {
                handleClear();
              }
            }}
            className="btn"
            title="Paste from clipboard"
          >
            <Download size={18} />
            Paste
          </button>
          
          <button
            onClick={handleClear}
            disabled={!text && !result}
            className="btn"
          >
            <XCircle size={18} />
            Clear
          </button>
          <span className="small" style={{ opacity: 0.6, marginLeft: 'auto' }}>
            Ctrl+Enter to analyze
          </span>
        </div>
      </div>

      {/* Results Display */}
      <div aria-live="polite" aria-atomic="true">
      {result && (
        <div style={{ marginTop: 24 }}>
          <div
            className="card"
            style={{
              border: result.isPotentialThreat
                ? result.riskScore >= 80
                  ? '2px solid var(--error)'
                  : '2px solid var(--warning)'
                : '2px solid var(--success)',
              backgroundColor: result.isPotentialThreat
                ? result.riskScore >= 80
                  ? 'rgba(239,68,68,0.08)'
                  : 'rgba(245,158,11,0.08)'
                : 'rgba(16,185,129,0.08)',
              padding: 28
            }}
          >
            {/* Risk Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 14 }}>
              {result.isPotentialThreat ? (
                <AlertTriangle 
                  size={32} 
                  style={{ 
                    color: result.riskScore >= 80 ? 'var(--error)' : 'var(--warning)',
                    flexShrink: 0
                  }} 
                />
              ) : (
                <ShieldCheck size={32} style={{ color: 'var(--success)', flexShrink: 0 }} />
              )}
              <div>
                <h3 className="h3" style={{ margin: 0, marginBottom: 4 }}>
                  {result.isPotentialThreat ? (
                    <span style={{ color: result.riskScore >= 80 ? 'var(--error)' : 'var(--warning)' }}>
                      {result.riskScore >= 80 ? '🚨 CRITICAL RISK' : '⚠️ HIGH RISK'}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--success)' }}>✓ Low Risk</span>
                  )}
                </h3>
                <p className="small" style={{ margin: 0 }}>
                  Risk Score: <strong>{result.riskScore}%</strong>
                </p>
              </div>
            </div>

            {/* Detected Patterns */}
            {result.reasons.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h4 className="h3" style={{ fontSize: 16, marginBottom: 12 }}>
                  Detected Patterns:
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.reasons.map((reason, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'start', gap: 10 }}>
                      <span style={{ color: 'var(--error)', fontWeight: 'bold', fontSize: 18 }}>•</span>
                      <span className="small" style={{ flex: 1, lineHeight: 1.6 }}>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {result.isPotentialThreat ? (
              <div className="notice" style={{ marginTop: 20, padding: 18 }}>
                <h4 className="h3" style={{ fontSize: 16, marginBottom: 12 }}>
                  What you should do:
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result.riskScore >= 80 ? (
                    <>
                      <li className="small" style={{ lineHeight: 1.6 }}>🚫 <strong>Do NOT click any links in this message</strong></li>
                      <li className="small" style={{ lineHeight: 1.6 }}>🚫 <strong>Do NOT provide any information</strong></li>
                      <li className="small" style={{ lineHeight: 1.6 }}>🗑️ Delete this message immediately</li>
                      <li className="small" style={{ lineHeight: 1.6 }}>✓ If you have an account with this service, visit their official website directly</li>
                      <li className="small" style={{ lineHeight: 1.6 }}>✓ Contact the company through official support channels to verify</li>
                    </>
                  ) : (
                    <>
                      <li className="small" style={{ lineHeight: 1.6 }}>⚠️ Do not click any links in this message</li>
                      <li className="small" style={{ lineHeight: 1.6 }}>✓ Visit the official website directly by typing the URL</li>
                      <li className="small" style={{ lineHeight: 1.6 }}>✓ Contact the service through official support channels</li>
                      <li className="small" style={{ lineHeight: 1.6 }}>✓ Verify if you actually have an account with this service</li>
                    </>
                  )}
                </ul>
              </div>
            ) : (
              <div className="notice" style={{ marginTop: 20, padding: 18 }}>
                <p className="small" style={{ margin: 0, lineHeight: 1.7 }}>
                  While the risk appears low, always verify unexpected messages through official channels. 
                  When in doubt, contact the service directly using contact information from their official website.
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <p className="small" style={{ margin: 0, opacity: 0.7, lineHeight: 1.6 }}>
                <strong>Disclaimer:</strong> This is an automated risk assessment based on common phishing and 
                manipulation patterns. It is not perfect and should not be the only factor in your decision. 
                When in doubt, always verify directly with the service through official channels.
              </p>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Educational Footer */}
      <div className="info-box primary" style={{ marginTop: 32, padding: 20 }}>
        <h3 className="h3" style={{ fontSize: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          💡 Remember: Legitimate services never...
        </h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20 }}>
          <li className="small" style={{ lineHeight: 1.7 }}>Create artificial urgency or pressure you to act immediately</li>
          <li className="small" style={{ lineHeight: 1.7 }}>Threaten account suspension without prior warning through official channels</li>
          <li className="small" style={{ lineHeight: 1.7 }}>Ask for sensitive information (passwords, SSN, credit cards) via email or text</li>
          <li className="small" style={{ lineHeight: 1.7 }}>Use generic greetings when they have your account information</li>
          <li className="small" style={{ lineHeight: 1.7 }}>Send links that lead to suspicious or misspelled domains</li>
        </ul>
      </div>
    </>
  );

  // Auto-paste from clipboard on focus
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleFocus = async () => {
      if (text.trim()) return; // Don't auto-paste if there's already text
      
      try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText.length > 10 && clipboardText.length < 10000) {
          setText(clipboardText);
        }
      } catch (err) {
        // Clipboard API not available or permission denied
      }
    };

    textarea.addEventListener('focus', handleFocus);
    return () => textarea.removeEventListener('focus', handleFocus);
  }, [text]);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {freePreview}
      {lockedContent}
    </div>
  );
};

export default AICheckMessagePanel;
