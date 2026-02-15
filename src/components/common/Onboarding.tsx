import React, { useState } from 'react';
import { Shield, Lock, Sparkles, ArrowRight } from 'lucide-react';

const ONBOARDING_KEY = 'cyberstition_onboarding_complete';

export function useOnboarding() {
  const [complete, setComplete] = useState(() => {
    return typeof window !== 'undefined' && window.localStorage.getItem(ONBOARDING_KEY) === 'true';
  });

  const finish = () => {
    window.localStorage.setItem(ONBOARDING_KEY, 'true');
    setComplete(true);
  };

  return { showOnboarding: !complete, finishOnboarding: finish };
}

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: <Shield size={48} />,
    title: 'Detect Scams Before They Strike',
    body: 'Cyberstition analyzes messages, profiles, emails, and images for common scam patterns, phishing tactics, and manipulation techniques.',
  },
  {
    icon: <Sparkles size={48} />,
    title: 'Guided Multi-Signal Analysis',
    body: 'Our guided scanner combines evidence from multiple sources to detect cross-signal patterns and provide a confidence-rated risk assessment.',
  },
  {
    icon: <Lock size={48} />,
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
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      backgroundColor: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      animation: 'fadeIn 0.4s ease-out',
    }}>
      <div style={{
        maxWidth: 400,
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}>
        <div style={{
          width: 96,
          height: 96,
          borderRadius: 24,
          backgroundColor: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          animation: 'scaleIn 0.4s ease-out',
        }}>
          {slide.icon}
        </div>

        <h1 className="h2" style={{ margin: 0 }}>{slide.title}</h1>
        <p className="p" style={{ margin: 0, maxWidth: 340 }}>{slide.body}</p>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }} role="tablist" aria-label="Onboarding steps">
          {slides.map((_, i) => (
            <div
              key={i}
              role="tab"
              aria-selected={i === step}
              aria-label={`Step ${i + 1} of ${slides.length}`}
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === step ? 'var(--primary)' : 'var(--border)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16, width: '100%' }}>
          {!isLast && (
            <button onClick={onComplete} className="btn" style={{ flex: 1 }}>
              Skip
            </button>
          )}
          <button onClick={handleNext} className="btn primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48 }}>
            {isLast ? 'Get Started' : 'Next'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
