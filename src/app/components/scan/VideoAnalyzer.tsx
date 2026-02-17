import React, { useState, useEffect } from 'react';
import { analyzeVideo } from '../../../services/unifiedAnalyzer';
import { isFeatureEnabledSync } from '../../../config/features';
import { deepfakeDetector } from '../../../services/deepfakeDetector';
import { Video, CheckCircle } from 'lucide-react';
import { IS_APP_BUILD } from '../../../config/env';
import DeepfakeConsentDialog, { useDeepfakeConsent } from './DeepfakeConsentDialog';
import PrivacyBadge from '../../../components/common/PrivacyBadge';
import styles from './VideoAnalyzer.module.css';

interface VideoAnalyzerProps {
  onAnalyze: (evidence: any) => void;
  loading: boolean;
}

export default function VideoAnalyzer({ onAnalyze, loading }: VideoAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [deepfakeEnabled, setDeepfakeEnabled] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  
  const { consentGiven, giveConsent, checked } = useDeepfakeConsent();
  const deepfakeAvailable = isFeatureEnabledSync('DEEPFAKE_DETECTION') && 
                            deepfakeDetector.isAvailable();
  
  const deepfakeConfigured = isFeatureEnabledSync('DEEPFAKE_DETECTION');
  const isAppBuild = IS_APP_BUILD;

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validation
    if (!selectedFile.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File too large. Maximum size: 100MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create preview
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      const evidence = await analyzeVideo(file, {
        enableDeepfake: deepfakeEnabled && deepfakeAvailable && consentGiven
      });
      onAnalyze(evidence);
    } catch (error: any) {
      setError(error.message || 'Analysis failed');
    }
  };

  const handleDeepfakeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    
    if (isChecked && !consentGiven) {
      // Show consent dialog on first enable
      setShowConsentDialog(true);
    } else {
      setDeepfakeEnabled(isChecked);
    }
  };

  const handleConsentAccept = () => {
    giveConsent();
    setDeepfakeEnabled(true);
    setShowConsentDialog(false);
  };

  const handleConsentDecline = () => {
    setDeepfakeEnabled(false);
    setShowConsentDialog(false);
  };

  return (
    <div>
      {/* Consent Dialog */}
      <DeepfakeConsentDialog
        isOpen={showConsentDialog}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />

      {/* Feature Status Banner */}
      <div className={`${styles.featureStatusBanner} ${deepfakeAvailable ? styles.available : styles.basic}`}>
        {deepfakeAvailable ? (
          <CheckCircle size={20} color="var(--success)" className={styles.icon} />
        ) : (
          <Video size={20} color="var(--primary)" className={styles.icon} />
        )}
        <div className={styles.bannerContent}>
          <div className={`small ${styles.bannerTitle}`}>
            {deepfakeAvailable ? '✨ Deepfake Detection Enabled' : '📹 Basic Video Analysis'}
            {' '}
            <PrivacyBadge type="local" />
            {deepfakeAvailable && deepfakeEnabled && <PrivacyBadge type="cloud" />}
          </div>
          <div className={`small ${styles.bannerDescription}`}>
            {deepfakeAvailable ? (
              'Premium AI-powered deepfake detection is active and ready to use.'
            ) : !isAppBuild ? (
              'Deepfake detection requires the app build. Basic metadata analysis is available.'
            ) : !deepfakeConfigured ? (
              'Configure VITE_DEEPFAKE_API_KEY in .env to enable deepfake detection.'
            ) : (
              'Basic video metadata analysis is available.'
            )}
          </div>
        </div>
      </div>

      <p className={`small ${styles.description}`}>
        Upload a video to inspect metadata and file characteristics.
        {deepfakeAvailable && ' Advanced deepfake detection available.'}
      </p>

      {deepfakeAvailable && (
        <div className={styles.limitationsBox}>
          <div className={`small ${styles.limitationsTitle}`}>
            ⚠️ Limitations & Credibility
          </div>
          <ul className={`small ${styles.limitationsList}`}>
            <li>Maximum file size: 100MB</li>
            <li>Maximum duration: 10 minutes recommended</li>
            <li>Supported formats: MP4, WebM, MOV, OGG</li>
            <li>Deepfake detection requires API access</li>
            <li>Results are heuristic indicators, not definitive proof</li>
          </ul>
        </div>
      )}

      <label htmlFor="video-file-input" className={styles.fileInputLabel}>
        <input
          id="video-file-input"
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/ogg"
          onChange={handleFileChange}
          className={`btn ${styles.fileInput}`}
          aria-label="Upload video file for analysis"
        />
      </label>

      {error && (
        <div className={`small ${styles.errorMessage}`}>
          {error}
        </div>
      )}

      {file && !error && (
        <div className={styles.filePreviewContainer}>
          <div className={`small ${styles.fileInfo}`}>
            Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </div>
          {preview && (
            <video
              src={preview}
              controls
              className={styles.videoPreview}
            />
          )}
        </div>
      )}

      {/* Deepfake option - only shown if feature is enabled */}
      {deepfakeAvailable && (
        <div className={styles.deepfakeOption}>
          {/* Privacy Notice */}
          <div className={styles.privacyNotice}>
            <div className={`small ${styles.privacyIcon}`}>🔒</div>
            <div className={`small ${styles.privacyText}`}>
              <strong>Privacy Notice:</strong> Deepfake detection requires uploading your video to our secure AI partner. 
              Videos are encrypted in transit, processed immediately, and deleted within 24 hours. Not used for training.
            </div>
          </div>
          
          <label className={styles.deepfakeLabel}>
            <input
              type="checkbox"
              checked={deepfakeEnabled}
              onChange={handleDeepfakeToggle}
            />
            <div>
              <div className={`small ${styles.deepfakeTitle}`}>
                🔍 Enable Deepfake Detection (Premium)
              </div>
              <div className={`small ${styles.deepfakeDescription}`}>
                Advanced AI analysis to detect synthetic/manipulated videos
              </div>
            </div>
          </label>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!file || loading || !!error}
        className={`btn primary ${styles.analyzeButton}`}
      >
        {loading ? 'Analyzing...' : 'Analyze Video'}
      </button>
    </div>
  );
}

