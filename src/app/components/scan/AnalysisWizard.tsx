import React, { useState, useEffect, useRef } from 'react';
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
    onComplete();
  };

  return (
    <>
      <section className="card">
        <div className="kicker mb-8">Step 2 of 3</div>
        <h2 className="h2">Add Evidence for Analysis</h2>
        <p className="p mt-8">
          Add different types of evidence to build a comprehensive assessment. The more evidence, the more accurate the analysis.
        </p>

        <div
          className="d-flex justify-between items-center gap-16 mt-20 p-16 bg-secondary"
          style={{ borderRadius: 8 }}
        >
          <div className="flex-1">
            <div className="d-flex justify-between mb-6">
              <span className="small font-semibold">Progress</span>
              <span className="small font-semibold">
                {completedSteps} of {totalSteps} completed
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {currentSession.confidence > 0 && (
          <div className="mt-16 p-16 bg-secondary" style={{ borderRadius: 8, border: '1px solid var(--border)' }}>
            <div className="d-flex items-center gap-8 mb-8">
              <TrendingUp size={16} color="var(--primary)" />
              <span className="small font-semibold">Current Assessment</span>
            </div>
            <div className="d-flex gap-16 mt-12">
              <div>
                <div className="small opacity-7">Confidence</div>
                <div className="kicker mt-4">
                  {Math.round(currentSession.confidence * 100)}%
                </div>
              </div>
              <div>
                <div className="small opacity-7">Risk Level</div>
                <div
                  className="kicker mt-4 capitalize"
                  style={{
                    color: currentSession.overallRiskLevel === 'high' ? 'rgb(239 68 68)' :
                           currentSession.overallRiskLevel === 'medium' ? 'rgb(251 146 60)' : 'rgb(34 197 94)',
                  }}
                >
                  {currentSession.overallRiskLevel}
                </div>
              </div>
              <div>
                <div className="small opacity-7">Risk Score</div>
                <div className="kicker mt-4">
                  {currentSession.overallRiskScore}/100
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <div className="d-flex justify-between items-center mb-16">
          <div className="kicker">
            <Sparkles size={16} /> Available Analyzers
          </div>
          {nextStep && (
            <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              {nextStep.label} recommended
            </span>
          )}
        </div>

        <div className="d-flex flex-col gap-12">
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
            className="btn w-full mt-12"
          >
            Show All Analyzers ({workflowSteps.length - suggestedSteps.length} more)
          </button>
        )}

        {showAllSteps && hasMoreSteps && (
          <button
            onClick={() => setShowAllSteps(false)}
            className="btn w-full mt-12"
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

      <section className="card card-secondary">
        <div className="kicker mb-8">
          <Info size={16} /> Ready to see results?
        </div>
        <p className="p">
          You can view results anytime, even with partial evidence. More evidence = more accurate assessment.
        </p>
        <div className="d-flex gap-12 mt-16 flex-wrap">
          <button
            onClick={onComplete}
            className="btn primary d-flex items-center gap-8"
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
      className="card cursor-pointer text-left"
      style={{
        padding: 16,
        border: isNext || isActive ? `2px solid ${color}` : '1px solid var(--border)',
        transition: 'all 0.2s ease',
        backgroundColor: isActive ? `${color}08` : 'var(--bg)',
      }}
    >
      <div className="d-flex justify-between items-start gap-12">
        <div className="d-flex items-start gap-12 flex-1">
          {step.completed ? (
            <div
              className="d-flex items-center justify-center"
              style={{
                minWidth: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: 'rgb(34 197 94)',
              }}
            >
              <CheckCircle size={22} />
            </div>
          ) : (
            <div
              className="d-flex items-center justify-center"
              style={{
                minWidth: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: `${color}15`,
                color: color,
              }}
            >
              {icons[step.type as string]}
            </div>
          )}
          <div className="flex-1">
            <div className="small font-semibold mb-4">
              {step.label}
            </div>
            <div className="small opacity-7" style={{ fontSize: '0.85rem' }}>
              {step.description}
            </div>
          </div>
        </div>
        <div className="d-flex flex-col gap-4 items-end">
          {isNext && <span className="badge" style={{ fontSize: '0.75rem' }}>Next</span>}
          {step.required && !step.completed && (
            <span className="badge opacity-6" style={{ fontSize: '0.75rem' }}>Recommended</span>
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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
      <div className="d-flex justify-between items-center mb-16 gap-12 flex-wrap">
        <div className="kicker d-flex items-center gap-8">
          {icons[type]}
          {titles[type]}
        </div>
        <div className="d-flex items-center gap-12">
          <span className="small opacity-6">Press Esc to close</span>
          <button onClick={onClose} className="btn min-w-auto p-6">
            Close
          </button>
        </div>
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (text.trim() && !loading) {
      onAnalyze(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <p className="small mb-12 opacity-8">
        Paste the complete message text to analyze for scam patterns, urgency tactics, and manipulation techniques.
      </p>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste the message text here..."
        className="btn w-full text-left"
        style={{ minHeight: 120, resize: 'vertical' }}
      />
      <div className="d-flex justify-between items-center mt-12">
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          className="btn primary"
        >
          {loading ? 'Analyzing...' : 'Analyze Message'}
        </button>
        <span className="small opacity-6">Ctrl+Enter to analyze</span>
      </div>
    </div>
  );
}

function EmailAnalyzer({ onAnalyze, loading }: any) {
  const [headers, setHeaders] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (headers.trim() && !loading) {
      onAnalyze(headers);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <p className="small mb-12 opacity-8">
        Paste email headers to check sender authenticity, routing paths, and spoofing indicators.
      </p>
      <textarea
        ref={textareaRef}
        value={headers}
        onChange={(e) => setHeaders(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste email headers here (View > Show Original in most email clients)..."
        className="btn w-full text-left"
        style={{ minHeight: 120, resize: 'vertical' }}
      />
      <div className="d-flex justify-between items-center mt-12">
        <button
          onClick={handleSubmit}
          disabled={!headers.trim() || loading}
          className="btn primary"
        >
          {loading ? 'Analyzing...' : 'Analyze Headers'}
        </button>
        <span className="small opacity-6">Ctrl+Enter to analyze</span>
      </div>
    </div>
  );
}

function ImageAnalyzer({ onAnalyze, loading }: any) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div>
      <p className="small mb-12 opacity-8">
        Upload an image to inspect metadata, check for manipulation indicators, and verify authenticity.
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="btn w-full"
      />
      {file && (
        <div className="small mt-8 p-8 bg-secondary" style={{ borderRadius: 4 }}>
          Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </div>
      )}
      <button
        onClick={() => file && onAnalyze(file)}
        disabled={!file || loading}
        className="btn primary mt-12"
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
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!username.trim() || loading) return;
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
      <p className="small mb-12 opacity-8">
        Enter profile information to check for fake account indicators and suspicious patterns.
      </p>
      <form onSubmit={handleSubmit} className="d-flex flex-col gap-12">
        <input
          ref={usernameRef}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="btn w-full text-left"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio/Description"
          className="btn w-full text-left"
          style={{ minHeight: 60, resize: 'vertical' }}
        />
        <div className="d-grid gap-12" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <input
            type="number"
            value={followerCount}
            onChange={(e) => setFollowerCount(e.target.value)}
            placeholder="Followers"
            className="btn text-left"
          />
          <input
            type="number"
            value={followingCount}
            onChange={(e) => setFollowingCount(e.target.value)}
            placeholder="Following"
            className="btn text-left"
          />
        </div>
        <input
          type="number"
          value={postCount}
          onChange={(e) => setPostCount(e.target.value)}
          placeholder="Post Count"
          className="btn w-full text-left"
        />
        <input
          type="text"
          value={accountAge}
          onChange={(e) => setAccountAge(e.target.value)}
          placeholder="Account Age (e.g., 2 years, 3 months)"
          className="btn w-full text-left"
        />
        <div className="d-flex justify-between items-center">
          <button
            type="submit"
            disabled={!username.trim() || loading}
            className="btn primary"
          >
            {loading ? 'Analyzing...' : 'Analyze Profile'}
          </button>
          <span className="small opacity-6">Press Enter to analyze</span>
        </div>
      </form>
    </div>
  );
}
