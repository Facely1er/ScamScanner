import React from 'react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../../contexts/PreferencesContext';
import { Settings, Shield, Download, Info } from 'lucide-react';
import { brandName, tagline, publisher } from '../config/product';

export default function Preferences() {
  const { preferences, updatePreferences } = usePreferences();

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean | number) => {
    updatePreferences({ [key]: value });
  };

  return (
    <div className="grid" style={{ gap: 14 }}>
      <section className="card">
        <div className="kicker d-flex items-center gap-8">
          <Settings size={16} /> Preferences
        </div>
        <h1 className="h1">Preferences</h1>
        <p className="p">Configure your analysis preferences and settings.</p>
      </section>

      <div className="card p-16 notice-success">
        <div className="info-row">
          <Shield size={20} className="text-green mt-2 flex-shrink-0" />
          <div>
            <div className="font-semibold mb-4 text-green">Privacy First</div>
            <div className="small text-green">
              All data is stored locally on your device. No information is collected or transmitted to external servers.
              Your privacy and security remain under your control.
            </div>
          </div>
        </div>
      </div>

      <section className="card">
        <h2 className="h2 heading-with-icon">
          <Settings size={20} /> Analysis Preferences
        </h2>
        <div className="small mb-16 opacity-8">
          All settings are stored locally on your device.
        </div>

        <div className="grid gap-16">
          <div className="card p-16">
            <div className="d-flex justify-between items-start">
              <div className="flex-1">
                <div className="font-semibold mb-4">Auto-save Reports</div>
                <div className="small opacity-8">
                  Automatically save analysis reports to your dashboard.
                </div>
              </div>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={preferences.saveReportsAutomatically}
                  onChange={(e) => handlePreferenceChange('saveReportsAutomatically', e.target.checked)}
                  className="toggle-input"
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

          <div className="card p-16">
            <div className="d-flex justify-between items-start">
              <div className="flex-1">
                <div className="font-semibold mb-4">Show Risk Warnings</div>
                <div className="small opacity-8">
                  Display detailed warnings for high-risk content.
                </div>
              </div>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={preferences.showRiskWarnings}
                  onChange={(e) => handlePreferenceChange('showRiskWarnings', e.target.checked)}
                  className="toggle-input"
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

          <div className="card p-16">
            <div>
              <div className="font-semibold mb-8">Analysis History (Days)</div>
              <div className="small opacity-8 mb-12">
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

      <section className="card">
        <h2 className="h2 heading-with-icon">
          <Download size={20} /> Access & Support
        </h2>
        <div className="grid gap-12">
          <Link to="/pricing" className="card p-16 d-block" style={{ textDecoration: 'none' }}>
            <div className="d-flex items-center gap-12">
              <Download size={20} className="text-primary" />
              <div>
                <div className="font-semibold mb-4">View Access Details</div>
                <div className="small opacity-8">
                  Full web access is available now. Optional support details are listed here.
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="card">
        <h2 className="h2 heading-with-icon">
          <Info size={20} /> About
        </h2>
        <div className="d-flex flex-col gap-8">
          <div>
            <div className="font-semibold mb-4">{brandName}</div>
            <div className="small opacity-8 mb-4">{tagline}</div>
            <div className="small opacity-6">{publisher}</div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="h2 heading-with-icon">
          <Shield size={20} /> Security & Privacy
        </h2>

        <div className="grid gap-12">
          <div>
            <div className="small mb-8 font-semibold">Local Storage Only</div>
            <p className="small opacity-8">
              Reports, documents, and preferences are stored only in your browser's local storage.
              No data is transmitted to any server. Clearing your browser data will remove all saved information.
            </p>
          </div>

          <div>
            <div className="small mb-8 font-semibold">Security Tips</div>
            <ul className="small pl-5 opacity-8">
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
