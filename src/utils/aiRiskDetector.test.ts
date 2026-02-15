import { describe, it, expect } from 'vitest';
import { analyzeMessageForPhishingRisk } from './aiRiskDetector';

describe('analyzeMessageForPhishingRisk', () => {
  it('returns low risk for benign text', () => {
    const result = analyzeMessageForPhishingRisk('Hey, want to grab lunch tomorrow?');
    expect(result.riskScore).toBe(0);
    expect(result.isPotentialThreat).toBe(false);
    expect(result.reasons).toHaveLength(0);
  });

  it('detects urgency language', () => {
    const result = analyzeMessageForPhishingRisk('Act now! Your offer expires immediately.');
    expect(result.reasons.some(r => r.includes('urgency'))).toBe(true);
    expect(result.riskScore).toBeGreaterThanOrEqual(20);
  });

  it('detects links and short URLs', () => {
    const result = analyzeMessageForPhishingRisk('Check this out: https://example.com/verify');
    expect(result.reasons.some(r => r.includes('link'))).toBe(true);
    expect(result.riskScore).toBeGreaterThanOrEqual(25);
  });

  it('detects credential requests', () => {
    const result = analyzeMessageForPhishingRisk('Please verify your account password now.');
    expect(result.reasons.some(r => r.includes('credential') || r.includes('verification'))).toBe(true);
  });

  it('detects reward promises', () => {
    const result = analyzeMessageForPhishingRisk('Congratulations! You are the winner of a free prize.');
    expect(result.reasons.some(r => r.includes('reward'))).toBe(true);
  });

  it('detects impersonation patterns', () => {
    const result = analyzeMessageForPhishingRisk('Microsoft security team has detected unusual activity.');
    expect(result.reasons.some(r => r.includes('brand') || r.includes('impersonation'))).toBe(true);
  });

  it('detects generic mass-generated phrasing', () => {
    const result = analyzeMessageForPhishingRisk('Dear customer, we noticed unusual activity on your account. Your account will be suspended.');
    expect(result.reasons.some(r => r.includes('mass-generated') || r.includes('Generic'))).toBe(true);
  });

  it('caps score at 100', () => {
    const result = analyzeMessageForPhishingRisk(
      'Dear customer, act now! Verify your account password immediately. You won a free gift. Click https://bit.ly/verify. Microsoft security team.'
    );
    expect(result.riskScore).toBeLessThanOrEqual(100);
  });

  it('flags high-risk messages as potential threats (score >= 45)', () => {
    const result = analyzeMessageForPhishingRisk(
      'URGENT! Verify your account password now at https://example.com before suspension.'
    );
    expect(result.isPotentialThreat).toBe(true);
    expect(result.riskScore).toBeGreaterThanOrEqual(45);
  });

  it('handles empty input', () => {
    const result = analyzeMessageForPhishingRisk('');
    expect(result.riskScore).toBe(0);
    expect(result.isPotentialThreat).toBe(false);
    expect(result.reasons).toHaveLength(0);
  });

  it('handles null-like input', () => {
    const result = analyzeMessageForPhishingRisk(undefined as any);
    expect(result.riskScore).toBe(0);
  });
});
