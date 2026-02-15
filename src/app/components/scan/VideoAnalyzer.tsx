import React, { useState, useEffect } from 'react';
import { analyzeVideo } from '../../../services/unifiedAnalyzer';
import { isFeatureEnabledSync } from '../../../config/features';
import { deepfakeDetector } from '../../../services/deepfakeDetector';
import { Video, AlertTriangle } from 'lucide-react';

interface VideoAnalyzerProps {
  onAnalyze: (evidence: any) => void;
  loading: boolean;
}

export default function VideoAnalyzer({ onAnalyze, loading }: VideoAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [deepfakeEnabled, setDeepfakeEnabled] = useState(false);
  
  const deepfakeAvailable = isFeatureEnabledSync('DEEPFAKE_DETECTION') && 
                            deepfakeDetector.isAvailable();

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
        enableDeepfake: deepfakeEnabled && deepfakeAvailable
      });
      onAnalyze(evidence);
    } catch (error: any) {
      setError(error.message || 'Analysis failed');
    }
  };

  return (
    <div>
      <p className="small" style={{ marginBottom: 12, opacity: 0.8 }}>
        Upload a video to inspect metadata and file characteristics.
        {deepfakeAvailable && ' Deepfake detection is available for premium users.'}
      </p>

      {deepfakeAvailable && (
        <div style={{
          marginBottom: 12,
          padding: 12,
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 8,
          border: '1px solid var(--border)'
        }}>
          <div className="small" style={{ marginBottom: 8, fontWeight: 600 }}>
            ⚠️ Limitations & Credibility
          </div>
          <ul className="small" style={{ margin: 0, paddingLeft: 20, opacity: 0.8 }}>
            <li>Maximum file size: 100MB</li>
            <li>Maximum duration: 10 minutes recommended</li>
            <li>Supported formats: MP4, WebM, MOV, OGG</li>
            <li>Deepfake detection requires API access</li>
            <li>Results are heuristic indicators, not definitive proof</li>
          </ul>
        </div>
      )}

      <input
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/ogg"
        onChange={handleFileChange}
        className="btn"
        style={{ width: '100%' }}
      />

      {error && (
        <div className="small" style={{
          marginTop: 8,
          padding: 8,
          backgroundColor: 'rgb(239 68 68 / 0.1)',
          borderRadius: 4,
          color: 'rgb(239 68 68)'
        }}>
          {error}
        </div>
      )}

      {file && !error && (
        <div style={{ marginTop: 12 }}>
          <div className="small" style={{
            marginBottom: 8,
            padding: 8,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 4
          }}>
            Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </div>
          {preview && (
            <video
              src={preview}
              controls
              style={{
                width: '100%',
                maxHeight: 300,
                borderRadius: 8,
                backgroundColor: 'var(--bg-secondary)'
              }}
            />
          )}
        </div>
      )}

      {/* Deepfake option - only shown if feature is enabled */}
      {deepfakeAvailable && (
        <div style={{
          marginTop: 12,
          padding: 12,
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 8,
          border: '1px solid var(--primary)'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={deepfakeEnabled}
              onChange={(e) => setDeepfakeEnabled(e.target.checked)}
            />
            <div>
              <div className="small" style={{ fontWeight: 600 }}>
                🔍 Enable Deepfake Detection (Premium)
              </div>
              <div className="small" style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                Advanced AI analysis to detect synthetic/manipulated videos
              </div>
            </div>
          </label>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!file || loading || !!error}
        className="btn primary"
        style={{ marginTop: 12 }}
      >
        {loading ? 'Analyzing...' : 'Analyze Video'}
      </button>
    </div>
  );
}

