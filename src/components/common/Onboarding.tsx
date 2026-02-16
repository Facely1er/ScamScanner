import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const ONBOARDING_KEY = 'cyberstition_onboarding_complete';

const LOGO_SRC = '/cyberstition_logo.png';

export function useOnboarding() {
  const [complete, setComplete] = useState(false);
  const [checked, setChecked] = useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(ONBOARDING_KEY);
      setComplete(stored === 'true');
    } catch {
      setComplete(false);
    } finally {
      setChecked(true);
    }
  }, []);

  const finish = () => {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {}
    setComplete(true);
  };

  return { showOnboarding: checked && !complete, finishOnboarding: finish, ready: checked };
}

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    title: 'Detect Scams Before They Strike',
    body: 'Cyberstition analyzes messages, profiles, emails, and images for common scam patterns, phishing tactics, and manipulation techniques.',
  },
  {
    title: 'Guided Multi-Signal Analysis',
    body: 'Our guided scanner combines evidence from multiple sources to detect cross-signal patterns and provide a confidence-rated risk assessment.',
  },
  {
    title: 'Privacy First — Always',
    body: 'All analysis runs locally on your device. Nothing is uploaded, tracked, or shared. Your data stays yours.',
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const isLast = step === slides.length - 1;
  const slide = slides[step];

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div
      data-theme="dark"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div style={{
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
      }}>
        <div style={{
          width: 104,
          height: 104,
          borderRadius: 26,
          backgroundColor: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          animation: 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 8px 24px rgba(155,125,212,.35)',
        }}>
          <img src={LOGO_SRC} alt="" width={64} height={64} style={{ display: 'block', objectFit: 'contain' }} />
        </div>

        <h1 className="h2" style={{ margin: 0, fontSize: 28 }}>{slide.title}</h1>
        <p className="p" style={{ margin: 0, maxWidth: 380, fontSize: 16, lineHeight: 1.75 }}>{slide.body}</p>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }} role="tablist" aria-label="Onboarding steps">
          {slides.map((_, i) => (
            <div
              key={i}
              role="tab"
              aria-selected={i === step ? 'true' : 'false'}
              aria-label={`Step ${i + 1} of ${slides.length}`}
              style={{
                width: i === step ? 32 : 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: i === step ? 'var(--primary)' : 'var(--border)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: i === step ? '0 2px 8px rgba(155,125,212,.3)' : 'none',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 24, width: '100%' }}>
          {!isLast && (
            <button
              type="button"
              onClick={onComplete}
              className="btn"
              style={{
                flex: 1,
                padding: '14px 24px',
                minHeight: 48,
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Skip
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="btn primary"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '14px 28px',
              minHeight: 48,
              fontSize: 15,
              fontWeight: 600,
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ color: 'inherit' }}>{isLast ? 'Get Started' : 'Next'}</span>
            <ArrowRight size={18} strokeWidth={2.5} style={{ flexShrink: 0, color: 'inherit' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
