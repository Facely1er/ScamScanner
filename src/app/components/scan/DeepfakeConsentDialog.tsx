import React, { useState, useEffect } from 'react';
import { X, Lock, Shield, Trash2, FileText } from 'lucide-react';
import styles from './DeepfakeConsentDialog.module.css';

interface DeepfakeConsentDialogProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const CONSENT_KEY = 'deepfake_consent_given';

export function useDeepfakeConsent() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      setConsentGiven(stored === 'true');
    } catch {
      setConsentGiven(false);
    } finally {
      setChecked(true);
    }
  }, []);

  const giveConsent = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(CONSENT_KEY, 'true');
      }
    } catch {}
    setConsentGiven(true);
  };

  const revokeConsent = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(CONSENT_KEY);
      }
    } catch {}
    setConsentGiven(false);
  };

  return { consentGiven, giveConsent, revokeConsent, checked };
}

export default function DeepfakeConsentDialog({ isOpen, onAccept, onDecline }: DeepfakeConsentDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onDecline}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>🔒 Privacy & Consent Notice</h2>
          <button 
            onClick={onDecline} 
            className={styles.closeButton}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.notice}>
            <p className={styles.intro}>
              <strong>Deepfake detection is a premium feature that requires uploading your video</strong> 
              to our secure AI analysis partner for processing.
            </p>
          </div>

          <div className={styles.privacyGuarantees}>
            <h3 className={styles.sectionTitle}>Privacy Guarantees</h3>
            
            <div className={styles.guarantee}>
              <Lock size={18} className={styles.icon} />
              <div>
                <strong>Encrypted Upload</strong>
                <p className="small">Videos are transmitted using industry-standard TLS encryption</p>
              </div>
            </div>

            <div className={styles.guarantee}>
              <Trash2 size={18} className={styles.icon} />
              <div>
                <strong>Automatic Deletion</strong>
                <p className="small">Videos are permanently deleted within 24 hours of analysis</p>
              </div>
            </div>

            <div className={styles.guarantee}>
              <Shield size={18} className={styles.icon} />
              <div>
                <strong>No Training Data</strong>
                <p className="small">Your videos are never used to train AI models or shared with third parties</p>
              </div>
            </div>

            <div className={styles.guarantee}>
              <FileText size={18} className={styles.icon} />
              <div>
                <strong>Limited Processing</strong>
                <p className="small">Only video data is uploaded - no personal information or device data</p>
              </div>
            </div>
          </div>

          <div className={styles.comparison}>
            <div className={styles.comparisonItem}>
              <div className={styles.badge}>Free Tier</div>
              <p className="small">
                ✓ All basic features run <strong>100% locally</strong> on your device
                <br />
                ✓ Messages, profiles, emails, image/video metadata
                <br />
                ✓ Zero uploads, complete privacy
              </p>
            </div>
            <div className={styles.comparisonItem}>
              <div className={`${styles.badge} ${styles.premium}`}>Premium AI</div>
              <p className="small">
                ⚠️ Deepfake detection requires cloud processing
                <br />
                ✓ Opt-in only with explicit consent
                <br />
                ✓ Strong privacy protections in place
              </p>
            </div>
          </div>

          <div className={styles.warning}>
            <p className="small">
              By clicking "I Accept", you consent to uploading videos for deepfake analysis. 
              You can disable this feature at any time by unchecking the deepfake detection option.
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={onDecline} className={`btn ${styles.declineButton}`}>
            Cancel
          </button>
          <button onClick={onAccept} className={`btn primary ${styles.acceptButton}`}>
            I Accept & Understand
          </button>
        </div>
      </div>
    </div>
  );
}
