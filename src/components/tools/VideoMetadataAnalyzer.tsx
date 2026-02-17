// Video Metadata Analyzer Component
// Analyzes video files for metadata and deepfake detection

import React from 'react';
import { Info } from 'lucide-react';
import VideoAnalyzer from '../../app/components/scan/VideoAnalyzer';
import { showToast } from '../common/Toast';

const VideoMetadataAnalyzer: React.FC = () => {
  const handleAnalyze = (evidence: any) => {
    showToast(
      evidence.riskLevel === 'high' 
        ? `Video flagged: ${evidence.riskScore}% risk` 
        : 'Analysis complete',
      evidence.riskLevel === 'high' ? 'warning' : 'success'
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Privacy Notice */}
      <div className="info-box primary" style={{ marginBottom: 24 }}>
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="info-box-text text-blue-900 dark:text-blue-200" style={{ margin: 0 }}>
              <span className="font-semibold">Privacy First:</span>{' '}
              Video metadata analysis happens locally in your browser. Deepfake detection (when available) uses secure API calls.
            </p>
          </div>
        </div>
      </div>

      {/* VideoAnalyzer Component */}
      <VideoAnalyzer onAnalyze={handleAnalyze} loading={false} />

      {/* Educational Footer */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💡 What this tool checks:</h3>
        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>Video metadata and properties</li>
          <li>File format and codec information</li>
          <li>Creation and modification timestamps</li>
          <li>Deepfake detection patterns (when enabled)</li>
          <li>AI-generated content indicators</li>
          <li>Video manipulation signs</li>
        </ul>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">
          <strong>Note:</strong> Results are heuristic indicators, not definitive proof. Always verify suspicious content through multiple sources.
        </p>
      </div>
    </div>
  );
};

export default VideoMetadataAnalyzer;
