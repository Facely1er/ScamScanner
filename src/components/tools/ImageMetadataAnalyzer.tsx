import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Image, Upload, AlertTriangle, ShieldCheck, XCircle, Info } from 'lucide-react';
import { analyzeImageMetadata, getImageRiskLevel } from '../../utils/imageMetadataAnalyzer';
import { mapImageAnalysisToAlert } from '../../mappers/imageToCautionAlert';
import { useCautionStore } from '../../state/cautionStore';

const s = {
  wrap: { maxWidth: 768 } as React.CSSProperties,
  card: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 16,
  } as React.CSSProperties,
  resultCard: (color: string) => ({
    border: `2px solid ${color}`,
    borderRadius: 12,
    padding: '20px 24px',
    background: 'var(--bg-secondary)',
    marginBottom: 16,
  } as React.CSSProperties),
  infoBox: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 16,
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  } as React.CSSProperties,
  dropZone: (isDragging: boolean) => ({
    border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`,
    borderRadius: 10,
    padding: '48px 24px',
    textAlign: 'center' as const,
    background: isDragging ? 'var(--bg)' : 'transparent',
    cursor: 'pointer',
  } as React.CSSProperties),
  subCard: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '12px 16px',
    marginBottom: 12,
  } as React.CSSProperties,
  eduBox: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '16px 20px',
    marginTop: 24,
  } as React.CSSProperties,
};

const ImageMetadataAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const addAlert = useCautionStore((st) => st.addAlert);

  const processFile = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) { setError('Please select an image file'); return; }
    if (selectedFile.size > 50 * 1024 * 1024) { setError('File size must be less than 50MB'); return; }
    setFile(selectedFile);
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  }, []);

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (file) return;
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) processFile(new File([blob], 'pasted-image.png', { type: blob.type }));
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [file, processFile]);

  useEffect(() => {
    const dz = dropZoneRef.current;
    if (!dz) return;
    const over = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const leave = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const drop = (e: DragEvent) => {
      e.preventDefault(); e.stopPropagation(); setIsDragging(false);
      const f = e.dataTransfer?.files;
      if (f && f.length > 0) processFile(f[0]);
    };
    dz.addEventListener('dragover', over);
    dz.addEventListener('dragleave', leave);
    dz.addEventListener('drop', drop);
    return () => { dz.removeEventListener('dragover', over); dz.removeEventListener('dragleave', leave); dz.removeEventListener('drop', drop); };
  }, [processFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeImageMetadata(file);
      setResult(analysis);
      if (analysis.isSuspicious) {
        const alert = mapImageAnalysisToAlert(analysis, { id: `img-${Date.now()}`, fileName: file.name });
        if (alert) addAlert(alert);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => { setFile(null); setPreview(null); setResult(null); setError(null); };

  const riskLevel = result ? getImageRiskLevel(result.riskScore) : null;
  const riskColor = result
    ? result.isSuspicious
      ? result.riskScore >= 70 ? 'var(--danger, #ef4444)' : '#f97316'
      : '#22c55e'
    : 'var(--border)';

  return (
    <div style={s.wrap}>
      <div style={{ marginBottom: 20 }}>
        <p className="p" style={{ marginBottom: 12 }}>
          Upload an image to analyze its metadata for signs of manipulation or suspicious patterns
        </p>
        <div style={s.infoBox}>
          <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
          <p className="small" style={{ margin: 0 }}>
            <strong>Privacy First:</strong> All analysis happens in your browser. Your image never leaves your device.
          </p>
        </div>
      </div>

      <div style={s.card}>
        {!preview ? (
          <div ref={dropZoneRef} style={s.dropZone(isDragging)}>
            <Upload size={40} style={{ color: 'var(--text-secondary)', margin: '0 auto 12px' }} />
            <label style={{ cursor: 'pointer' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 500 }}>Click to upload an image</span>
              <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
            </label>
            <p className="small" style={{ marginTop: 8, color: 'var(--text-secondary)' }}>
              JPG, PNG, GIF, WebP up to 50MB · Or drag & drop · Or paste from clipboard
            </p>
          </div>
        ) : (
          <div>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, border: '1px solid var(--border)', display: 'block' }}
              />
              <button
                onClick={handleClear}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  background: '#ef4444', border: 'none', borderRadius: '50%',
                  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff',
                }}
              >
                <XCircle size={18} />
              </button>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn primary"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6, opacity: isAnalyzing ? 0.6 : 1 }}
            >
              <Image size={14} /> {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </div>
        )}

        {error && (
          <div style={{ marginTop: 12, background: 'var(--bg)', border: '1px solid #ef4444', borderRadius: 8, padding: '10px 14px' }}>
            <p className="small" style={{ margin: 0, color: '#ef4444' }}>{error}</p>
          </div>
        )}
      </div>

      {result && (
        <div style={s.resultCard(riskColor)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            {result.isSuspicious
              ? <AlertTriangle size={28} style={{ color: riskColor, flexShrink: 0 }} />
              : <ShieldCheck size={28} style={{ color: '#22c55e', flexShrink: 0 }} />}
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: riskColor }}>
                {result.isSuspicious
                  ? result.riskScore >= 70 ? '🚨 CRITICAL RISK' : '⚠️ HIGH RISK'
                  : '✓ Low Risk'}
              </p>
              <p className="small" style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Risk Score: <strong>{result.riskScore}%</strong> ({riskLevel})
              </p>
            </div>
          </div>

          {result.issues.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p className="small" style={{ fontWeight: 600, marginBottom: 6 }}>Detected Issues:</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {result.issues.map((issue: string, i: number) => (
                  <li key={i} className="small" style={{ display: 'flex', gap: 6 }}>
                    <span style={{ color: '#ef4444' }}>•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={s.subCard}>
            <p className="small" style={{ fontWeight: 600, marginBottom: 6 }}>Metadata Information:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
              <p className="small" style={{ margin: 0 }}>
                <span style={{ color: 'var(--text-secondary)' }}>EXIF Data:</span>{' '}
                <strong>{result.metadata.hasExif ? 'Yes' : 'No'}</strong>
              </p>
              {result.metadata.dimensions && (
                <p className="small" style={{ margin: 0 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Dimensions:</span>{' '}
                  <strong>{result.metadata.dimensions.width} × {result.metadata.dimensions.height}</strong>
                </p>
              )}
              {result.metadata.format && (
                <p className="small" style={{ margin: 0 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Format:</span>{' '}
                  <strong>{result.metadata.format}</strong>
                </p>
              )}
              {result.metadata.fileSize && (
                <p className="small" style={{ margin: 0 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>File Size:</span>{' '}
                  <strong>{(result.metadata.fileSize / 1024).toFixed(1)} KB</strong>
                </p>
              )}
              {result.metadata.device && (
                <p className="small" style={{ margin: 0, gridColumn: '1 / -1' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Device:</span>{' '}
                  <strong>{result.metadata.device}</strong>
                </p>
              )}
              {result.metadata.software && (
                <p className="small" style={{ margin: 0, gridColumn: '1 / -1' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Software:</span>{' '}
                  <strong>{result.metadata.software}</strong>
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="small" style={{ fontWeight: 600, marginBottom: 6 }}>Recommendations:</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {result.recommendations.map((rec: string, i: number) => (
                <li key={i} className="small">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div style={s.eduBox}>
        <p className="small" style={{ fontWeight: 600, marginBottom: 8 }}>💡 What to look for:</p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[
            'Missing or manipulated EXIF metadata',
            'Future dates in creation timestamps',
            'Editing software signatures',
            'Unusual dimensions or file sizes',
            'Always verify images through reverse image search',
          ].map((item) => (
            <li key={item} className="small" style={{ color: 'var(--text-secondary)' }}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ImageMetadataAnalyzer;
