import { describe, it, expect } from 'vitest';
import { getImageRiskLevel } from './imageMetadataAnalyzer';

// Note: analyzeImageMetadata requires a File + browser Image API (DOM),
// so we test the pure scoring function here. Full E2E tests for the
// analyzer would need jsdom + canvas mocking.

describe('getImageRiskLevel', () => {
  it('returns low for score < 20', () => {
    expect(getImageRiskLevel(0)).toBe('low');
    expect(getImageRiskLevel(10)).toBe('low');
    expect(getImageRiskLevel(19)).toBe('low');
  });

  it('returns medium for score 20-44', () => {
    expect(getImageRiskLevel(20)).toBe('medium');
    expect(getImageRiskLevel(30)).toBe('medium');
    expect(getImageRiskLevel(44)).toBe('medium');
  });

  it('returns high for score >= 45', () => {
    expect(getImageRiskLevel(45)).toBe('high');
    expect(getImageRiskLevel(80)).toBe('high');
    expect(getImageRiskLevel(100)).toBe('high');
  });
});
