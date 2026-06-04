import React, { useState, useEffect } from 'react';
import { useSessionStore } from '../../state/sessionStore';
import { Shield, ArrowRight, Home, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ContextSelector from '../components/scan/ContextSelector';
import AnalysisWizard from '../components/scan/AnalysisWizard';
import ScanResults from '../components/scan/ScanResults';
import { canStartInvestigation, consumeInvestigation, getInvestigationStatus } from '../core/usageLimits';

type ScanStep = 'context' | 'analysis' | 'results';

export default function Scan() {
  const { currentSession, completeSession, clearCurrentSession, resumeSession } = useSessionStore();
  const [currentStep, setCurrentStep] = useState<ScanStep>('context');
  const [searchParams, setSearchParams] = useSearchParams();
  const status = getInvestigationStatus();

  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (sessionId) {
      resumeSession(sessionId);
      setSearchParams({}, { replace: true });
    }
  }, []);

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
    <div className="grid gap-20">
      <section className="card">
        <div className="d-flex justify-between items-center flex-wrap gap-12">
          <div>
            <div className="kicker d-flex items-center gap-8">
              <Shield size={16} /> Guided Scam Scanner
            </div>
            <h1 className="h1">Smart Analysis Workflow</h1>
          </div>
          <div className="d-flex items-center gap-10">
            <span className="small opacity-7">
              {status.remaining}/{status.limit} free this month
            </span>
            <Link to="/" className="btn d-flex items-center gap-8">
              <Home size={16} /> Home
            </Link>
          </div>
        </div>

        <StepIndicator currentStep={currentStep} />
      </section>

      {currentStep === 'context' && !canStartInvestigation() && (
        <section className="card notice-warning">
          <div className="info-row">
            <AlertTriangle size={20} className="text-orange-dark flex-shrink-0 mt-2" />
            <div>
              <div className="font-bold text-orange-dark mb-6">Monthly limit reached</div>
              <p className="small text-orange-dark mb-12">
                You've used all {status.limit} free investigations this month. Your limit resets on {new Date(status.resetAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
              </p>
              <Link to="/pricing" className="btn primary d-inline-flex items-center gap-8">
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

  const getCurrentIndex = () => steps.findIndex(s => s.id === currentStep);
  const currentIndex = getCurrentIndex();

  return (
    <div className="mt-20">
      <div className="d-flex items-center gap-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="d-flex items-center gap-8 flex-1">
              <div
                className="d-flex items-center justify-center font-semibold"
                style={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: index <= currentIndex ? 'var(--primary)' : 'var(--border)',
                  color: index <= currentIndex ? 'white' : 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}
              >
                {index < currentIndex ? <CheckCircle2 size={18} /> : step.number}
              </div>
              <div className="flex-1 d-flex flex-col">
                <span
                  className="small"
                  style={{
                    fontWeight: index === currentIndex ? 600 : 400,
                    color: index <= currentIndex ? 'var(--text)' : 'var(--text-secondary)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {step.label}
                </span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight
                size={16}
                style={{
                  color: index < currentIndex ? 'var(--primary)' : 'var(--border)',
                  transition: 'all 0.3s ease',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
