import { analyzeMessageForPhishingRisk } from '../utils/aiRiskDetector';
import { analyzeEmailHeaders, getEmailRiskLevel } from '../utils/emailHeaderAnalyzer';
import { analyzeImageMetadata, getImageRiskLevel } from '../utils/imageMetadataAnalyzer';
import { analyzeSocialProfile, getProfileRiskLevel } from '../utils/socialProfileVerifier';
import { analyzeVideoMetadata, getVideoRiskLevel } from '../utils/videoMetadataAnalyzer';
import { deepfakeDetector } from './deepfakeDetector';
import { isFeatureEnabledSync } from '../config/features';
import { EvidenceItem, Signal, RiskLevel, EvidenceType } from '../types/scan';

function mapSeverityToRiskLevel(score: number, type: EvidenceType): RiskLevel {
  if (type === 'email') return getEmailRiskLevel(score);
  if (type === 'image') return getImageRiskLevel(score);
  if (type === 'profile') return getProfileRiskLevel(score);
  if (type === 'video') return getVideoRiskLevel(score);
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

export async function analyzeVideo(
  file: File,
  options?: { enableDeepfake?: boolean }
): Promise<EvidenceItem> {
  // Always do basic metadata analysis
  const analysis = await analyzeVideoMetadata(file);
  const signals: Signal[] = [];

  // Add basic metadata signals
  analysis.issues.forEach((issue, index) => {
    let score = 0;
    let type = 'generic';

    if (issue.includes('Uncommon video format')) {
      score = 10;
      type = 'uncommon_format';
    } else if (issue.includes('Large file size')) {
      score = 10;
      type = 'large_file';
    } else if (issue.includes('generic')) {
      score = 5;
      type = 'generic_filename';
    } else if (issue.includes('short video') || issue.includes('long video')) {
      score = 5;
      type = 'unusual_duration';
    } else if (issue.includes('Deepfake detection')) {
      // Don't score this - it's just informational
      score = 0;
      type = 'info';
    } else {
      score = 5;
    }

    if (score > 0) {
      signals.push({
        id: `video-signal-${index}`,
        type,
        severity: scoreToSeverity(score),
        score,
        description: issue,
        source: 'video'
      });
    }
  });

  // Optional: Add deepfake detection if enabled
  let deepfakeResult = null;
  if (options?.enableDeepfake && isFeatureEnabledSync('DEEPFAKE_DETECTION')) {
    try {
      if (deepfakeDetector.isAvailable()) {
        deepfakeResult = await deepfakeDetector.detect(file);
        
        if (deepfakeResult.probFake !== undefined && !deepfakeResult.error) {
          const riskLevel = deepfakeResult.probFake >= 0.7 ? 'high' : 
                           deepfakeResult.probFake >= 0.4 ? 'medium' : 'low';
          
          signals.push({
            id: 'deepfake-detection',
            type: 'deepfake',
            severity: riskLevel,
            score: deepfakeResult.probFake * 100,
            description: `Deepfake probability: ${(deepfakeResult.probFake * 100).toFixed(1)}% (${deepfakeResult.label})`,
            source: 'video'
          });

          // Adjust risk score based on deepfake
          if (deepfakeResult.probFake > 0.5) {
            analysis.riskScore += 30;
          }
        }
      }
    } catch (error) {
      // Silently fail - don't break video analysis if deepfake fails
      console.warn('Deepfake detection failed:', error);
    }
  }

  return {
    id: crypto.randomUUID(),
    type: 'video',
    analyzedAt: Date.now(),
    data: {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      duration: analysis.metadata.duration,
      dimensions: analysis.metadata.dimensions,
      deepfake: deepfakeResult ? {
        probFake: deepfakeResult.probFake,
        confidence: deepfakeResult.confidence,
        label: deepfakeResult.label,
        provider: deepfakeResult.provider
      } : null
    },
    signals,
    riskScore: Math.min(100, analysis.riskScore),
    riskLevel: analysis.isSuspicious ? 'high' : mapSeverityToRiskLevel(analysis.riskScore, 'video'),
    analysis: {
      ...analysis,
      deepfake: deepfakeResult
    }
  };
}
