import React, { useState, useEffect } from 'react';
import { analyzeVideo } from '../../../services/unifiedAnalyzer';
import { Video, ExternalLink, Search } from 'lucide-react';
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
      const evidence = await analyzeVideo(file);
      onAnalyze(evidence);
    } catch (error: any) {
      setError(error.message || 'Analysis failed');
    }
  };

  return (
    <div>
      {/* Feature Status Banner */}
      <div className={`${styles.featureStatusBanner} ${styles.basic}`}>
        <Video size={20} color="var(--primary)" className={styles.icon} />
        <div className={styles.bannerContent}>
          <div className={`small ${styles.bannerTitle}`}>
            Video Metadata Analysis <PrivacyBadge type="local" />
          </div>
          <div className={`small ${styles.bannerDescription}`}>
            Analyze video metadata locally on your device. No uploads required.
          </div>
        </div>
      </div>

      <p className={`small ${styles.description}`}>
        Upload a video to inspect metadata and file characteristics including format, duration, dimensions, and file properties.
      </p>

      {/* Deepfake Web Service Link */}
      <div className={styles.externalServiceBox}>
        <div className={`small ${styles.externalServiceTitle}`}>
          <Search size={16} className={styles.inlineIcon} aria-hidden /> Need Deepfake Detection?
        </div>
        <p className={`small ${styles.externalServiceDescription}`}>
          Advanced AI-powered deepfake detection is available through our web service.
        </p>
        <a 
          href="https://cyberstition.app/deepfake-checker" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`btn ${styles.externalServiceButton}`}
        >
          Use Web Service <ExternalLink size={14} style={{ marginLeft: 6 }} />
        </a>
        <p className={`small ${styles.externalServiceNote}`}>
          Note: Web service requires video upload. Separate privacy policy applies.
        </p>
      </div>

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

      <button
        onClick={handleAnalyze}
        disabled={!file || loading || !!error}
        className={`btn primary ${styles.analyzeButton}`}
      >
        {loading ? 'Analyzing...' : 'Analyze Video Metadata'}
      </button>
    </div>
  );
}

