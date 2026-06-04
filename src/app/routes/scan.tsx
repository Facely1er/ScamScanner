import React, { useState, useEffect } from 'react';
import { useSessionStore } from '../../state/sessionStore';
import { Shield, ArrowRight, Home, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContextSelector from '../components/scan/ContextSelector';
import AnalysisWizard from '../components/scan/AnalysisWizard';
import ScanResults from '../components/scan/ScanResults';
import { canStartInvestigation, consumeInvestigation, getInvestigationStatus } from '../core/usageLimits';

type ScanStep = 'context' | 'analysis' | 'results';

export default function Scan() {
  const { currentSession, completeSession, clearCurrentSession } = useSessionStore();
  const [currentStep, setCurrentStep] = useState<ScanStep>('context');
  const status = getInvestigationStatus();

  useEffect(() => {
    if (!currentSession) {
      setCurrentStep('context');
    } else if (currentSession.completionPercentage >= 100) {
      setCurrentStep('results');
    } else {
      setCurrentStep('analysis');
    }
  }, [currentSession]);

  const handleContextComplete = () => {
    consumeInvestigation();
    setCurrentStep('analysis');
  };

  const handleAnalysisComplete = () => {
    setCurrentStep('results');
  };

  const handleComplete = () => {
    completeSession();
    window.location.href = '/dashboard';
  };

  const handleStartNew = () => {
    clearCurrentSession();
    setCurrentStep('context');
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={16} /> Guided Scam Scanner
            </div>
            <h1 className="h1">Smart Analysis Workflow</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="small" style={{ opacity: 0.7 }}>
              {status.remaining}/{status.limit} free this month
            </span>
            <Link to="/" className="btn" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Home size={16} /> Home
            </Link>
          </div>
        </div>

        <StepIndicator currentStep={currentStep} />
      </section>

      {currentStep === 'context' && !canStartInvestigation() && (
        <section className="card" style={{ border: '2px solid rgb(251 146 60)', backgroundColor: 'rgb(255 247 237)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <AlertTriangle size={20} style={{ color: 'rgb(234 88 12)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, color: 'rgb(154 52 18)', marginBottom: 6 }}>Monthly limit reached</div>
              <p className="small" style={{ color: 'rgb(154 52 18)', marginBottom: 12 }}>
                You've used all {status.limit} free investigations this month. Your limit resets on {new Date(status.resetAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
              </p>
              <Link to="/pricing" className="btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      )}

      {currentStep === 'context' && canStartInvestigation() && <ContextSelector onComplete={handleContextComplete} />}
      {currentStep === 'analysis' && <AnalysisWizard onComplete={handleAnalysisComplete} />}
      {currentStep === 'results' && (
        <ScanResults
          session={currentSession!}
          onComplete={handleComplete}
          onStartNew={handleStartNew}
        />
      )}
    </div>
  );
}

function StepIndicator({ currentStep }: { currentStep: ScanStep }) {
  const steps = [
    { id: 'context', label: 'Provide Context', number: 1 },
    { id: 'analysis', label: 'Add Evidence', number: 2 },
    { id: 'results', label: 'View Results', number: 3 }
  ];

  const getCurrentIndex = () => {
    return steps.findIndex(s => s.id === currentStep);
  };

  const currentIndex = getCurrentIndex();

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flex: 1
            }}>
              <div style={{
                minWidth: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: index <= currentIndex ? 'var(--primary)' : 'var(--border)',
                color: index <= currentIndex ? 'white' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}>
                {index < currentIndex ? <CheckCircle2 size={18} /> : step.number}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span className="small" style={{
                  fontWeight: index === currentIndex ? 600 : 400,
                  color: index <= currentIndex ? 'var(--text)' : 'var(--text-secondary)',
                  transition: 'all 0.3s ease'
                }}>
                  {step.label}
                </span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight size={16} style={{
                color: index < currentIndex ? 'var(--primary)' : 'var(--border)',
                transition: 'all 0.3s ease'
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
