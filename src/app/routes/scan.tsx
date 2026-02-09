import React, { useState, useEffect } from 'react';
import { useSessionStore } from '../../state/sessionStore';
import { analyzeMessage, analyzeEmail, analyzeImage, analyzeProfile } from '../../services/unifiedAnalyzer';
import {
  Shield, MessageSquare, Mail, Image as ImageIcon, User,
  Plus, CheckCircle, Circle, AlertTriangle, Info, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContextOrigin } from '../../types/scan';

export default function Scan() {
  const {
    currentSession,
    createSession,
    updateContext,
    addEvidence,
    getWorkflowSteps,
    getNextRecommendedStep,
    completeSession
  } = useSessionStore();

  const [showContextForm, setShowContextForm] = useState(false);
  const [activeAnalyzer, setActiveAnalyzer] = useState<string | null>(null);

  useEffect(() => {
    if (!currentSession) {
      setShowContextForm(true);
    }
  }, [currentSession]);

  const handleStartScan = (context: any) => {
    createSession(context);
    setShowContextForm(false);
  };

  if (showContextForm || !currentSession) {
    return <ContextForm onStart={handleStartScan} onCancel={() => setShowContextForm(false)} />;
  }

  const workflowSteps = getWorkflowSteps();
  const nextStep = getNextRecommendedStep();

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <div className="kicker">
          <Shield size={16} /> Active Scan Session
        </div>
        <h1 className="h1">Context-Aware Analysis</h1>
        <p className="p">
          Analyzing content from {currentSession.context.origin.replace('_', ' ')}.
          {currentSession.context.senderName && ` Sender: ${currentSession.context.senderName}`}
        </p>

        <ConfidenceMeter
          confidence={currentSession.confidence}
          riskLevel={currentSession.overallRiskLevel}
          riskScore={currentSession.overallRiskScore}
        />
      </section>

      <section className="card">
        <div className="kicker"><TrendingUp size={16} /> Analysis Progress</div>
        <div style={{ marginTop: 16 }}>
          <ProgressBar percentage={currentSession.completionPercentage} />
          <div style={{ marginTop: 12 }}>
            {workflowSteps.map(step => (
              <WorkflowStepItem
                key={step.id}
                step={step}
                isNext={nextStep?.id === step.id}
                onClick={() => setActiveAnalyzer(step.type)}
              />
            ))}
          </div>
        </div>
      </section>

      {activeAnalyzer && (
        <AnalyzerPanel
          type={activeAnalyzer}
          onAnalyze={(evidence: any) => {
            addEvidence(evidence);
            setActiveAnalyzer(null);
          }}
          onClose={() => setActiveAnalyzer(null)}
        />
      )}

      <ResultsPanel session={currentSession} />

      {currentSession.nextSteps.length > 0 && (
        <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div className="kicker"><Info size={16} /> Recommended Actions</div>
          <ul style={{ marginTop: 12, paddingLeft: 20 }}>
            {currentSession.nextSteps.map((step, index) => (
              <li key={index} className="p" style={{ marginTop: 8 }}>{step}</li>
            ))}
          </ul>
        </section>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            completeSession();
            window.location.href = '/dashboard';
          }}
          className="btn primary"
        >
          Complete and Save
        </button>
        <Link to="/dashboard" className="btn">View History</Link>
        <Link to="/" className="btn">Home</Link>
      </div>
    </div>
  );
}

