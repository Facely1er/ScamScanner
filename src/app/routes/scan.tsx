import React, { useState, useEffect } from 'react';
import { useSessionStore } from '../../state/sessionStore';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../../contexts/LocaleContext';
import ContextSelector from '../components/scan/ContextSelector';
import AnalysisWizard from '../components/scan/AnalysisWizard';
import ScanResults from '../components/scan/ScanResults';

type ScanStep = 'context' | 'analysis' | 'results';

export default function Scan() {
  const { currentSession, completeSession, clearCurrentSession } = useSessionStore();
  const [currentStep, setCurrentStep] = useState<ScanStep>('context');
  const navigate = useNavigate();
  const { t } = useLocale();

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
    setCurrentStep('analysis');
  };

  const handleAnalysisComplete = () => {
    setCurrentStep('results');
  };

  const handleComplete = () => {
    completeSession();
    navigate('/dashboard');
  };

  const handleStartNew = () => {
    clearCurrentSession();
    setCurrentStep('context');
  };

  return (
    <div className="grid loose scan-page">
      <section className="card scan-page-header" style={{ border: '2px solid var(--border)' }}>
        <div>
          <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Shield size={16} /> {t('scan.kicker')}
          </div>
          <h1 className="h1" style={{ marginBottom: 0, paddingBottom: 0, border: 'none' }}>{t('scan.title')}</h1>
        </div>

        <StepIndicator currentStep={currentStep} />
      </section>

      {currentStep === 'context' && <ContextSelector onComplete={handleContextComplete} />}
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
  const { t } = useLocale();
  const steps = [
    { id: 'context', label: t('scan.stepContext'), number: 1 },
    { id: 'analysis', label: t('scan.stepEvidence'), number: 2 },
    { id: 'results', label: t('scan.stepResults'), number: 3 }
  ];

  const getCurrentIndex = () => {
    return steps.findIndex(s => s.id === currentStep);
  };

  const currentIndex = getCurrentIndex();

  return (
    <div style={{ marginTop: 28 }}>
      <div className="scan-step-indicator">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flex: '1 1 0',
              minWidth: 0
            }}>
              <div style={{
                flexShrink: 0,
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: index <= currentIndex ? 'var(--primary)' : 'var(--bg-secondary)',
                border: index <= currentIndex ? '2px solid var(--primary)' : '2px solid var(--border)',
                color: index <= currentIndex ? 'white' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 15,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: index <= currentIndex ? '0 2px 8px rgba(155,125,212,.25)' : 'none'
              }}>
                {index < currentIndex ? <CheckCircle2 size={20} strokeWidth={2.5} /> : step.number}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <span className="small scan-step-label" style={{
                  fontWeight: index === currentIndex ? 700 : index < currentIndex ? 600 : 500,
                  fontSize: index === currentIndex ? 14 : 13,
                  color: index <= currentIndex ? 'var(--text)' : 'var(--text-muted)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  {step.label}
                </span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight size={18} className="scan-step-arrow" style={{
                color: index < currentIndex ? 'var(--primary)' : 'var(--border)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
