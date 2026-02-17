import React, { useState, useEffect, useRef } from 'react';
import { useSessionStore } from '../../../state/sessionStore';
import { analyzeMessage, analyzeEmail, analyzeImage, analyzeProfile } from '../../../services/unifiedAnalyzer';
import {
  MessageSquare, Mail, Image as ImageIcon, User, Video,
  CheckCircle, ArrowRight, Info, TrendingUp, Sparkles
} from 'lucide-react';
import VideoAnalyzer from './VideoAnalyzer';
import type { EvidenceItem, WorkflowStep } from '../../../types/scan';

interface AnalysisWizardProps {
  onComplete: () => void;
}

interface AnalyzerCardProps {
  step: WorkflowStep;
  isNext: boolean;
  isActive: boolean;
  onClick: () => void;
}

interface AnalyzerPanelProps {
  type: string;
  onAnalyze: (evidence: EvidenceItem) => void;
  onClose: () => void;
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

    // Always show at least the top 4 priority steps to ensure video is visible
    if (suggestedSteps.length < 4) {
      const topSteps = workflowSteps.slice(0, 4);
      const uniqueSteps = [...new Map([...suggestedSteps, ...topSteps].map(s => [s.id, s])).values()];
      return uniqueSteps.sort((a, b) => a.priority - b.priority);
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
      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <div className="kicker" style={{ marginBottom: 6 }}>Step 2 of 3</div>
        <h2 className="h2" style={{ marginBottom: 10 }}>Add Evidence for Analysis</h2>
        <p className="p" style={{ marginTop: 10, lineHeight: 1.7 }}>
          Add different types of evidence to build a comprehensive assessment. The more evidence, the more accurate the analysis.
        </p>

        <div style={{
          marginTop: 24,
          padding: 18,
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 10,
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 18
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="small" style={{ fontWeight: 700, fontSize: 13 }}>Progress</span>
              <span className="small" style={{ fontWeight: 700, fontSize: 13 }}>
                {completedSteps} of {totalSteps} completed
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={completedSteps}
              aria-valuemin={0}
              aria-valuemax={totalSteps}
              aria-label={`Analysis progress: ${completedSteps} of ${totalSteps} steps completed`}
              style={{ height: 10, backgroundColor: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}
            >
              <div style={{
                height: '100%',
                width: `${(completedSteps / totalSteps) * 100}%`,
                backgroundColor: 'var(--primary)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 8px rgba(155,125,212,.3)'
              }} />
            </div>
          </div>
        </div>

        {currentSession.confidence > 0 && (
          <div style={{
            marginTop: 20,
            padding: 20,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 10,
            border: '1.5px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <TrendingUp size={18} color="var(--primary)" />
              <span className="small" style={{ fontWeight: 700, fontSize: 14 }}>Current Assessment</span>
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
              <div>
                <div className="small" style={{ opacity: 0.65, fontSize: 12, marginBottom: 4 }}>Confidence</div>
                <div style={{ 
                  fontSize: 20, 
                  fontWeight: 700,
                  color: 'var(--text)'
                }}>
                  {Math.round(currentSession.confidence * 100)}%
                </div>
              </div>
              <div>
                <div className="small" style={{ opacity: 0.65, fontSize: 12, marginBottom: 4 }}>Risk Level</div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: currentSession.overallRiskLevel === 'high' ? 'var(--error)' :
                         currentSession.overallRiskLevel === 'medium' ? 'var(--warning)' : 'var(--success)',
                  textTransform: 'capitalize'
                }}>
                  {currentSession.overallRiskLevel}
                </div>
              </div>
              <div>
                <div className="small" style={{ opacity: 0.65, fontSize: 12, marginBottom: 4 }}>Risk Score</div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text)'
                }}>
                  {currentSession.overallRiskScore}/100
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="card" style={{ border: '1.5px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
          <div className="kicker">
            <Sparkles size={16} /> Available Analyzers
          </div>
          {nextStep && (
            <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'white', fontSize: 11 }}>
              {nextStep.label} recommended
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
          onAnalyze={(evidence: EvidenceItem) => {
            addEvidence(evidence);
            setActiveAnalyzer(null);
          }}
          onClose={() => setActiveAnalyzer(null)}
        />
      )}

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--border)' }}>
        <div className="kicker" style={{ marginBottom: 6 }}>
          <Info size={16} /> Ready to see results?
        </div>
        <p className="p" style={{ lineHeight: 1.7 }}>
          You can view results anytime, even with partial evidence. More evidence = more accurate assessment.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <button
            onClick={onComplete}
            className="btn primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px' }}
          >
            View Results <ArrowRight size={18} />
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

function AnalyzerCard({ step, isNext, isActive, onClick }: AnalyzerCardProps) {
  const icons: Record<string, React.ReactNode> = {
    message: <MessageSquare size={20} />,
    email: <Mail size={20} />,
    image: <ImageIcon size={20} />,
    profile: <User size={20} />,
    video: <Video size={20} />
  };

  const colors: Record<string, string> = {
    message: '#3b82f6',
    email: '#8b5cf6',
    image: '#10b981',
    profile: '#f59e0b',
    video: '#ec4899'
  };

  const color = colors[step.type as string] || '#6b7280';

  return (
    <button
      onClick={onClick}
      className="card"
      style={{
        padding: 18,
        border: isNext ? `2px solid ${color}` : isActive ? `2px solid ${color}` : '1.5px solid var(--border)',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        textAlign: 'left',
        backgroundColor: isActive ? `${color}08` : 'var(--bg)',
        boxShadow: isActive ? `0 4px 16px ${color}15` : 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: 14, flex: 1 }}>
          {step.completed ? (
            <div style={{
              minWidth: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: 'rgba(16,185,129,0.12)',
              border: '2px solid var(--success)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(16,185,129,0.15)'
            }}>
              <CheckCircle size={24} strokeWidth={2.5} />
            </div>
          ) : (
            <div style={{
              minWidth: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: `${color}15`,
              border: `2px solid ${color}30`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icons[step.type as string]}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div className="small" style={{ fontWeight: 700, marginBottom: 5, fontSize: 14, color: 'var(--text)' }}>
              {step.label}
            </div>
            <div className="small" style={{ opacity: 0.7, fontSize: 13, lineHeight: 1.6 }}>
              {step.description}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          {isNext && <span className="badge" style={{ fontSize: 10 }}>Next</span>}
          {step.required && !step.completed && (
            <span className="badge" style={{ fontSize: 10, opacity: 0.8 }}>Recommended</span>
          )}
          {step.completed && (
            <span className="badge" style={{ fontSize: 10, backgroundColor: 'var(--success)', color: 'white', border: 'none' }}>
              Done
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function AnalyzerPanel({ type, onAnalyze, onClose }: AnalyzerPanelProps) {
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

  const handleProfileAnalyze = async (profileData: Record<string, unknown>) => {
    setLoading(true);
    const evidence = await analyzeProfile(profileData);
    onAnalyze(evidence);
    setLoading(false);
  };

  const handleVideoAnalyze = async (evidence: EvidenceItem) => {
    onAnalyze(evidence);
  };

  const titles: Record<string, string> = {
    message: 'Analyze Message Content',
    email: 'Analyze Email Headers',
    image: 'Analyze Image Metadata',
    profile: 'Analyze Profile Information',
    video: 'Analyze Video Metadata'
  };

  const icons: Record<string, React.ReactNode> = {
    message: <MessageSquare size={18} />,
    email: <Mail size={18} />,
    image: <ImageIcon size={18} />,
    profile: <User size={18} />,
    video: <Video size={18} />
  };

  return (
    <section className="card" style={{ border: '2px solid var(--primary)', boxShadow: '0 8px 24px rgba(155,125,212,.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 14, flexWrap: 'wrap' }}>
        <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
          {icons[type]}
          {titles[type]}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="small" style={{ opacity: 0.6, fontSize: 12 }}>Press Esc to close</span>
          <button onClick={onClose} className="btn" style={{ minWidth: 'auto', padding: '8px 16px' }}>
            Close
          </button>
        </div>
      </div>

      {type === 'message' && <MessageAnalyzer onAnalyze={handleMessageAnalyze} loading={loading} />}
      {type === 'email' && <EmailAnalyzer onAnalyze={handleEmailAnalyze} loading={loading} />}
      {type === 'image' && <ImageAnalyzer onAnalyze={handleImageAnalyze} loading={loading} />}
      {type === 'profile' && <ProfileAnalyzer onAnalyze={handleProfileAnalyze} loading={loading} />}
      {type === 'video' && <VideoAnalyzer onAnalyze={handleVideoAnalyze} loading={loading} />}
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
      <p className="small" style={{ marginBottom: 12, opacity: 0.8 }}>
        Paste the complete message text to analyze for scam patterns, urgency tactics, and manipulation techniques.
      </p>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste the message text here..."
        className="btn"
        style={{ width: '100%', minHeight: 120, resize: 'vertical', textAlign: 'left' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          className="btn primary"
        >
          {loading ? 'Analyzing...' : 'Analyze Message'}
        </button>
        <span className="small" style={{ opacity: 0.6 }}>Ctrl+Enter to analyze</span>
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
      <p className="small" style={{ marginBottom: 12, opacity: 0.8 }}>
        Paste email headers to check sender authenticity, routing paths, and spoofing indicators.
      </p>
      <textarea
        ref={textareaRef}
        value={headers}
        onChange={(e) => setHeaders(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste email headers here (View > Show Original in most email clients)..."
        className="btn"
        style={{ width: '100%', minHeight: 120, resize: 'vertical', textAlign: 'left' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={!headers.trim() || loading}
          className="btn primary"
        >
          {loading ? 'Analyzing...' : 'Analyze Headers'}
        </button>
        <span className="small" style={{ opacity: 0.6 }}>Ctrl+Enter to analyze</span>
      </div>
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
      <p className="small" style={{ marginBottom: 12, opacity: 0.8 }}>
        Enter profile information to check for fake account indicators and suspicious patterns.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          ref={usernameRef}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="submit"
            disabled={!username.trim() || loading}
            className="btn primary"
          >
            {loading ? 'Analyzing...' : 'Analyze Profile'}
          </button>
          <span className="small" style={{ opacity: 0.6 }}>Press Enter to analyze</span>
        </div>
      </form>
    </div>
  );
}
