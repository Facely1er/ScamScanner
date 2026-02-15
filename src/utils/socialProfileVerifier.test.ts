import { describe, it, expect } from 'vitest';
import { analyzeSocialProfile, getProfileRiskLevel } from './socialProfileVerifier';

describe('analyzeSocialProfile', () => {
  it('returns low risk for normal profile', () => {
    const result = analyzeSocialProfile({
      username: 'johndoe',
      displayName: 'John Doe',
      bio: 'Software developer from NYC. Love hiking and coffee.',
      accountAge: '2 years',
      postCount: 150,
      followerCount: 340,
      followingCount: 220,
      verified: false,
    });
    expect(result.riskScore).toBeLessThan(45);
    expect(result.isSuspicious).toBe(false);
  });

  it('flags missing username', () => {
    const result = analyzeSocialProfile({ username: '' });
    expect(result.issues.some(i => i.includes('Username'))).toBe(true);
    expect(result.riskScore).toBeGreaterThanOrEqual(15);
  });

  it('flags generic/auto-generated username', () => {
    const result = analyzeSocialProfile({ username: 'user12345' });
    expect(result.patterns.genericUsername).toBe(true);
  });

  it('flags empty/short bio', () => {
    const result = analyzeSocialProfile({ username: 'test', bio: 'hi' });
    expect(result.patterns.emptyBio).toBe(true);
  });

  it('flags zero posts', () => {
    const result = analyzeSocialProfile({ username: 'test', postCount: 0 });
    expect(result.issues.some(i => i.includes('No posts'))).toBe(true);
  });

  it('flags suspicious follower ratio (followers but zero following)', () => {
    const result = analyzeSocialProfile({
      username: 'test',
      followerCount: 500,
      followingCount: 0,
    });
    expect(result.patterns.suspiciousRatio).toBe(true);
  });

  it('flags suspicious follower ratio (many following, zero followers)', () => {
    const result = analyzeSocialProfile({
      username: 'test',
      followerCount: 0,
      followingCount: 500,
    });
    expect(result.patterns.suspiciousRatio).toBe(true);
  });

  it('flags scam keywords in bio', () => {
    const result = analyzeSocialProfile({
      username: 'test',
      bio: 'DM me for crypto investment airdrop',
    });
    expect(result.patterns.suspiciousContent).toBe(true);
  });

  it('flags very new accounts', () => {
    const result = analyzeSocialProfile({
      username: 'test',
      accountAge: 'today',
    });
    expect(result.patterns.newAccount).toBe(true);
  });

  it('reduces score for verified accounts', () => {
    const unverified = analyzeSocialProfile({ username: 'user12345', verified: false });
    const verified = analyzeSocialProfile({ username: 'user12345', verified: true });
    expect(verified.riskScore).toBeLessThan(unverified.riskScore);
  });

  it('caps score at 100', () => {
    const result = analyzeSocialProfile({
      username: 'support999',
      bio: 'crypto giveaway airdrop dm me whatsapp',
      accountAge: 'today',
      postCount: 0,
      followerCount: 0,
      followingCount: 500,
    });
    expect(result.riskScore).toBeLessThanOrEqual(100);
  });

  it('always returns recommendations', () => {
    const result = analyzeSocialProfile({ username: 'test' });
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});

describe('getProfileRiskLevel', () => {
  it('returns low for score < 35', () => {
    expect(getProfileRiskLevel(20)).toBe('low');
  });

  it('returns medium for score 35-59', () => {
    expect(getProfileRiskLevel(40)).toBe('medium');
  });

  it('returns high for score >= 60', () => {
    expect(getProfileRiskLevel(80)).toBe('high');
  });
});
