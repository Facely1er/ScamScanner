import { describe, it, expect } from 'vitest';
import { detectPatterns, findCrossReferences, calculateOverallRisk, determineThreatCategory } from './patternMatcher';
import type { EvidenceItem, Signal } from '../types/scan';

function makeSignal(overrides: Partial<Signal> = {}): Signal {
  return {
    id: 'sig-1',
    type: 'generic',
    severity: 'low',
    score: 10,
    description: 'test signal',
    source: 'message',
    ...overrides,
  };
}

function makeEvidence(overrides: Partial<EvidenceItem> = {}): EvidenceItem {
  return {
    id: 'ev-1',
    type: 'message',
    analyzedAt: Date.now(),
    data: {},
    signals: [],
    riskScore: 0,
    riskLevel: 'low',
    analysis: null,
    ...overrides,
  };
}

describe('detectPatterns', () => {
  it('returns empty for no evidence', () => {
    expect(detectPatterns([])).toEqual([]);
  });

  it('returns empty when signals do not meet required count', () => {
    const ev = makeEvidence({
      signals: [makeSignal({ type: 'urgency' })],
    });
    const patterns = detectPatterns([ev]);
    // phishing_classic requires 3 signals — 1 is not enough
    const phishing = patterns.find(p => p.patternId === 'phishing_classic');
    expect(phishing).toBeUndefined();
  });

  it('detects phishing pattern when enough signals present', () => {
    const ev = makeEvidence({
      signals: [
        makeSignal({ type: 'urgency', description: 'Uses urgency' }),
        makeSignal({ type: 'credentials', description: 'Requests credentials' }),
        makeSignal({ type: 'impersonation', description: 'Brand impersonation' }),
        makeSignal({ type: 'link', description: 'Contains link' }),
      ],
    });
    const patterns = detectPatterns([ev]);
    const phishing = patterns.find(p => p.patternId === 'phishing_classic');
    expect(phishing).toBeDefined();
    expect(phishing!.category).toBe('phishing');
  });

  it('sorts patterns by confidence descending', () => {
    const ev = makeEvidence({
      signals: [
        makeSignal({ type: 'urgency', description: 'urgency time pressure' }),
        makeSignal({ type: 'credentials', description: 'credentials verification' }),
        makeSignal({ type: 'impersonation', description: 'impersonation' }),
        makeSignal({ type: 'link', description: 'link' }),
        makeSignal({ type: 'reward', description: 'reward' }),
        makeSignal({ type: 'suspicious_content', description: 'suspicious' }),
        makeSignal({ type: 'generic', description: 'generic' }),
      ],
    });
    const patterns = detectPatterns([ev]);
    for (let i = 1; i < patterns.length; i++) {
      expect(patterns[i - 1].confidence).toBeGreaterThanOrEqual(patterns[i].confidence);
    }
  });
});

describe('calculateOverallRisk', () => {
  it('returns zero for empty evidence', () => {
    const { score, level, confidence } = calculateOverallRisk([], [], []);
    expect(score).toBe(0);
    expect(level).toBe('low');
    expect(confidence).toBe(0);
  });

  it('computes score from evidence', () => {
    const ev = makeEvidence({ riskScore: 60 });
    const { score } = calculateOverallRisk([ev], [], []);
    expect(score).toBeGreaterThan(0);
  });

  it('caps confidence at 0.95', () => {
    const evidence = [
      makeEvidence({ riskScore: 80, type: 'message' }),
      makeEvidence({ riskScore: 70, type: 'email', id: 'ev-2' }),
      makeEvidence({ riskScore: 60, type: 'profile', id: 'ev-3' }),
    ];
    const patterns = [{ patternId: 'p1', patternName: 'P', category: 'phishing' as const, confidence: 0.9, matchedSignals: [], description: '' }];
    const crossRefs = [{ type: 'correlation' as const, evidenceIds: ['ev-1', 'ev-2'], description: '', impactOnConfidence: 0.5 }];
    const { confidence } = calculateOverallRisk(evidence, patterns, crossRefs);
    expect(confidence).toBeLessThanOrEqual(0.95);
  });
});

describe('determineThreatCategory', () => {
  it('returns unknown for no patterns', () => {
    expect(determineThreatCategory([])).toBe('unknown');
  });

  it('returns highest-confidence category', () => {
    const patterns = [
      { patternId: 'a', patternName: 'A', category: 'phishing' as const, confidence: 0.9, matchedSignals: [], description: '' },
      { patternId: 'b', patternName: 'B', category: 'romance_scam' as const, confidence: 0.5, matchedSignals: [], description: '' },
    ];
    expect(determineThreatCategory(patterns)).toBe('phishing');
  });
});
