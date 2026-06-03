import { analyzeMessageForPhishingRisk } from '../utils/aiRiskDetector';
import { analyzeEmailHeaders, getEmailRiskLevel } from '../utils/emailHeaderAnalyzer';
import { analyzeImageMetadata, getImageRiskLevel } from '../utils/imageMetadataAnalyzer';
import { analyzeSocialProfile, getProfileRiskLevel } from '../utils/socialProfileVerifier';
import { EvidenceItem, Signal, RiskLevel, EvidenceType } from '../types/scan';

function mapSeverityToRiskLevel(score: number, type: EvidenceType): RiskLevel {
  if (type === 'email') return getEmailRiskLevel(score);
  if (type === 'image') return getImageRiskLevel(score);
  if (type === 'profile') return getProfileRiskLevel(score);
  if (score >= 45) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

function scoreToSeverity(score: number): RiskLevel {
  if (score >= 20) return 'high';
  if (score >= 10) return 'medium';
  return 'low';
}

export async function analyzeMessage(text: string): Promise<EvidenceItem> {
  const analysis = analyzeMessageForPhishingRisk(text);
  const signals: Signal[] = [];

  analysis.reasons.forEach((reason, index) => {
    let score = 0;
    let type = 'generic';

    if (reason.includes('link')) {
      score = 25;
      type = 'link';
    } else if (reason.includes('urgency') || reason.includes('pressure')) {
      score = 20;
      type = 'urgency';
    } else if (reason.includes('reward') || reason.includes('benefit')) {
      score = 15;
      type = 'reward';
    } else if (reason.includes('credentials') || reason.includes('verification')) {
      score = 25;
      type = 'credentials';
    } else if (reason.includes('brand') || reason.includes('impersonation')) {
      score = 15;
      type = 'impersonation';
    } else if (reason.includes('generic') || reason.includes('mass-generated')) {
      score = 10;
      type = 'generic';
    }

    signals.push({
      id: `msg-signal-${index}`,
      type,
      severity: scoreToSeverity(score),
      score,
      description: reason,
      source: 'message'
    });
  });

  return {
    id: crypto.randomUUID(),
    type: 'message',
    analyzedAt: Date.now(),
    data: { text },
    signals,
    riskScore: analysis.riskScore,
    riskLevel: mapSeverityToRiskLevel(analysis.riskScore, 'message'),
    analysis
  };
}

export async function analyzeEmail(headerText: string): Promise<EvidenceItem> {
  const analysis = analyzeEmailHeaders(headerText);
  const signals: Signal[] = [];

  analysis.issues.forEach((issue, index) => {
    let score = 0;
    let type = 'generic';

    if (issue.includes('SPF')) {
      score = 25;
      type = 'spf_fail';
    } else if (issue.includes('DKIM')) {
      score = 20;
      type = 'dkim_fail';
    } else if (issue.includes('DMARC')) {
      score = 25;
      type = 'dmarc_fail';
    } else if (issue.includes('Reply-To')) {
      score = 10;
      type = 'reply_to';
    } else if (issue.includes('Received')) {
      score = 10;
      type = 'routing';
    } else {
      score = 10;
    }

    signals.push({
      id: `email-signal-${index}`,
      type,
      severity: scoreToSeverity(score),
      score,
      description: issue,
      source: 'email'
    });
  });

  return {
    id: crypto.randomUUID(),
    type: 'email',
    analyzedAt: Date.now(),
    data: { headerText },
    signals,
    riskScore: analysis.riskScore,
    riskLevel: analysis.isSuspicious ? 'high' : mapSeverityToRiskLevel(analysis.riskScore, 'email'),
    analysis
  };
}

export async function analyzeImage(file: File): Promise<EvidenceItem> {
  const analysis = await analyzeImageMetadata(file);
  const signals: Signal[] = [];

  analysis.issues.forEach((issue, index) => {
    let score = 0;
    let type = 'generic';

    if (issue.includes('Uncommon image type')) {
      score = 10;
      type = 'uncommon_type';
    } else if (issue.includes('Large file size')) {
      score = 10;
      type = 'large_file';
    } else if (issue.includes('generic')) {
      score = 5;
      type = 'generic_filename';
    } else {
      score = 5;
    }

    signals.push({
      id: `img-signal-${index}`,
      type,
      severity: scoreToSeverity(score),
      score,
      description: issue,
      source: 'image'
    });
  });

  return {
    id: crypto.randomUUID(),
    type: 'image',
    analyzedAt: Date.now(),
    data: { fileName: file.name, fileSize: file.size, fileType: file.type },
    signals,
    riskScore: analysis.riskScore,
    riskLevel: analysis.isSuspicious ? 'high' : mapSeverityToRiskLevel(analysis.riskScore, 'image'),
    analysis
  };
}

export async function analyzeProfile(profileData: any): Promise<EvidenceItem> {
  const analysis = analyzeSocialProfile(profileData);
  const signals: Signal[] = [];

  analysis.issues.forEach((issue, index) => {
    let score = 0;
    let type = 'generic';

    if (issue.includes('generic') || issue.includes('auto-generated')) {
      score = 10;
      type = 'generic_username';
    } else if (issue.includes('Bio')) {
      score = 10;
      type = 'empty_bio';
    } else if (issue.includes('No posts')) {
      score = 20;
      type = 'no_activity';
    } else if (issue.includes('Unusual follower')) {
      score = 10;
      type = 'suspicious_ratio';
    } else if (issue.includes('very new')) {
      score = 10;
      type = 'new_account';
    } else if (issue.includes('scam') || issue.includes('promo')) {
      score = 15;
      type = 'suspicious_content';
    } else {
      score = 10;
    }

    signals.push({
      id: `profile-signal-${index}`,
      type,
      severity: scoreToSeverity(score),
      score,
      description: issue,
      source: 'profile'
    });
  });

  return {
    id: crypto.randomUUID(),
    type: 'profile',
    analyzedAt: Date.now(),
    data: profileData,
    signals,
    riskScore: analysis.riskScore,
    riskLevel: analysis.isSuspicious ? 'high' : mapSeverityToRiskLevel(analysis.riskScore, 'profile'),
    analysis
  };
}