function ContextForm({ onStart, onCancel }: { onStart: (context: any) => void; onCancel: () => void }) {
  const [origin, setOrigin] = useState<ContextOrigin>('unknown');
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [requestedAction, setRequestedAction] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      origin,
      senderName: senderName || undefined,
      relationship: relationship || undefined,
      receivedDate: receivedDate || undefined,
      requestedAction: requestedAction || undefined,
      additionalNotes: additionalNotes || undefined
    });
  };

  return (
    <div className="grid">
      <section className="card">
        <div className="kicker"><Shield size={16} /> Start New Scan</div>
        <h1 className="h1">Provide Context</h1>
        <p className="p">
          Help us understand the situation for more accurate analysis. All information stays on your device.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="small" style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                Where did you receive this? *
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value as ContextOrigin)}
                className="btn"
                style={{ width: '100%', textAlign: 'left' }}
                required
              >
                <option value="unknown">Not sure</option>
                <option value="email">Email</option>
                <option value="social_media">Social Media</option>
                <option value="direct_message">Direct Message</option>
                <option value="sms">SMS/Text</option>
              </select>
            </div>

            <div>
              <label className="small" style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                Sender Name (if known)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="btn"
                style={{ width: '100%', textAlign: 'left' }}
                placeholder="e.g., John Smith, Support Team"
              />
            </div>

            <div>
              <label className="small" style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                Your relationship to sender
              </label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="btn"
                style={{ width: '100%', textAlign: 'left' }}
                placeholder="e.g., stranger, acquaintance, business contact"
              />
            </div>

            <div>
              <label className="small" style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                What action are they requesting?
              </label>
              <input
                type="text"
                value={requestedAction}
                onChange={(e) => setRequestedAction(e.target.value)}
                className="btn"
                style={{ width: '100%', textAlign: 'left' }}
                placeholder="e.g., send money, verify account, click link"
              />
            </div>

            <div>
              <label className="small" style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
                Additional notes
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="btn"
                style={{ width: '100%', textAlign: 'left', minHeight: 80, resize: 'vertical' }}
                placeholder="Any other relevant details..."
              />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" className="btn primary">Start Analysis</button>
              <Link to="/" className="btn">Cancel</Link>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

