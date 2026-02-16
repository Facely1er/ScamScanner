import React, { useState } from 'react';
import { X, Download, Lock, Sparkles, Check } from 'lucide-react';
import { priceLabel } from '../config/product';
import { isDemoMode, getUsageStatus } from '../core/usageLimits';
import { initiatePurchase, restorePurchases } from '../../services/purchaseService';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName?: string;
  toolId?: string;
}

export default function PaywallModal({ isOpen, onClose, toolName, toolId }: PaywallModalProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const demoMode = isDemoMode();
  const usageStatus = toolId ? getUsageStatus(toolId) : null;

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    setError(null);
    
    try {
      const result = await initiatePurchase();
      if (result.success && result.verified) {
        onClose();
        // Reload page to update unlock status
        window.location.reload();
      } else {
        setError(result.error || 'Purchase failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsPurchasing(true);
    setError(null);
    
    try {
      const result = await restorePurchases();
      if (result.success && result.verified) {
        onClose();
        window.location.reload();
      } else {
        setError(result.error || 'No purchases found to restore.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: 400,
          width: '100%',
          position: 'relative',
          backgroundColor: 'var(--bg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          {demoMode ? (
            <Lock size={24} style={{ color: 'var(--primary)' }} />
          ) : (
            <Download size={24} style={{ color: 'var(--primary)' }} />
          )}
          <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>
            {demoMode ? 'Upgrade to Full Access' : 'Get the App'}
          </h2>
        </div>

        {demoMode && usageStatus && (
          <div style={{ 
            marginBottom: 16, 
            padding: 12, 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: 8,
            border: '1px solid var(--border)'
          }}>
            <p className="small" style={{ margin: 0, marginBottom: 8 }}>
              <strong>Demo Mode:</strong> {usageStatus.used} of {usageStatus.used + usageStatus.remaining} scans used
            </p>
            {usageStatus.trialExpired && (
              <p className="small" style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Trial period has expired
              </p>
            )}
          </div>
        )}

        <p className="p" style={{ marginBottom: 24 }}>
          {demoMode 
            ? (toolName 
                ? `You've reached the limit for ${toolName}. Upgrade to unlock unlimited scans and all features.`
                : "You've reached the demo limit. Upgrade to unlock unlimited scans and all features.")
            : (toolName 
                ? `${toolName} is available in the app. Purchase and download to access all tools.`
                : "This feature is available in the app. Purchase and download to access all tools.")}
        </p>

        {demoMode && (
          <div style={{ marginBottom: 16 }}>
            <p className="small" style={{ marginBottom: 12, fontWeight: 600 }}>Full Access Includes:</p>
            <ul style={{ margin: 0, paddingLeft: 20, listStyle: 'none' }}>
              <li style={{ marginBottom: 8, display: 'flex', alignItems: 'start', gap: 8 }}>
                <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                <span className="small">Unlimited scans for all tools</span>
              </li>
              <li style={{ marginBottom: 8, display: 'flex', alignItems: 'start', gap: 8 }}>
                <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                <span className="small">Batch processing</span>
              </li>
              <li style={{ marginBottom: 8, display: 'flex', alignItems: 'start', gap: 8 }}>
                <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                <span className="small">Export results</span>
              </li>
              <li style={{ marginBottom: 8, display: 'flex', alignItems: 'start', gap: 8 }}>
                <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                <span className="small">Advanced analysis features</span>
              </li>
            </ul>
          </div>
        )}

        {error && (
          <div style={{ 
            marginBottom: 16, 
            padding: 12, 
            backgroundColor: 'var(--error-bg, rgba(255, 0, 0, 0.1))', 
            borderRadius: 8,
            border: '1px solid var(--error-border, rgba(255, 0, 0, 0.3))'
          }}>
            <p className="small" style={{ margin: 0, color: 'var(--error-text, #ff4444)' }}>
              {error}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={handlePurchase}
            disabled={isPurchasing}
            className="btn primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {isPurchasing ? (
              <>
                <Sparkles size={16} />
                Processing...
              </>
            ) : (
              <>
                <Download size={16} />
                {demoMode ? `Upgrade — ${priceLabel}` : `Get the app — ${priceLabel}`}
              </>
            )}
          </button>
          
          {demoMode && (
            <button
              onClick={handleRestore}
              disabled={isPurchasing}
              className="btn"
              style={{ width: '100%' }}
            >
              Restore Purchases
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

