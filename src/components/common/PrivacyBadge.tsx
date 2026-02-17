import React from 'react';
import { Shield, Cloud } from 'lucide-react';
import styles from './PrivacyBadge.module.css';

interface PrivacyBadgeProps {
  type: 'local' | 'cloud';
  className?: string;
}

export default function PrivacyBadge({ type, className = '' }: PrivacyBadgeProps) {
  const isLocal = type === 'local';
  
  return (
    <div className={`${styles.badge} ${isLocal ? styles.local : styles.cloud} ${className}`}>
      {isLocal ? (
        <>
          <Shield size={12} className={styles.icon} />
          <span className={styles.text}>100% Local</span>
        </>
      ) : (
        <>
          <Cloud size={12} className={styles.icon} />
          <span className={styles.text}>Cloud AI</span>
        </>
      )}
    </div>
  );
}
