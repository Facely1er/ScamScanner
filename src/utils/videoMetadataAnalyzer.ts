/**
 * Basic video metadata analysis
 * Safe for v1 - no external dependencies
 * Works entirely in browser
 */

export async function analyzeVideoMetadata(file: File) {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  const name = (file.name || '').toLowerCase();
  const type = file.type || 'unknown';

  const metadata: {
    format?: string;
    fileSize?: number;
    duration?: number;
    dimensions?: { width: number; height: number };
  } = {
    format: type,
    fileSize: file.size
  };

  // Get video dimensions and duration using video element
  try {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    const videoData = await new Promise<{ w: number; h: number; duration: number }>((resolve, reject) => {
      video.onloadedmetadata = () => {
        resolve({
          w: video.videoWidth,
          h: video.videoHeight,
          duration: video.duration
        });
      };
      video.onerror = () => reject(new Error('Unable to decode video'));
      video.src = url;
    });
    URL.revokeObjectURL(url);
    metadata.dimensions = { width: videoData.w, height: videoData.h };
    metadata.duration = videoData.duration;
  } catch {
    // ignore - metadata extraction failed
  }

  // Heuristics
  if (!/video\/(mp4|webm|quicktime|ogg)/.test(type)) {
    score += 10;
    issues.push('Uncommon video format (could be normal; still worth caution).');
  }

  if (file.size > 50 * 1024 * 1024) {
    score += 10;
    issues.push('Large file size compared to typical shared videos.');
  }

  if (/(screen|recording|video\d+|vid_\d+|download)/.test(name)) {
    score += 5;
    issues.push('Filename looks generic (common for downloaded or reused videos).');
  }

  if (metadata.duration && metadata.duration < 3) {
    score += 5;
    issues.push('Very short video duration (could indicate quick scam recording).');
  }

  if (metadata.duration && metadata.duration > 600) {
    score += 5;
    issues.push('Very long video duration (unusual for scam contexts).');
  }

  // Educational warnings
  issues.push('This tool does not prove authenticity. Missing metadata is not proof of manipulation.');
  issues.push('Deepfake detection requires specialized tools. Be cautious with video-based requests.');

  score = Math.min(100, score);
  const isSuspicious = score >= 35;

  recommendations.push('If the video matters (money, safety, reputation), verify via the original source.');
  recommendations.push('Look for visual inconsistencies: unnatural movements, lip-sync issues, and lighting problems.');
  recommendations.push('Be especially cautious with videos that trigger urgency or requests for payment/credentials.');
  recommendations.push('Consider reverse image/video search to check if content has been reused.');

  return {
    riskScore: score,
    isSuspicious,
    issues,
    metadata,
    recommendations
  };
}

export function getVideoRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 45) return 'high';
  if (score >= 20) return 'medium';
  return 'low';
}

