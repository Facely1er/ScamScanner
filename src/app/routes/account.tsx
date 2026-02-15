import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../../contexts/PreferencesContext';
import { Settings, Shield, Download, Info, Check, RefreshCw } from 'lucide-react';
import { brandName, tagline, publisher, priceLabel } from '../config/product';
import { isUnlocked, isDemoMode } from '../core/usageLimits';
import { hasVerifiedPurchase, restorePurchases } from '../../services/purchaseService';
import DemoStatus from '../../components/common/DemoStatus';

export default function Preferences() {
  const { preferences, updatePreferences } = usePreferences();
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const unlocked = isUnlocked();
  const demoMode = isDemoMode();
  const hasPurchase = hasVerifiedPurchase();

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean | number) => {
    updatePreferences({ [key]: value });
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    setRestoreError(null);
    
    try {
      const result = await restorePurchases();
      if (result.success && result.verified) {
        window.location.reload();
      } else {
        setRestoreError(result.error || 'No purchases found to restore.');
      }
    } catch (err) {
      setRestoreError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="grid">
      <section className="card">
        <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings size={16} /> Preferences
        </div>
        <h1 className="h1">Preferences</h1>
        <p className="p">Configure your analysis preferences and settings.</p>
      </section>

      {/* Purchase Status */}
      {unlocked ? (
        <div className="card" style={{ padding: 16, backgroundColor: 'rgb(240 253 244)', border: '1px solid rgb(34 197 94)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Check size={20} style={{ color: 'rgb(21 128 61)', marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 4, color: 'rgb(21 128 61)' }}>Full Access Active</div>
              <div className="small" style={{ color: 'rgb(21 128 61)' }}>
                You have full access to all features. Thank you for your purchase!
              </div>
            </div>
          </div>
        </div>
      ) : (
        <DemoStatus />
      )}

      <div className="card" style={{ padding: 16, backgroundColor: 'rgb(240 253 244)', border: '1px solid rgb(34 197 94)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Shield size={20} style={{ color: 'rgb(21 128 61)', marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4, color: 'rgb(21 128 61)' }}>Privacy First</div>
            <div className="small" style={{ color: 'rgb(21 128 61)' }}>
              All data is stored locally on your device. No information is collected or transmitted to external servers. 
              Your privacy and security remain under your control.
            </div>
          </div>
        </div>
      </div>

      <section className="card">
        <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings size={20} /> Analysis Preferences
        </h2>
        <div className="small" style={{ marginBottom: 16, opacity: 0.8 }}>
          All settings are stored locally on your device.
        </div>

        <div className="grid" style={{ gap: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Auto-save Reports</div>
                <div className="small" style={{ opacity: 0.8 }}>
                  Automatically save analysis reports to your dashboard.
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 24 }}>
                <input
                  type="checkbox"
                  checked={preferences.saveReportsAutomatically}
                  onChange={(e) => handlePreferenceChange('saveReportsAutomatically', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: preferences.saveReportsAutomatically ? 'var(--primary)' : '#ccc',
                    transition: '0.3s',
                    borderRadius: 24,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      content: '',
                      height: 18,
                      width: 18,
                      left: preferences.saveReportsAutomatically ? 26 : 3,
                      bottom: 3,
                      backgroundColor: 'white',
                      transition: '0.3s',
                      borderRadius: '50%',
                    }}
                  />
                </span>
              </label>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Show Risk Warnings</div>
                <div className="small" style={{ opacity: 0.8 }}>
                  Display detailed warnings for high-risk content.
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 24 }}>
                <input
                  type="checkbox"
                  checked={preferences.showRiskWarnings}
                  onChange={(e) => handlePreferenceChange('showRiskWarnings', e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: preferences.showRiskWarnings ? 'var(--primary)' : '#ccc',
                    transition: '0.3s',
                    borderRadius: 24,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      content: '',
                      height: 18,
                      width: 18,
                      left: preferences.showRiskWarnings ? 26 : 3,
                      bottom: 3,
                      backgroundColor: 'white',
                      transition: '0.3s',
                      borderRadius: '50%',
                    }}
                  />
                </span>
              </label>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Analysis History (Days)</div>
              <div className="small" style={{ opacity: 0.8, marginBottom: 12 }}>
                Retain analysis history for the selected number of days.
              </div>
              <select
                value={preferences.analysisHistory}
                onChange={(e) => handlePreferenceChange('analysisHistory', Number(e.target.value))}
                className="input"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {!unlocked && (
        <section className="card">
          <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Download size={20} /> {demoMode ? 'Upgrade to Full Access' : 'Get the App'}
          </h2>
          <div className="grid" style={{ gap: 12 }}>
            <Link to="/pricing" className="card" style={{ padding: 16, display: 'block', textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Download size={20} style={{ color: 'var(--primary)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Purchase Full Access</div>
                  <div className="small" style={{ opacity: 0.8 }}>
                    {demoMode 
                      ? `Upgrade for unlimited scans and all features — ${priceLabel}`
                      : `Get full access with a one-time purchase — ${priceLabel}`}
                  </div>
                </div>
              </div>
            </Link>
            
            {demoMode && (
              <div className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <RefreshCw size={20} style={{ color: 'var(--primary)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Restore Purchases</div>
                    <div className="small" style={{ opacity: 0.8, marginBottom: 8 }}>
                      Restore your purchase if you've already bought the app
                    </div>
                    {restoreError && (
                      <div className="small" style={{ color: 'var(--error, #ff4444)', marginBottom: 8 }}>
                        {restoreError}
                      </div>
                    )}
                    <button
                      onClick={handleRestorePurchases}
                      disabled={isRestoring}
                      className="btn"
                      style={{ width: '100%' }}
                    >
                      {isRestoring ? 'Restoring...' : 'Restore Purchases'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="card">
        <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Info size={20} /> About
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{brandName}</div>
            <div className="small" style={{ opacity: 0.8, marginBottom: 4 }}>{tagline}</div>
            <div className="small" style={{ opacity: 0.6 }}>{publisher}</div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={20} /> Security & Privacy
        </h2>

        <div className="grid" style={{ gap: 12 }}>
          <div>
            <div className="small" style={{ marginBottom: 8, fontWeight: 600 }}>Local Storage Only</div>
            <p className="small" style={{ opacity: 0.8 }}>
              Reports, documents, and preferences are stored only in your browser's local storage. 
              No data is transmitted to any server. Clearing your browser data will remove all saved information.
            </p>
          </div>

          <div>
            <div className="small" style={{ marginBottom: 8, fontWeight: 600 }}>Security Tips</div>
            <ul className="small" style={{ paddingLeft: 20, opacity: 0.8 }}>
              <li>Be cautious of phishing attempts</li>
              <li>Regularly review your saved reports</li>
              <li>Clear data when using shared devices</li>
              <li>Back up important reports if needed</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
