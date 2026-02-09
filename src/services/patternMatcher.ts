import { EvidenceItem, PatternMatch, CrossReference, ThreatCategory } from '../types/scan';
import { threatPatterns } from '../data/patternLibrary';

export function detectPatterns(evidence: EvidenceItem[]): PatternMatch[] {
  const matches: PatternMatch[] = [];

  for (const pattern of threatPatterns) {
    const allSignals = evidence.flatMap(e => e.signals);
    const matchedSignals = allSignals.filter(signal =>
      pattern.signalTypes.includes(signal.type)
    );

    if (matchedSignals.length >= pattern.requiredSignals) {
      const evidenceForRules = evidence.map(e => ({
        type: e.type,
        riskLevel: e.riskLevel,
        signals: e.signals
      }));

      let ruleConfidence = 0;
      let ruleMatches = 0;

      for (const rule of pattern.correlationRules) {
        const result = rule.evaluate(evidenceForRules);
        if (result.matches) {
          ruleConfidence += result.confidence;
          ruleMatches++;
        }
      }

      const avgRuleConfidence = ruleMatches > 0 ? ruleConfidence / ruleMatches : 0;
      const signalConfidence = Math.min(matchedSignals.length / pattern.signalTypes.length, 1);
      const overallConfidence = (avgRuleConfidence * 0.6 + signalConfidence * 0.4) * pattern.confidenceWeight;

      if (overallConfidence > 0.3) {
        matches.push({
          patternId: pattern.id,
          patternName: pattern.name,
          category: pattern.category,
          confidence: Math.round(overallConfidence * 100) / 100,
          matchedSignals: matchedSignals.map(s => s.id),
          description: pattern.description
        });
      }
    }
  }

  return matches.sort((a, b) => b.confidence - a.confidence);
}

export function findCrossReferences(evidence: EvidenceItem[]): CrossReference[] {
  const crossRefs: CrossReference[] = [];

  for (const pattern of threatPatterns) {
    for (const rule of pattern.correlationRules) {
      const relevantEvidence = evidence.filter(e =>
        rule.evidenceTypes.includes(e.type)
      );

      if (relevantEvidence.length >= 2) {
        const result = rule.evaluate(relevantEvidence);
        if (result.matches) {
          crossRefs.push({
            type: rule.checkType,
            evidenceIds: relevantEvidence.map(e => e.id),
            description: result.description,
            impactOnConfidence: result.confidence
          });
        }
      }
    }
  }

  const profileAndMessage = evidence.filter(e => e.type === 'profile' || e.type === 'message');
  if (profileAndMessage.length === 2) {
    const bothHighRisk = profileAndMessage.every(e => e.riskLevel === 'high');
    if (bothHighRisk) {
      crossRefs.push({
        type: 'correlation',
        evidenceIds: profileAndMessage.map(e => e.id),
        description: 'High-risk profile combined with high-risk message strongly indicates scam attempt',
        impactOnConfidence: 0.25
      });
    }
  }

  const emailAndMessage = evidence.filter(e => e.type === 'email' || e.type === 'message');
  if (emailAndMessage.length === 2) {
    const emailEvidence = emailAndMessage.find(e => e.type === 'email');
    const messageEvidence = emailAndMessage.find(e => e.type === 'message');

    if (emailEvidence && messageEvidence) {
      const hasAuthFailures = emailEvidence.signals.some(s =>
        s.type.includes('spf') || s.type.includes('dkim') || s.type.includes('dmarc')
      );
      const hasPhishingSignals = messageEvidence.signals.some(s =>
        s.type === 'credentials' || s.type === 'urgency'
      );

      if (hasAuthFailures && hasPhishingSignals) {
        crossRefs.push({
          type: 'correlation',
          evidenceIds: [emailEvidence.id, messageEvidence.id],
          description: 'Email authentication failures combined with phishing content strongly suggests attack',
          impactOnConfidence: 0.3
        });
      }
    }
  }

  return crossRefs;
}

export function calculateOverallRisk(
  evidence: EvidenceItem[],
  patterns: PatternMatch[],
  crossRefs: CrossReference[]
): { score: number; level: 'low' | 'medium' | 'high'; confidence: number } {
  if (evidence.length === 0) {
    return { score: 0, level: 'low', confidence: 0 };
  }

  const avgEvidenceScore = evidence.reduce((sum, e) => sum + e.riskScore, 0) / evidence.length;
  const maxPatternConfidence = patterns.length > 0
    ? Math.max(...patterns.map(p => p.confidence))
    : 0;

  const crossRefBoost = crossRefs.reduce((sum, ref) => sum + ref.impactOnConfidence, 0);
  const normalizedCrossRefBoost = Math.min(crossRefBoost, 0.5);

  const baseScore = avgEvidenceScore * 0.5 + maxPatternConfidence * 50 * 0.3;
  const finalScore = Math.min(100, baseScore + normalizedCrossRefBoost * 100 * 0.2);

  let level: 'low' | 'medium' | 'high';
  if (finalScore >= 60) level = 'high';
  else if (finalScore >= 35) level = 'medium';
  else level = 'low';

  const evidenceCount = evidence.length;
  const coverageBonus = Math.min(evidenceCount / 3, 1) * 0.3;
  const patternBonus = patterns.length > 0 ? 0.3 : 0;
  const crossRefBonus = crossRefs.length > 0 ? 0.2 : 0;

  const confidence = Math.min(
    0.2 + coverageBonus + patternBonus + crossRefBonus,
    0.95
  );

  return {
    score: Math.round(finalScore),
    level,
    confidence: Math.round(confidence * 100) / 100
  };
}

export function determineThreatCategory(patterns: PatternMatch[]): ThreatCategory {
  if (patterns.length === 0) return 'unknown';

  const categoryCounts: Partial<Record<ThreatCategory, number>> = {};
  patterns.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + p.confidence;
  });

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
  return topCategory ? (topCategory[0] as ThreatCategory) : 'unknown';
}