function ConfidenceMeter({ confidence, riskLevel, riskScore }: { confidence: number; riskLevel: string; riskScore: number }) {
  const percentage = Math.round(confidence * 100);

  let riskColor = 'rgb(34 197 94)';
  if (riskLevel === 'high') riskColor = 'rgb(239 68 68)';
  else if (riskLevel === 'medium') riskColor = 'rgb(251 146 60)';

  return (
    <div style={{ marginTop: 16, padding: 16, backgroundColor: 'var(--bg-secondary)', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className="small" style={{ fontWeight: 600 }}>Analysis Confidence</span>
        <span className="small" style={{ fontWeight: 600 }}>{percentage}%</span>
      </div>
      <div style={{ height: 8, backgroundColor: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: 'var(--primary)',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <div>
          <div className="small" style={{ opacity: 0.7 }}>Risk Level</div>
          <div className="kicker" style={{ marginTop: 4, color: riskColor, textTransform: 'capitalize' }}>
            {riskLevel}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="small" style={{ opacity: 0.7 }}>Risk Score</div>
          <div className="kicker" style={{ marginTop: 4, color: riskColor }}>
            {riskScore}/100
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="small">Completion</span>
        <span className="small" style={{ fontWeight: 600 }}>{Math.round(percentage)}%</span>
      </div>
      <div style={{ height: 6, backgroundColor: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: 'var(--primary)',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}

function WorkflowStepItem({ step, isNext, onClick }: any) {
  const icons: Record<string, React.ReactNode> = {
    message: <MessageSquare size={16} />,
    email: <Mail size={16} />,
    image: <ImageIcon size={16} />,
    profile: <User size={16} />
  };

  return (
    <button
      onClick={onClick}
      className="btn"
      style={{
        width: '100%',
        marginTop: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'left',
        border: isNext ? '2px solid var(--primary)' : undefined
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {step.completed ? <CheckCircle size={18} color="rgb(34 197 94)" /> : <Circle size={18} />}
        {icons[step.type as string]}
        <div>
          <div className="small" style={{ fontWeight: 600 }}>{step.label}</div>
          <div className="small" style={{ opacity: 0.7, fontSize: '0.85rem' }}>{step.description}</div>
        </div>
      </div>
      {isNext && <span className="badge">Next</span>}
      {step.required && !step.completed && !isNext && <span className="badge" style={{ opacity: 0.6 }}>Required</span>}
    </button>
  );
}

function AnalyzerPanel({ type, onAnalyze, onClose }: any) {
  const [loading, setLoading] = useState(false);

  const handleMessageAnalyze = async (text: string) => {
    setLoading(true);
    const evidence = await analyzeMessage(text);
    onAnalyze(evidence);
    setLoading(false);
  };

  const handleEmailAnalyze = async (headers: string) => {
    setLoading(true);
    const evidence = await analyzeEmail(headers);
    onAnalyze(evidence);
    setLoading(false);
  };

  const handleImageAnalyze = async (file: File) => {
    setLoading(true);
    const evidence = await analyzeImage(file);
    onAnalyze(evidence);
    setLoading(false);
  };

  const handleProfileAnalyze = async (profileData: any) => {
    setLoading(true);
    const evidence = await analyzeProfile(profileData);
    onAnalyze(evidence);
    setLoading(false);
  };

  return (
    <section className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="kicker">
          {type === 'message' && <><MessageSquare size={16} /> Analyze Message</>}
          {type === 'email' && <><Mail size={16} /> Analyze Email</>}
          {type === 'image' && <><ImageIcon size={16} /> Analyze Image</>}
          {type === 'profile' && <><User size={16} /> Analyze Profile</>}
        </div>
        <button onClick={onClose} className="btn" style={{ minWidth: 'auto', padding: '4px 12px' }}>
          Close
        </button>
      </div>

      {type === 'message' && <MessageAnalyzer onAnalyze={handleMessageAnalyze} loading={loading} />}
      {type === 'email' && <EmailAnalyzer onAnalyze={handleEmailAnalyze} loading={loading} />}
      {type === 'image' && <ImageAnalyzer onAnalyze={handleImageAnalyze} loading={loading} />}
      {type === 'profile' && <ProfileAnalyzer onAnalyze={handleProfileAnalyze} loading={loading} />}
    </section>
  );
}

function MessageAnalyzer({ onAnalyze, loading }: any) {
  const [text, setText] = useState('');

  return (
    <div style={{ marginTop: 16 }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste the message text here..."
        className="btn"
        style={{ width: '100%', minHeight: 120, resize: 'vertical', textAlign: 'left' }}
      />
      <button
        onClick={() => text.trim() && onAnalyze(text)}
        disabled={!text.trim() || loading}
        className="btn primary"
        style={{ marginTop: 12 }}
      >
        {loading ? 'Analyzing...' : 'Analyze Message'}
      </button>
    </div>
  );
}

function EmailAnalyzer({ onAnalyze, loading }: any) {
  const [headers, setHeaders] = useState('');

  return (
    <div style={{ marginTop: 16 }}>
      <textarea
        value={headers}
        onChange={(e) => setHeaders(e.target.value)}
        placeholder="Paste email headers here..."
        className="btn"
        style={{ width: '100%', minHeight: 120, resize: 'vertical', textAlign: 'left' }}
      />
      <button
        onClick={() => headers.trim() && onAnalyze(headers)}
        disabled={!headers.trim() || loading}
        className="btn primary"
        style={{ marginTop: 12 }}
      >
        {loading ? 'Analyzing...' : 'Analyze Headers'}
      </button>
    </div>
  );
}

function ImageAnalyzer({ onAnalyze, loading }: any) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div style={{ marginTop: 16 }}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="btn"
        style={{ width: '100%' }}
      />
      {file && <div className="small" style={{ marginTop: 8 }}>Selected: {file.name}</div>}
      <button
        onClick={() => file && onAnalyze(file)}
        disabled={!file || loading}
        className="btn primary"
        style={{ marginTop: 12 }}
      >
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>
    </div>
  );
}

function ProfileAnalyzer({ onAnalyze, loading }: any) {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [followerCount, setFollowerCount] = useState('');
  const [followingCount, setFollowingCount] = useState('');
  const [postCount, setPostCount] = useState('');
  const [accountAge, setAccountAge] = useState('');

  const handleSubmit = () => {
    onAnalyze({
      username,
      bio,
      followerCount: parseInt(followerCount) || 0,
      followingCount: parseInt(followingCount) || 0,
      postCount: parseInt(postCount) || 0,
      accountAge,
      verified: false
    });
  };

  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="btn"
        style={{ width: '100%', textAlign: 'left' }}
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Bio/Description"
        className="btn"
        style={{ width: '100%', minHeight: 60, resize: 'vertical', textAlign: 'left' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <input
          type="number"
          value={followerCount}
          onChange={(e) => setFollowerCount(e.target.value)}
          placeholder="Followers"
          className="btn"
          style={{ textAlign: 'left' }}
        />
        <input
          type="number"
          value={followingCount}
          onChange={(e) => setFollowingCount(e.target.value)}
          placeholder="Following"
          className="btn"
          style={{ textAlign: 'left' }}
        />
      </div>
      <input
        type="number"
        value={postCount}
        onChange={(e) => setPostCount(e.target.value)}
        placeholder="Post Count"
        className="btn"
        style={{ width: '100%', textAlign: 'left' }}
      />
      <input
        type="text"
        value={accountAge}
        onChange={(e) => setAccountAge(e.target.value)}
        placeholder="Account Age (e.g., 2 years, 3 months)"
        className="btn"
        style={{ width: '100%', textAlign: 'left' }}
      />
      <button
        onClick={handleSubmit}
        disabled={!username.trim() || loading}
        className="btn primary"
      >
        {loading ? 'Analyzing...' : 'Analyze Profile'}
      </button>
    </div>
  );
}

function ResultsPanel({ session }: any) {
  if (session.evidence.length === 0) {
    return null;
  }

  return (
    <section className="card">
      <div className="kicker"><AlertTriangle size={16} /> Analysis Results</div>

      {session.threatCategory !== 'unknown' && (
        <div style={{ marginTop: 16, padding: 12, backgroundColor: 'var(--bg-secondary)', borderRadius: 6 }}>
          <div className="small" style={{ opacity: 0.7 }}>Threat Category</div>
          <div className="kicker" style={{ marginTop: 4, textTransform: 'capitalize' }}>
            {session.threatCategory.replace('_', ' ')}
          </div>
        </div>
      )}

      {session.patternMatches.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="small" style={{ fontWeight: 600, marginBottom: 8 }}>Pattern Matches</div>
          {session.patternMatches.map((pattern: any, index: number) => (
            <div key={index} className="card" style={{ marginTop: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div className="small" style={{ fontWeight: 600 }}>{pattern.patternName}</div>
                  <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>{pattern.description}</div>
                </div>
                <span className="badge">{Math.round(pattern.confidence * 100)}% match</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {session.crossReferences.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="small" style={{ fontWeight: 600, marginBottom: 8 }}>Cross-Reference Findings</div>
          {session.crossReferences.map((ref: any, index: number) => (
            <div key={index} className="card" style={{ marginTop: 8, padding: 12, backgroundColor: 'var(--bg-secondary)' }}>
              <div className="small">{ref.description}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <div className="small" style={{ fontWeight: 600, marginBottom: 8 }}>Evidence Analyzed ({session.evidence.length})</div>
        {session.evidence.map((evidence: any) => (
          <div key={evidence.id} className="card" style={{ marginTop: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="small" style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {evidence.type}
              </div>
              <span className="badge" style={{
                backgroundColor: evidence.riskLevel === 'high' ? 'rgb(239 68 68)' :
                               evidence.riskLevel === 'medium' ? 'rgb(251 146 60)' : 'rgb(34 197 94)',
                color: 'white'
              }}>
                {evidence.riskLevel}
              </span>
            </div>
            <div className="small" style={{ marginTop: 6, opacity: 0.7 }}>
              {evidence.signals.length} signals detected
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
