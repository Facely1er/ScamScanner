import { ThreatCategory } from '../types/scan';

export interface ThreatPattern {
  id: string;
  name: string;
  category: ThreatCategory;
  description: string;
  signalTypes: string[];
  requiredSignals: number;
  correlationRules: CorrelationRule[];
  confidenceWeight: number;
}

export interface CorrelationRule {
  id: string;
  description: string;
  checkType: 'inconsistency' | 'correlation' | 'confirmation';
  evidenceTypes: string[];
  evaluate: (evidence: any[]) => { matches: boolean; confidence: number; description: string };
}

const urgencyPressureRule: CorrelationRule = {
  id: 'urgency_pressure',
  description: 'Time pressure combined with action request',
  checkType: 'correlation',
  evidenceTypes: ['message', 'email'],
  evaluate: (evidence) => {
    const messageEvidence = evidence.find(e => e.type === 'message' || e.type === 'email');
    if (!messageEvidence) return { matches: false, confidence: 0, description: '' };

    const hasUrgency = messageEvidence.signals?.some((s: any) =>
      s.description.toLowerCase().includes('urgency') ||
      s.description.toLowerCase().includes('time pressure')
    );

    const hasAction = messageEvidence.signals?.some((s: any) =>
      s.description.toLowerCase().includes('credentials') ||
      s.description.toLowerCase().includes('verification')
    );

    if (hasUrgency && hasAction) {
      return {
        matches: true,
        confidence: 0.8,
        description: 'Message uses time pressure to force quick action, common phishing tactic'
      };
    }
    return { matches: false, confidence: 0, description: '' };
  }
};

const profileMessageMismatchRule: CorrelationRule = {
  id: 'profile_message_mismatch',
  description: 'Sender profile quality vs message content',
  checkType: 'inconsistency',
  evidenceTypes: ['profile', 'message'],
  evaluate: (evidence) => {
    const profile = evidence.find(e => e.type === 'profile');
    const message = evidence.find(e => e.type === 'message');

    if (!profile || !message) return { matches: false, confidence: 0, description: '' };

    const profileRiskHigh = profile.riskLevel === 'high';
    const messageRiskHigh = message.riskLevel === 'high';

    if (profileRiskHigh && messageRiskHigh) {
      return {
        matches: true,
        confidence: 0.9,
        description: 'Both sender profile and message content show high-risk indicators'
      };
    }

    if (profileRiskHigh || messageRiskHigh) {
      return {
        matches: true,
        confidence: 0.6,
        description: 'Risk indicators in either sender profile or message content'
      };
    }

    return { matches: false, confidence: 0, description: '' };
  }
};

const emailSpoofingRule: CorrelationRule = {
  id: 'email_spoofing',
  description: 'Email authentication failures',
  checkType: 'correlation',
  evidenceTypes: ['email'],
  evaluate: (evidence) => {
    const email = evidence.find(e => e.type === 'email');
    if (!email) return { matches: false, confidence: 0, description: '' };

    const authFailures = email.signals?.filter((s: any) =>
      s.description.toLowerCase().includes('spf') ||
      s.description.toLowerCase().includes('dkim') ||
      s.description.toLowerCase().includes('dmarc')
    ).length || 0;

    if (authFailures >= 2) {
      return {
        matches: true,
        confidence: 0.85,
        description: 'Multiple email authentication failures suggest sender spoofing'
      };
    }

    return { matches: false, confidence: 0, description: '' };
  }
};

export const threatPatterns: ThreatPattern[] = [
  {
    id: 'phishing_classic',
    name: 'Classic Phishing Attack',
    category: 'phishing',
    description: 'Email or message requesting credentials with urgency and impersonation',
    signalTypes: ['urgency', 'credentials', 'impersonation', 'link'],
    requiredSignals: 3,
    correlationRules: [urgencyPressureRule, emailSpoofingRule],
    confidenceWeight: 0.9
  },
  {
    id: 'romance_scam_early',
    name: 'Romance Scam (Early Stage)',
    category: 'romance_scam',
    description: 'New profile with generic information showing interest',
    signalTypes: ['new_account', 'generic_username', 'empty_bio', 'suspicious_ratio'],
    requiredSignals: 2,
    correlationRules: [profileMessageMismatchRule],
    confidenceWeight: 0.7
  },
  {
    id: 'romance_scam_advanced',
    name: 'Romance Scam (Advanced Stage)',
    category: 'romance_scam',
    description: 'Request to move conversation off-platform with urgency',
    signalTypes: ['suspicious_content', 'urgency', 'off_platform'],
    requiredSignals: 2,
    correlationRules: [profileMessageMismatchRule, urgencyPressureRule],
    confidenceWeight: 0.85
  },
  {
    id: 'investment_fraud',
    name: 'Investment Fraud',
    category: 'investment_fraud',
    description: 'Promise of high returns with urgency and minimal details',
    signalTypes: ['reward', 'urgency', 'suspicious_content', 'generic'],
    requiredSignals: 3,
    correlationRules: [urgencyPressureRule, profileMessageMismatchRule],
    confidenceWeight: 0.8
  },
  {
    id: 'impersonation_brand',
    name: 'Brand Impersonation',
    category: 'impersonation',
    description: 'Impersonating known brand or service to request action',
    signalTypes: ['impersonation', 'credentials', 'urgency'],
    requiredSignals: 2,
    correlationRules: [urgencyPressureRule, emailSpoofingRule],
    confidenceWeight: 0.85
  },
  {
    id: 'suspicious_attachment',
    name: 'Suspicious Attachment',
    category: 'malware',
    description: 'Unusual file with urgency or reward promise',
    signalTypes: ['urgency', 'reward', 'uncommon_type'],
    requiredSignals: 2,
    correlationRules: [urgencyPressureRule],
    confidenceWeight: 0.75
  }
];

export function getPatternsByCategory(category: ThreatCategory): ThreatPattern[] {
  return threatPatterns.filter(p => p.category === category);
}

export function getPatternById(id: string): ThreatPattern | undefined {
  return threatPatterns.find(p => p.id === id);
}
