import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export default function LoadingSpinner({ size = 20, className = '', label = 'Loading' }: LoadingSpinnerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div 
        className={`loading-spinner ${className}`}
        style={{ width: size, height: size }}
        aria-label={label}
        role="status"
        aria-live="polite"
      />
      {label && (
        <p className="small" style={{ margin: 0 }}>{label}</p>
      )}
    </div>
  );
}

