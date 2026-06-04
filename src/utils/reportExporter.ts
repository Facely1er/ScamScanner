import { ScanSession } from '../types/scan';
import { generateNarrative } from './investigationNarrative';

const RISK_COLORS: Record<string, string> = {
  high: '#dc2626',
  medium: '#ea580c',
  low: '#16a34a',
};

const THREAT_LABELS: Record<string, string> = {
  phishing: 'Phishing Attack',
  romance_scam: 'Romance Scam',
  investment_fraud: 'Investment Fraud',
  impersonation: 'Brand / Identity Impersonation',
  malware: 'Malware Delivery Attempt',
  identity_theft: 'Identity Theft Attempt',
  unknown: 'Unknown / Unclassified',
};

const ORIGIN_LABELS: Record<string, string> = {
  email: 'Email',
  social_media: 'Social Media',
  direct_message: 'Direct Message',
  sms: 'SMS',
  unknown: 'Unknown',
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function riskBadge(level: string) {
  const color = RISK_COLORS[level] ?? '#6b7280';
  const label = level.charAt(0).toUpperCase() + level.slice(1);
  return `<span style="background:${color};color:#fff;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:700;">${label}</span>`;
}

function buildHtml(session: ScanSession): string {
  const narrative = generateNarrative(session);
  const riskColor = RISK_COLORS[session.overallRiskLevel] ?? '#6b7280';
  const generatedAt = new Date().toLocaleString();
  const caseId = session.id.split('-')[0].toUpperCase();

  const signalRows = (signals: any[]) =>
    signals.map(s => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(s.description)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:center;">${riskBadge(s.severity)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;text-align:center;">${s.score}</td>
      </tr>`).join('');

  const evidenceSections = session.evidence.map(e => `
    <div style="margin-bottom:20px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <div style="background:#f9fafb;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e5e7eb;">
        <strong style="text-transform:capitalize;">${escapeHtml(e.type === 'email' ? 'Email Headers' : e.type === 'image' ? 'Image Metadata' : e.type === 'profile' ? 'Sender Profile' : 'Message Content')}</strong>
        ${riskBadge(e.riskLevel)}
      </div>
      ${e.signals.length > 0 ? `
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:6px 8px;text-align:left;border-bottom:1px solid #e5e7eb;">Signal</th>
            <th style="padding:6px 8px;text-align:center;border-bottom:1px solid #e5e7eb;width:90px;">Severity</th>
            <th style="padding:6px 8px;text-align:center;border-bottom:1px solid #e5e7eb;width:60px;">Score</th>
          </tr>
        </thead>
        <tbody>${signalRows(e.signals)}</tbody>
      </table>` : `<p style="padding:12px 16px;color:#6b7280;font-size:13px;margin:0;">No indicators detected in this evidence source.</p>`}
    </div>`).join('');

  const patternRows = session.patternMatches.map(p => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;font-weight:600;">${escapeHtml(p.patternName)}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(p.description)}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:700;">${Math.round(p.confidence * 100)}%</td>
    </tr>`).join('');

  const crossRefRows = session.crossReferences.map(r => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-transform:capitalize;">${escapeHtml(r.type)}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(r.description)}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;">${Math.round(r.impactOnConfidence * 100)}%</td>
    </tr>`).join('');

  const nextStepsList = session.nextSteps.map(s =>
    `<li style="margin-bottom:6px;">${escapeHtml(s)}</li>`).join('');

  const contextRows = [
    ['Origin', ORIGIN_LABELS[session.context.origin] ?? session.context.origin],
    session.context.senderName ? ['Sender Name', session.context.senderName] : null,
    session.context.relationship ? ['Relationship', session.context.relationship] : null,
    session.context.receivedDate ? ['Received Date', session.context.receivedDate] : null,
    session.context.requestedAction ? ['Requested Action', session.context.requestedAction] : null,
    session.context.additionalNotes ? ['Notes', session.context.additionalNotes] : null,
  ].filter((r): r is [string, string] => r !== null).map(([label, value]) =>
    `<tr><td style="padding:6px 8px;font-weight:600;color:#374151;width:160px;border-bottom:1px solid #e5e7eb;">${escapeHtml(label)}</td><td style="padding:6px 8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Scam Investigation Report — Case ${caseId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #111827; background: #fff; padding: 40px; max-width: 860px; margin: 0 auto; }
    h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
    h2 { font-size: 15px; font-weight: 700; margin-bottom: 12px; color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; }
    .section { margin-bottom: 28px; }
    .meta { color: #6b7280; font-size: 12px; margin-bottom: 24px; }
    .score-block { display: flex; gap: 32px; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px; }
    .score-item { text-align: center; }
    .score-label { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; margin-bottom: 4px; }
    .score-value { font-size: 28px; font-weight: 800; }
    .narrative p { line-height: 1.7; margin-bottom: 12px; color: #1f2937; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    @media print {
      body { padding: 20px; }
      @page { margin: 1.5cm; }
    }
  </style>
</head>
<body>

  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
    <div>
      <h1>Scam Investigation Report</h1>
      <div class="meta">Case ID: ${caseId} &nbsp;|&nbsp; Generated: ${escapeHtml(generatedAt)} &nbsp;|&nbsp; Threat: ${escapeHtml(THREAT_LABELS[session.threatCategory] ?? 'Unknown')}</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Overall Risk</div>
      <div style="font-size:32px;font-weight:900;color:${riskColor};">${session.overallRiskLevel.toUpperCase()}</div>
    </div>
  </div>

  <div class="score-block" style="background:${riskColor}12;border:1px solid ${riskColor}40;">
    <div class="score-item"><div class="score-label">Risk Score</div><div class="score-value" style="color:${riskColor};">${session.overallRiskScore}/100</div></div>
    <div class="score-item"><div class="score-label">Confidence</div><div class="score-value">${Math.round(session.confidence * 100)}%</div></div>
    <div class="score-item"><div class="score-label">Evidence Sources</div><div class="score-value">${session.evidence.length}</div></div>
    <div class="score-item"><div class="score-label">Patterns Matched</div><div class="score-value">${session.patternMatches.length}</div></div>
    <div class="score-item"><div class="score-label">Cross-References</div><div class="score-value">${session.crossReferences.length}</div></div>
  </div>

  <div class="section">
    <h2>Investigation Context</h2>
    <table><tbody>${contextRows}</tbody></table>
  </div>

  <div class="section narrative">
    <h2>Executive Summary</h2>
    <p>${escapeHtml(narrative.summary)}</p>
  </div>

  <div class="section narrative">
    <h2>Key Findings</h2>
    <p>${escapeHtml(narrative.findings)}</p>
  </div>

  <div class="section">
    <h2>Evidence Analysis</h2>
    ${evidenceSections || '<p style="color:#6b7280;">No evidence sources were analyzed.</p>'}
  </div>

  ${session.patternMatches.length > 0 ? `
  <div class="section">
    <h2>Pattern Matches</h2>
    <table>
      <thead><tr style="background:#f3f4f6;">
        <th style="padding:8px;text-align:left;border-bottom:1px solid #e5e7eb;">Pattern</th>
        <th style="padding:8px;text-align:left;border-bottom:1px solid #e5e7eb;">Description</th>
        <th style="padding:8px;text-align:center;border-bottom:1px solid #e5e7eb;width:80px;">Confidence</th>
      </tr></thead>
      <tbody>${patternRows}</tbody>
    </table>
  </div>` : ''}

  ${session.crossReferences.length > 0 ? `
  <div class="section">
    <h2>Cross-Signal Correlations</h2>
    <table>
      <thead><tr style="background:#f3f4f6;">
        <th style="padding:8px;text-align:left;border-bottom:1px solid #e5e7eb;width:100px;">Type</th>
        <th style="padding:8px;text-align:left;border-bottom:1px solid #e5e7eb;">Finding</th>
        <th style="padding:8px;text-align:center;border-bottom:1px solid #e5e7eb;width:80px;">Impact</th>
      </tr></thead>
      <tbody>${crossRefRows}</tbody>
    </table>
  </div>` : ''}

  <div class="section narrative">
    <h2>Recommended Actions</h2>
    <ul style="padding-left:20px;line-height:1.8;">${nextStepsList}</ul>
  </div>

  <div class="section narrative">
    <h2>Confidence Assessment</h2>
    <p>${escapeHtml(narrative.confidence)}</p>
  </div>

  <div style="margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;">
    This report was generated locally on your device by ScamScanner. No data was transmitted externally.
    This analysis is provided for informational purposes and does not constitute legal or professional advice.
    Case ID: ${caseId} &nbsp;|&nbsp; ${escapeHtml(generatedAt)}
  </div>

</body>
</html>`;
}

export function downloadReport(session: ScanSession) {
  const html = buildHtml(session);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const win = window.open(url, '_blank', 'width=900,height=700');
  if (win) {
    win.addEventListener('load', () => {
      win.focus();
      win.print();
    });
  }

  // clean up object URL after a delay
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
