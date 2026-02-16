export type EvidenceType = 'message' | 'email' | 'image' | 'profile' | 'video';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ThreatCategory =
  | 'phishing'
  | 'romance_scam'
  | 'investment_fraud'
  | 'impersonation'
  | 'malware'
  | 'identity_theft'
  | 'unknown';

export type ContextOrigin = 'email' | 'social_media' | 'direct_message' | 'sms' | 'unknown';

export interface ScanContext {
  origin: ContextOrigin;
  senderName?: string;
  relationship?: string;
  receivedDate?: string;
  requestedAction?: string;
  additionalNotes?: string;
}

export interface Signal {
  id: string;
  type: string;
  severity: RiskLevel;
  score: number;
  description: string;
  source: EvidenceType;
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  analyzedAt: number;
  data: any;
  signals: Signal[];
  riskScore: number;
  riskLevel: RiskLevel;
  analysis: any;
}

export interface PatternMatch {
  patternId: string;
  patternName: string;
  category: ThreatCategory;
  confidence: number;
  matchedSignals: string[];
  description: string;
}

export interface CrossReference {
  type: 'inconsistency' | 'correlation' | 'confirmation';
  evidenceIds: string[];
  description: string;
  impactOnConfidence: number;
}

export interface ScanSession {
  id: string;
  createdAt: number;
  updatedAt: number;
  status: 'in_progress' | 'completed' | 'paused';
  context: ScanContext;
  evidence: EvidenceItem[];
  signals: Signal[];
  patternMatches: PatternMatch[];
  crossReferences: CrossReference[];
  overallRiskScore: number;
  overallRiskLevel: RiskLevel;
  threatCategory: ThreatCategory;
  confidence: number;
  nextSteps: string[];
  completionPercentage: number;
}

export interface WorkflowStep {
  id: string;
  type: EvidenceType;
  label: string;
  description: string;
  priority: number;
  completed: boolean;
  required: boolean;
}
