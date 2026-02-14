import React, { useState } from 'react';
import { useSessionStore } from '../../../state/sessionStore';
import { analyzeMessage, analyzeEmail, analyzeImage, analyzeProfile } from '../../../services/unifiedAnalyzer';
import {
  MessageSquare, Mail, Image as ImageIcon, User,
  CheckCircle, Circle, ArrowRight, Info, TrendingUp, Sparkles
} from 'lucide-react';

interface AnalysisWizardProps {
  onComplete: () => void;
}

export default function AnalysisWizard({ onComplete }: AnalysisWizardProps) {
  const {
    currentSession,
    addEvidence,
    getWorkflowSteps,
    getNextRecommendedStep
  } = useSessionStore();

  const [activeAnalyzer, setActiveAnalyzer] = useState<string | null>(null);
  const [showAllSteps, setShowAllSteps] = useState(false);

  if (!currentSession) return null;

  const workflowSteps = getWorkflowSteps();
  const nextStep = getNextRecommendedStep();
  const completedSteps = workflowSteps.filter(s => s.completed).length;
  const totalSteps = workflowSteps.length;

  const getSuggestedSteps = () => {
    if (showAllSteps) return workflowSteps;

    const suggestedSteps = workflowSteps.filter(step => {
      if (step.completed) return true;
      if (step.required && !step.completed) return true;
      if (nextStep && nextStep.id === step.id) return true;
      return false;
    });

    if (suggestedSteps.length === 0) {
      return workflowSteps.slice(0, 2);
    }

    return suggestedSteps;
  };

  const suggestedSteps = getSuggestedSteps();
  const hasMoreSteps = suggestedSteps.length < workflowSteps.length;

  const handleFinishEarly = () => {
    if (confirm('Are you ready to view results? You can always add more evidence later.')) {
      onComplete();
    }
  };

  return (
    <>
      <section className="card">
        <div className="kicker" style={{ marginBottom: 8 }}>Step 2 of 3</div>
        <h2 className="h2">Add Evidence for Analysis</h2>
        <p className="p" style={{ marginTop: 8 }}>
          Add different types of evidence to build a comprehensive assessment. The more evidence, the more accurate the analysis.
        </p>

        <div style={{
          marginTop: 20,
          padding: 16,
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="small" style={{ fontWeight: 600 }}>Progress</span>
              <span className="small" style={{ fontWeight: 600 }}>
                {completedSteps} of {totalSteps} completed
              </span>
            </div>
            <div style={{ height: 8, backgroundColor: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(completedSteps / totalSteps) * 100}%`,
                backgroundColor: 'var(--primary)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        {currentSession.confidence > 0 && (
          <div style={{
            marginTop: 16,
            padding: 16,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 8,
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <TrendingUp size={16} color="var(--primary)" />
              <span className="small" style={{ fontWeight: 600 }}>Current Assessment</span>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <div>
                <div className="small" style={{ opacity: 0.7 }}>Confidence</div>
                <div className="kicker" style={{ marginTop: 4 }}>
                  {Math.round(currentSession.confidence * 100)}%
                </div>
              </div>
              <div>
                <div className="small" style={{ opacity: 0.7 }}>Risk Level</div>
                <div className="kicker" style={{
                  marginTop: 4,
                  color: currentSession.overallRiskLevel === 'high' ? 'rgb(239 68 68)' :
                         currentSession.overallRiskLevel === 'medium' ? 'rgb(251 146 60)' : 'rgb(34 197 94)',
                  textTransform: 'capitalize'
                }}>
                  {currentSession.overallRiskLevel}
                </div>
              </div>
              <div>
                <div className="small" style={{ opacity: 0.7 }}>Risk Score</div>
                <div className="kicker" style={{ marginTop: 4 }}>
                  {currentSession.overallRiskScore}/100
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="kicker">
            <Sparkles size={16} /> Available Analyzers
          </div>
          {nextStep && (
            <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              {nextStep.label} recommended
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {suggestedSteps.map((step) => (
            <AnalyzerCard
              key={step.id}
              step={step}
              isNext={nextStep?.id === step.id}
              isActive={activeAnalyzer === step.type}
              onClick={() => setActiveAnalyzer(activeAnalyzer === step.type ? null : step.type)}
            />
          ))}
        </div>

        {hasMoreSteps && !showAllSteps && (
          <button
            onClick={() => setShowAllSteps(true)}
            className="btn"
            style={{ width: '100%', marginTop: 12 }}
          >
            Show All Analyzers ({workflowSteps.length - suggestedSteps.length} more)
          </button>
        )}

        {showAllSteps && hasMoreSteps && (
          <button
            onClick={() => setShowAllSteps(false)}
            className="btn"
            style={{ width: '100%', marginTop: 12 }}
          >
            Show Less
          </button>
        )}
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

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="kicker" style={{ marginBottom: 8 }}>
          <Info size={16} /> Ready to see results?
        </div>
        <p className="p">
          You can view results anytime, even with partial evidence. More evidence = more accurate assessment.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <button
            onClick={onComplete}
            className="btn primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            View Results <ArrowRight size={16} />
          </button>
          {completedSteps < totalSteps && (
            <button onClick={handleFinishEarly} className="btn">
              Skip Remaining
            </button>
          )}
        </div>
      </section>
    </>
  );
}

function AnalyzerCard({ step, isNext, isActive, onClick }: any) {
  const icons: Record<string, React.ReactNode> = {
    message: <MessageSquare size={20} />,
    email: <Mail size={20} />,
    image: <ImageIcon size={20} />,
    profile: <User size={20} />
  };

  const colors: Record<string, string> = {
    message: '#3b82f6',
    email: '#8b5cf6',
    image: '#10b981',
    profile: '#f59e0b'
  };

  const color = colors[step.type as string] || '#6b7280';

  return (
    <button
      onClick={onClick}
      className="card"
      style={{
        padding: 16,
        border: isNext ? `2px solid ${color}` : isActive ? `2px solid ${color}` : '1px solid var(--border)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        backgroundColor: isActive ? `${color}08` : 'var(--bg)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: 12, flex: 1 }}>
          {step.completed ? (
            <div style={{
              minWidth: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: 'rgb(34 197 94, 0.1)',
              color: 'rgb(34 197 94)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={22} />
            </div>
          ) : (
            <div style={{
              minWidth: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: `${color}15`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icons[step.type as string]}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div className="small" style={{ fontWeight: 600, marginBottom: 4 }}>
              {step.label}
            </div>
            <div className="small" style={{ opacity: 0.7, fontSize: '0.85rem' }}>
              {step.description}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          {isNext && <span className="badge" style={{ fontSize: '0.75rem' }}>Next</span>}
          {step.required && !step.completed && (
            <span className="badge" style={{ fontSize: '0.75rem', opacity: 0.6 }}>Recommended</span>
          )}
          {step.completed && (
            <span className="badge" style={{ fontSize: '0.75rem', backgroundColor: 'rgb(34 197 94)', color: 'white' }}>
              Done
            </span>
          )}
        </div>
      </div>
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

  const titles: Record<string, string> = {
    message: 'Analyze Message Content',
    email: 'Analyze Email Headers',
    image: 'Analyze Image Metadata',
    profile: 'Analyze Profile Information'
  };

  const icons: Record<string, React.ReactNode> = {
    message: <MessageSquare size={18} />,
    email: <Mail size={18} />,
    image: <ImageIcon size={18} />,
    profile: <User size={18} />
  };

  return (
    <section className="card" style={{ border: '2px solid var(--primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icons[type]}
          {titles[type]}
        </div>
        <button onClick={onClose} className="btn" style={{ minWidth: 'auto', padding: '6px 14px' }}>
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
    <div>
      <p className="small" style={{ marginBottom: 12, opacity: 0.8 }}>
        Paste the complete message text to analyze for scam patterns, urgency tactics, and manipulation techniques.
      </p>
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
    <div>
      <p className="small" style={{ marginBottom: 12, opacity: 0.8 }}>
        Paste email headers to check sender authenticity, routing paths, and spoofing indicators.
      </p>
      <textarea
        value={headers}
        onChange={(e) => setHeaders(e.target.value)}
        placeholder="Paste email headers here (View > Show Original in most email clients)..."
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
    <div>
      <p className="small" style={{ marginBottom: 12, opacity: 0.8 }}>
        Upload an image to inspect metadata, check for manipulation indicators, and verify authenticity.
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="btn"
        style={{ width: '100%' }}
      />
      {file && (
        <div className="small" style={{ marginTop: 8, padding: 8, backgroundColor: 'var(--bg-secondary)', borderRadius: 4 }}>
          Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </div>
      )}
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
    <div>
      <p className="small" style={{ marginBottom: 12, opacity: 0.8 }}>
        Enter profile information to check for fake account indicators and suspicious patterns.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
    </div>
  );
}
