import React, { useState } from 'react';
import { User, AlertTriangle, ShieldCheck, XCircle, Info } from 'lucide-react';
import { analyzeSocialProfile, getProfileRiskLevel } from '../../utils/socialProfileVerifier';
import { mapProfileAnalysisToAlert } from '../../mappers/profileToCautionAlert';
import { useCautionStore } from '../../state/cautionStore';

const s = {
  wrap: { maxWidth: 768 } as React.CSSProperties,
  card: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 16,
  } as React.CSSProperties,
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: 6,
  } as React.CSSProperties,
  input: {
    width: '100%',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    background: 'var(--bg)',
    color: 'var(--text)',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
  } as React.CSSProperties,
  row: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const, marginTop: 16 },
  hint: { fontSize: 12, color: 'var(--text-secondary)', marginLeft: 'auto' },
  resultCard: (color: string) => ({
    border: `2px solid ${color}`,
    borderRadius: 12,
    padding: '20px 24px',
    background: 'var(--bg-secondary)',
    marginBottom: 16,
  } as React.CSSProperties),
  infoBox: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 16,
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  } as React.CSSProperties,
  subCard: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '12px 16px',
    marginBottom: 12,
  } as React.CSSProperties,
  eduBox: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '16px 20px',
    marginTop: 24,
  } as React.CSSProperties,
};

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
      if (u.hostname.includes('linkedin.com')) {
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
    <div style={s.wrap}>
      <div style={{ marginBottom: 20 }}>
        <p className="p" style={{ marginBottom: 12 }}>
          Enter profile information to analyze for fake, bot, or AI-generated account indicators
        </p>
        <div style={s.infoBox}>
          <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
          <p className="small" style={{ margin: 0 }}>
            <strong>Privacy First:</strong> All analysis happens in your browser. Profile data never leaves your device.
          </p>
        </div>
      </div>

      {/* URL quick-fill */}
      <div style={{ ...s.card, marginBottom: 12 }}>
        <label style={s.label}>Quick Fill: Paste Profile URL (Twitter, Instagram, Facebook, LinkedIn)</label>
        <div style={{ display: 'flex', gap: 8 }}>
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
            style={{ ...s.input, flex: 1 }}
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
        <p className="small" style={{ margin: '6px 0 0', color: 'var(--text-secondary)' }}>Automatically extracts username from profile URLs</p>
      </div>

      {/* Profile fields */}
      <div style={s.card}>
        <div style={s.grid2}>
          {[
            { field: 'username', label: 'Username', placeholder: '@username', type: 'text' },
            { field: 'displayName', label: 'Display Name', placeholder: 'Display Name', type: 'text' },
          ].map(({ field, label, placeholder, type }) => (
            <div key={field}>
              <label style={s.label}>{label}</label>
              <input type={type} value={(profileData as any)[field]} onChange={(e) => handleChange(field, e.target.value)} placeholder={placeholder} style={s.input} />
            </div>
          ))}

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={s.label}>Bio/Description</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={3}
              placeholder="Profile bio or description"
              style={{ ...s.input, resize: 'vertical', fontFamily: 'inherit' }}
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
              <label style={s.label}>{label}</label>
              <input type={field === 'website' ? 'text' : 'number'} value={(profileData as any)[field]} onChange={(e) => handleChange(field, e.target.value)} placeholder={placeholder} style={s.input} />
            </div>
          ))}

          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="verified"
              checked={profileData.verified}
              onChange={(e) => handleChange('verified', e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer' }}
            />
            <label htmlFor="verified" style={{ ...s.label, marginBottom: 0, cursor: 'pointer' }}>Account is verified</label>
          </div>
        </div>

        <div style={s.row}>
          <button
            onClick={handleAnalyze}
            disabled={noInput}
            className="btn primary"
            style={{ opacity: noInput ? 0.5 : 1, cursor: noInput ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}
          >
            <User size={14} /> Analyze Profile
          </button>
          <button
            onClick={handleClear}
            disabled={noInput && !result}
            className="btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: (noInput && !result) ? 0.5 : 1, cursor: (noInput && !result) ? 'not-allowed' : 'pointer' }}
          >
            <XCircle size={14} /> Clear
          </button>
          <span style={s.hint}>Press Enter to extract URL</span>
        </div>
      </div>

      {result && (
        <div style={s.resultCard(riskColor)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            {result.isSuspicious
              ? <AlertTriangle size={28} style={{ color: riskColor, flexShrink: 0 }} />
              : <ShieldCheck size={28} style={{ color: '#22c55e', flexShrink: 0 }} />}
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: riskColor }}>
                {result.isSuspicious
                  ? result.riskScore >= 70 ? '🚨 CRITICAL RISK' : '⚠️ HIGH RISK'
                  : '✓ Low Risk'}
              </p>
              <p className="small" style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Risk Score: <strong>{result.riskScore}%</strong> ({riskLevel})
              </p>
            </div>
          </div>

          {result.issues.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p className="small" style={{ fontWeight: 600, marginBottom: 6 }}>Detected Issues:</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {result.issues.map((issue: string, i: number) => (
                  <li key={i} className="small" style={{ display: 'flex', gap: 6 }}>
                    <span style={{ color: '#ef4444' }}>•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.patterns && (
            <div style={s.subCard}>
              <p className="small" style={{ fontWeight: 600, marginBottom: 6 }}>Detected Patterns:</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
                {result.patterns.genericUsername && <p className="small" style={{ margin: 0, color: '#ef4444' }}>• Generic username</p>}
                {result.patterns.emptyBio && <p className="small" style={{ margin: 0, color: '#ef4444' }}>• Empty bio</p>}
                {result.patterns.suspiciousRatio && <p className="small" style={{ margin: 0, color: '#ef4444' }}>• Suspicious follower ratio</p>}
                {result.patterns.newAccount && <p className="small" style={{ margin: 0, color: '#ef4444' }}>• New account</p>}
                {result.patterns.suspiciousContent && <p className="small" style={{ margin: 0, color: '#ef4444' }}>• Suspicious content</p>}
              </div>
            </div>
          )}

          <div>
            <p className="small" style={{ fontWeight: 600, marginBottom: 6 }}>Recommendations:</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {result.recommendations.map((rec: string, i: number) => (
                <li key={i} className="small">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div style={s.eduBox}>
        <p className="small" style={{ fontWeight: 600, marginBottom: 8 }}>💡 What to look for:</p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[
            'Generic or auto-generated usernames',
            'Very new accounts with suspicious activity',
            'Unusual follower/following ratios',
            'Empty bios or suspicious promotional content',
            'Accounts following many but having zero followers',
          ].map((item) => (
            <li key={item} className="small" style={{ color: 'var(--text-secondary)' }}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SocialProfileVerifier;
