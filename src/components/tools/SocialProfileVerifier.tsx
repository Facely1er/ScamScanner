import React, { useState } from 'react';
import { User, AlertTriangle, ShieldCheck, XCircle, Info } from 'lucide-react';
import { analyzeSocialProfile, getProfileRiskLevel } from '../../utils/socialProfileVerifier';
import { mapProfileAnalysisToAlert } from '../../mappers/profileToCautionAlert';
import { useCautionStore } from '../../state/cautionStore';

const SocialProfileVerifier: React.FC = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    displayName: '',
    bio: '',
    accountAge: '',
    postCount: '',
    followerCount: '',
    followingCount: '',
    verified: false,
    location: '',
    website: '',
  });
  const [result, setResult] = useState<any>(null);
  const [profileUrl, setProfileUrl] = useState('');

  const addAlert = useCautionStore((st) => st.addAlert);

  const extractUsernameFromUrl = (url: string): string | null => {
    try {
      const u = new URL(url);
      const p = u.pathname;
      const hostname = u.hostname.toLowerCase();
      const isLinkedInHost = hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com');
      if (isLinkedInHost) {
        const m = p.match(/\/in\/([^/]+)/);
        return m ? m[1] : null;
      }
      const m = p.match(/\/([^/]+)/);
      return m ? m[1] : null;
    } catch {
      return null;
    }
  };

  const handleUrlSubmit = () => {
    if (!profileUrl.trim()) return;
    const username = extractUsernameFromUrl(profileUrl);
    if (username) {
      setProfileData((prev) => ({ ...prev, username }));
      setProfileUrl('');
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = () => {
    const analysis = analyzeSocialProfile({
      username: profileData.username || undefined,
      displayName: profileData.displayName || undefined,
      bio: profileData.bio || undefined,
      accountAge: profileData.accountAge ? parseInt(profileData.accountAge) : undefined,
      postCount: profileData.postCount ? parseInt(profileData.postCount) : undefined,
      followerCount: profileData.followerCount ? parseInt(profileData.followerCount) : undefined,
      followingCount: profileData.followingCount ? parseInt(profileData.followingCount) : undefined,
      verified: profileData.verified,
      location: profileData.location || undefined,
      website: profileData.website || undefined,
    });
    setResult(analysis);
    if (analysis.isSuspicious) {
      const alert = mapProfileAnalysisToAlert(analysis, { id: `profile-${Date.now()}`, username: profileData.username });
      if (alert) addAlert(alert);
    }
  };

  const handleClear = () => {
    setProfileData({ username: '', displayName: '', bio: '', accountAge: '', postCount: '', followerCount: '', followingCount: '', verified: false, location: '', website: '' });
    setResult(null);
  };

  const riskLevel = result ? getProfileRiskLevel(result.riskScore) : null;
  const riskColor = result
    ? result.isSuspicious
      ? result.riskScore >= 70 ? 'var(--danger, #ef4444)' : '#f97316'
      : '#22c55e'
    : 'var(--border)';
  const noInput = !profileData.username && !profileData.displayName;

  return (
    <div style={{ maxWidth: 768 }}>
      <div className="mb-20">
        <p className="p mb-12">
          Enter profile information to analyze for fake, bot, or AI-generated account indicators
        </p>
        <div className="tool-info-box">
          <Info size={16} className="text-primary flex-shrink-0 mt-2" />
          <p className="small m-0">
            <strong>Privacy First:</strong> All analysis happens in your browser. Profile data never leaves your device.
          </p>
        </div>
      </div>

      <div className="tool-card mb-12">
        <label className="tool-label">Quick Fill: Paste Profile URL (Twitter, Instagram, Facebook, LinkedIn)</label>
        <div className="d-flex gap-8">
          <input
            type="text"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleUrlSubmit(); } }}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData('text');
              setTimeout(() => {
                setProfileUrl(pasted);
                const username = extractUsernameFromUrl(pasted);
                if (username) { setProfileData((prev) => ({ ...prev, username })); setProfileUrl(''); }
              }, 0);
            }}
            autoFocus
            placeholder="https://twitter.com/username or https://instagram.com/username"
            className="tool-input flex-1"
          />
          <button
            onClick={handleUrlSubmit}
            disabled={!profileUrl.trim()}
            className="btn primary"
            style={{ opacity: !profileUrl.trim() ? 0.5 : 1, cursor: !profileUrl.trim() ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
          >
            Extract
          </button>
        </div>
        <p className="small mt-6 mb-0 text-secondary-color">Automatically extracts username from profile URLs</p>
      </div>

      <div className="tool-card">
        <div className="tool-grid2">
          {[
            { field: 'username', label: 'Username', placeholder: '@username', type: 'text' },
            { field: 'displayName', label: 'Display Name', placeholder: 'Display Name', type: 'text' },
          ].map(({ field, label, placeholder, type }) => (
            <div key={field}>
              <label className="tool-label">{label}</label>
              <input
                type={type}
                value={(profileData as any)[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={placeholder}
                className="tool-input"
              />
            </div>
          ))}

          <div style={{ gridColumn: '1 / -1' }}>
            <label className="tool-label">Bio/Description</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={3}
              placeholder="Profile bio or description"
              className="tool-textarea"
            />
          </div>

          {[
            { field: 'accountAge', label: 'Account Age (days)', placeholder: '365' },
            { field: 'postCount', label: 'Post Count', placeholder: '0' },
            { field: 'followerCount', label: 'Followers', placeholder: '0' },
            { field: 'followingCount', label: 'Following', placeholder: '0' },
            { field: 'website', label: 'Website', placeholder: 'https://example.com' },
          ].map(({ field, label, placeholder }) => (
            <div key={field}>
              <label className="tool-label">{label}</label>
              <input
                type={field === 'website' ? 'text' : 'number'}
                value={(profileData as any)[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={placeholder}
                className="tool-input"
              />
            </div>
          ))}

          <div className="d-flex items-center gap-10" style={{ gridColumn: '1 / -1' }}>
            <input
              type="checkbox"
              id="verified"
              checked={profileData.verified}
              onChange={(e) => handleChange('verified', e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="verified" className="tool-label mb-0 cursor-pointer">Account is verified</label>
          </div>
        </div>

        <div className="tool-row-lg">
          <button
            onClick={handleAnalyze}
            disabled={noInput}
            className="btn primary d-inline-flex items-center gap-6 flex-1 justify-center"
            style={{ opacity: noInput ? 0.5 : 1, cursor: noInput ? 'not-allowed' : 'pointer' }}
          >
            <User size={14} /> Analyze Profile
          </button>
          <button
            onClick={handleClear}
            disabled={noInput && !result}
            className="btn d-inline-flex items-center gap-6"
            style={{ opacity: (noInput && !result) ? 0.5 : 1, cursor: (noInput && !result) ? 'not-allowed' : 'pointer' }}
          >
            <XCircle size={14} /> Clear
          </button>
          <span className="tool-hint">Press Enter to extract URL</span>
        </div>
      </div>

      {result && (
        <div style={{
          border: `2px solid ${riskColor}`,
          borderRadius: 12,
          padding: '20px 24px',
          background: 'var(--bg-secondary)',
          marginBottom: 16,
        }}>
          <div className="tool-result-header">
            {result.isSuspicious
              ? <AlertTriangle size={28} style={{ color: riskColor, flexShrink: 0 }} />
              : <ShieldCheck size={28} style={{ color: '#22c55e', flexShrink: 0 }} />}
            <div>
              <p className="m-0 font-bold" style={{ fontSize: 16, color: riskColor }}>
                {result.isSuspicious
                  ? result.riskScore >= 70 ? '🚨 CRITICAL RISK' : '⚠️ HIGH RISK'
                  : '✓ Low Risk'}
              </p>
              <p className="small m-0 text-secondary-color">
                Risk Score: <strong>{result.riskScore}%</strong> ({riskLevel})
              </p>
            </div>
          </div>

          {result.issues.length > 0 && (
            <div className="mb-12">
              <p className="small font-semibold mb-6">Detected Issues:</p>
              <ul className="tool-list-none">
                {result.issues.map((issue: string, i: number) => (
                  <li key={i} className="small d-flex gap-6">
                    <span style={{ color: '#ef4444' }}>•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.patterns && (
            <div className="tool-sub-card">
              <p className="small font-semibold mb-6">Detected Patterns:</p>
              <div className="tool-grid2-gap4">
                {result.patterns.genericUsername && <p className="small m-0" style={{ color: '#ef4444' }}>• Generic username</p>}
                {result.patterns.emptyBio && <p className="small m-0" style={{ color: '#ef4444' }}>• Empty bio</p>}
                {result.patterns.suspiciousRatio && <p className="small m-0" style={{ color: '#ef4444' }}>• Suspicious follower ratio</p>}
                {result.patterns.newAccount && <p className="small m-0" style={{ color: '#ef4444' }}>• New account</p>}
                {result.patterns.suspiciousContent && <p className="small m-0" style={{ color: '#ef4444' }}>• Suspicious content</p>}
              </div>
            </div>
          )}

          <div>
            <p className="small font-semibold mb-6">Recommendations:</p>
            <ul className="tool-list-none">
              {result.recommendations.map((rec: string, i: number) => (
                <li key={i} className="small">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="tool-edu-box">
        <p className="small font-semibold mb-8">💡 What to look for:</p>
        <ul className="tool-list-none">
          {[
            'Generic or auto-generated usernames',
            'Very new accounts with suspicious activity',
            'Unusual follower/following ratios',
            'Empty bios or suspicious promotional content',
            'Accounts following many but having zero followers',
          ].map((item) => (
            <li key={item} className="small text-secondary-color">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SocialProfileVerifier;
