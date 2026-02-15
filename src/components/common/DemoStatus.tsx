/**
 * Demo status component
 * Shows demo usage limits and upgrade prompt
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles, AlertCircle } from 'lucide-react';
import { isDemoMode, isUnlocked, getUsageStatus, TOOL_IDS } from '../../app/core/usageLimits';
import { appConfig } from '../../config/app';
import { priceLabel } from '../../app/config/product';

export default function DemoStatus() {
  const unlocked = isUnlocked();
  const demoMode = isDemoMode();

  // Don't show if unlocked or not in demo mode
  if (unlocked || !demoMode) {
    return null;
  }

  // Get usage for all tools
  const tools = [
    { id: TOOL_IDS.MESSAGES, name: 'Message Analyzer' },
    { id: TOOL_IDS.PROFILES, name: 'Profile Verifier' },
    { id: TOOL_IDS.IMAGES, name: 'Image Analyzer' },
    { id: TOOL_IDS.EMAIL, name: 'Email Analyzer' },
  ];

  const toolStatuses = tools.map(tool => ({
    ...tool,
    status: getUsageStatus(tool.id),
  }));

  const totalUsed = toolStatuses.reduce((sum, t) => sum + t.status.used, 0);
  const totalLimit = toolStatuses.length * appConfig.demo.scansPerTool;
  const anyLimitReached = toolStatuses.some(t => t.status.limitReached);
  const anyTrialExpired = toolStatuses.some(t => t.status.trialExpired);

  return (
    <div className="card" style={{ 
      backgroundColor: 'var(--bg-secondary)', 
      border: '1px solid var(--border)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Lock size={20} style={{ color: 'var(--primary)' }} />
        <h3 className="h3" style={{ margin: 0 }}>Demo Mode</h3>
      </div>

      {anyTrialExpired ? (
        <div style={{ 
          marginBottom: 16, 
          padding: 12, 
          backgroundColor: 'var(--error-bg, rgba(255, 0, 0, 0.1))', 
          borderRadius: 8,
          display: 'flex',
          alignItems: 'start',
          gap: 8
        }}>
          <AlertCircle size={18} style={{ color: 'var(--error-text, #ff4444)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="small" style={{ margin: 0, fontWeight: 600, color: 'var(--error-text, #ff4444)' }}>
              Trial Period Expired
            </p>
            <p className="small" style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>
              Upgrade to continue using all features
            </p>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <p className="p" style={{ marginBottom: 12 }}>
            You're using the demo version with limited features. Upgrade for unlimited access.
          </p>
          
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span className="small">Overall Usage</span>
              <span className="small" style={{ fontWeight: 600 }}>
                {totalUsed} / {totalLimit} scans
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: 8, 
              backgroundColor: 'var(--border)', 
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${(totalUsed / totalLimit) * 100}%`, 
                height: '100%', 
                backgroundColor: anyLimitReached ? 'var(--error, #ff4444)' : 'var(--primary)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {anyLimitReached && (
            <div style={{ 
              padding: 8, 
              backgroundColor: 'var(--warning-bg, rgba(255, 193, 7, 0.1))', 
              borderRadius: 6,
              display: 'flex',
              alignItems: 'start',
              gap: 8
            }}>
              <AlertCircle size={16} style={{ color: 'var(--warning, #ffc107)', flexShrink: 0, marginTop: 2 }} />
              <p className="small" style={{ margin: 0 }}>
                Some tools have reached their limit. Upgrade for unlimited access.
              </p>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Link
          to="/pricing"
          className="btn primary"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Sparkles size={16} />
          Upgrade to Full Access — {priceLabel}
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="small" style={{ color: 'var(--text-secondary)' }}>
            {appConfig.demo.scansPerTool} scans per tool
          </span>
          {appConfig.demo.trialDays > 0 && (
            <span className="small" style={{ color: 'var(--text-secondary)' }}>
              {appConfig.demo.trialDays}-day trial
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

