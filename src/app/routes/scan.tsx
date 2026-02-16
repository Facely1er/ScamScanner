import React, { useState, useEffect } from 'react';
import { useSessionStore } from '../../state/sessionStore';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../../contexts/LocaleContext';
import ContextSelector from '../components/scan/ContextSelector';
import AnalysisWizard from '../components/scan/AnalysisWizard';
import ScanResults from '../components/scan/ScanResults';
import styles from './scan.module.css';

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
      <section className={`card scan-page-header ${styles.scanPageHeader}`}>
        <div>
          <div className={`kicker ${styles.kicker}`}>
            <Shield size={16} /> {t('scan.kicker')}
          </div>
          <h1 className={`h1 ${styles.title}`}>{t('scan.title')}</h1>
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
    <div className={styles.stepIndicatorContainer}>
      <div className="scan-step-indicator">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={styles.stepItem}>
              <div className={`${styles.stepCircle} ${index <= currentIndex ? styles.stepCircleActive : styles.stepCircleInactive}`}>
                {index < currentIndex ? <CheckCircle2 size={20} strokeWidth={2.5} /> : step.number}
              </div>
              <div className={styles.stepContent}>
                <span className={`small scan-step-label ${styles.stepLabel} ${
                  index === currentIndex 
                    ? styles.stepLabelCurrent 
                    : index < currentIndex 
                      ? styles.stepLabelCompleted 
                      : styles.stepLabelInactive
                }`}>
                  {step.label}
                </span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight 
                size={18} 
                className={`scan-step-arrow ${styles.stepArrow} ${index < currentIndex ? styles.stepArrowActive : styles.stepArrowInactive}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
