import { describe, it, expect } from 'vitest';
import { analyzeEmailHeaders, getEmailRiskLevel } from './emailHeaderAnalyzer';

describe('analyzeEmailHeaders', () => {
  it('returns low risk for clean headers', () => {
    const headers = `From: sender@example.com
To: recipient@example.com
Subject: Meeting tomorrow
Date: Mon, 1 Jan 2024 12:00:00 +0000
Return-Path: <sender@example.com>
Authentication-Results: mx.example.com; spf=pass; dkim=pass; dmarc=pass`;

    const result = analyzeEmailHeaders(headers);
    expect(result.isSuspicious).toBe(false);
    expect(result.headerInfo.spf).toBe('pass');
    expect(result.headerInfo.dkim).toBe('pass');
    expect(result.headerInfo.dmarc).toBe('pass');
  });

  it('detects SPF failure', () => {
    const headers = `From: spoofed@bank.com
To: victim@example.com
Authentication-Results: mx.example.com; spf=fail`;

    const result = analyzeEmailHeaders(headers);
    expect(result.issues.some(i => i.includes('SPF'))).toBe(true);
    expect(result.riskScore).toBeGreaterThanOrEqual(25);
  });

  it('detects DKIM failure', () => {
    const headers = `From: sender@example.com
To: recipient@example.com
Return-Path: <sender@example.com>
Authentication-Results: mx.example.com; dkim=fail`;

    const result = analyzeEmailHeaders(headers);
    expect(result.issues.some(i => i.includes('DKIM'))).toBe(true);
  });

  it('detects DMARC failure', () => {
    const headers = `From: sender@example.com
To: recipient@example.com
Return-Path: <sender@example.com>
Authentication-Results: mx.example.com; dmarc=reject`;

    const result = analyzeEmailHeaders(headers);
    expect(result.issues.some(i => i.includes('DMARC'))).toBe(true);
  });

  it('flags missing From header', () => {
    const headers = `To: recipient@example.com
Return-Path: <sender@example.com>`;

    const result = analyzeEmailHeaders(headers);
    expect(result.issues.some(i => i.includes('From'))).toBe(true);
  });

  it('flags missing Return-Path', () => {
    const headers = `From: sender@example.com
To: recipient@example.com`;

    const result = analyzeEmailHeaders(headers);
    expect(result.issues.some(i => i.includes('Return-Path'))).toBe(true);
  });

  it('flags long Received chain', () => {
    const hops = Array(9).fill('Received: from relay.example.com').join('\n');
    const headers = `From: sender@example.com\nTo: recipient@example.com\nReturn-Path: <a@b.com>\n${hops}`;

    const result = analyzeEmailHeaders(headers);
    expect(result.issues.some(i => i.includes('Received'))).toBe(true);
  });

  it('marks suspicious when score >= 35', () => {
    const headers = `From: attacker@evil.com
To: victim@example.com
Authentication-Results: mx.example.com; spf=fail; dkim=fail; dmarc=fail`;

    const result = analyzeEmailHeaders(headers);
    expect(result.isSuspicious).toBe(true);
  });

  it('always returns recommendations', () => {
    const result = analyzeEmailHeaders('From: a@b.com\nTo: c@d.com\nReturn-Path: <a@b.com>');
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('handles empty input', () => {
    const result = analyzeEmailHeaders('');
    expect(result.riskScore).toBeGreaterThan(0); // missing From + Return-Path
  });
});

describe('getEmailRiskLevel', () => {
  it('returns low for score < 35', () => {
    expect(getEmailRiskLevel(10)).toBe('low');
  });

  it('returns medium for score 35-59', () => {
    expect(getEmailRiskLevel(40)).toBe('medium');
  });

  it('returns high for score >= 60', () => {
    expect(getEmailRiskLevel(70)).toBe('high');
  });
});
