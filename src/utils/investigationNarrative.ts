import { ScanSession, ThreatCategory, RiskLevel } from '../types/scan';

const THREAT_LABELS: Record<ThreatCategory, string> = {
  phishing: 'phishing attack',
  romance_scam: 'romance scam',
  investment_fraud: 'investment fraud',
  impersonation: 'brand or identity impersonation',
  malware: 'malware delivery attempt',
  identity_theft: 'identity theft attempt',
  unknown: 'suspicious communication',
};

const ORIGIN_LABELS: Record<string, string> = {
  email: 'email',
  social_media: 'social media message',
  direct_message: 'direct message',
  sms: 'SMS message',
  unknown: 'communication',
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function evidenceLabel(type: string) {
  switch (type) {
    case 'message': return 'message content';
    case 'email': return 'email headers';
    case 'image': return 'image metadata';
    case 'profile': return 'sender profile';
    default: return type;
  }
}

function riskAdverb(level: RiskLevel) {
  if (level === 'high') return 'highly suspicious';
  if (level === 'medium') return 'moderately suspicious';
  return 'low-risk';
}

export interface InvestigationNarrative {
  summary: string;
  findings: string;
  recommendation: string;
  confidence: string;
}

export function generateNarrative(session: ScanSession): InvestigationNarrative {
  const { context, evidence, patternMatches, crossReferences, overallRiskScore, overallRiskLevel, threatCategory, confidence, nextSteps } = session;

  const originLabel = ORIGIN_LABELS[context.origin] ?? 'communication';
  const threatLabel = THREAT_LABELS[threatCategory] ?? 'suspicious communication';
  const topPattern = patternMatches[0];
  const evidenceCount = evidence.length;
  const senderFragment = context.senderName ? ` from "${context.senderName}"` : '';
  const dateFragment = context.receivedDate ? ` received on ${context.receivedDate}` : '';
  const actionFragment = context.requestedAction ? ` requesting "${context.requestedAction}"` : '';

  // — Summary paragraph —
  let summary = '';
  if (overallRiskLevel === 'high') {
    summary = `This investigation analyzed a ${originLabel}${senderFragment}${dateFragment}${actionFragment}. `;
    summary += `Based on ${evidenceCount} evidence source${evidenceCount !== 1 ? 's' : ''}, the analysis identified strong indicators consistent with a ${threatLabel}. `;
    summary += `The overall risk score is ${overallRiskScore}/100 with ${Math.round(confidence * 100)}% confidence. `;
    summary += `This communication should be treated as malicious until proven otherwise.`;
  } else if (overallRiskLevel === 'medium') {
    summary = `This investigation analyzed a ${originLabel}${senderFragment}${dateFragment}${actionFragment}. `;
    summary += `Analysis of ${evidenceCount} evidence source${evidenceCount !== 1 ? 's' : ''} revealed concerning patterns that warrant caution. `;
    summary += `The overall risk score is ${overallRiskScore}/100 with ${Math.round(confidence * 100)}% confidence. `;
    summary += `While not definitively malicious, independent verification is strongly advised before taking any action.`;
  } else {
    summary = `This investigation analyzed a ${originLabel}${senderFragment}${dateFragment}${actionFragment}. `;
    summary += `Analysis of ${evidenceCount} evidence source${evidenceCount !== 1 ? 's' : ''} found limited indicators of fraud or deception. `;
    summary += `The overall risk score is ${overallRiskScore}/100 with ${Math.round(confidence * 100)}% confidence. `;
    summary += `Standard precautions are still recommended when responding to unsolicited communications.`;
  }

  // — Findings paragraph —
  let findings = '';
  const evidenceSentences = evidence.map(e => {
    const sigCount = e.signals.length;
    const sigFragment = sigCount > 0
      ? ` (${sigCount} indicator${sigCount !== 1 ? 's' : ''} detected)`
      : ' (no indicators detected)';
    return `${capitalize(evidenceLabel(e.type))} was assessed as ${riskAdverb(e.riskLevel)}${sigFragment}`;
  });

  if (evidenceSentences.length > 0) {
    findings = evidenceSentences.join('. ') + '. ';
  }

  if (topPattern) {
    findings += `The most significant pattern detected was "${topPattern.patternName}" with ${Math.round(topPattern.confidence * 100)}% confidence — ${topPattern.description}. `;
  }

  if (crossReferences.length > 0) {
    const crossRefSentences = crossReferences.map(r => r.description);
    findings += `Cross-signal analysis further revealed: ${crossRefSentences.join('; ')}.`;
  }

  if (!findings) {
    findings = 'Insufficient evidence was provided to identify specific patterns. Additional evidence sources would increase assessment accuracy.';
  }

  // — Recommendation paragraph —
  let recommendation = '';
  if (nextSteps.length > 0) {
    recommendation = `Recommended actions: ${nextSteps.join('. ')}.`;
  } else if (overallRiskLevel === 'high') {
    recommendation = 'Do not proceed with any actions requested in this communication. Block and report the sender through the appropriate platform.';
  } else if (overallRiskLevel === 'medium') {
    recommendation = 'Verify the sender\'s identity through an independent channel before taking any action. Do not click links or provide personal information.';
  } else {
    recommendation = 'Exercise standard caution. Verify important requests through known, trusted channels before responding.';
  }

  // — Confidence note —
  let confidenceNote = '';
  const pct = Math.round(confidence * 100);
  if (evidenceCount < 2) {
    confidenceNote = `Assessment confidence is ${pct}%. Providing additional evidence types (email headers, sender profile, images) would significantly improve accuracy.`;
  } else if (pct >= 70) {
    confidenceNote = `Assessment confidence is ${pct}%, based on corroborating signals across multiple evidence sources.`;
  } else {
    confidenceNote = `Assessment confidence is ${pct}%. Results should be considered alongside your own judgment and independent verification.`;
  }

  return {
    summary,
    findings,
    recommendation,
    confidence: confidenceNote,
  };
}
