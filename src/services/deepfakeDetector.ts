/**
 * Deepfake Detection Service
 * Isolated module - only loaded when feature flag is enabled
 * Does not affect v1 if disabled
 */

import { getFeatureConfig, isFeatureEnabledSync } from '../config/features';

export type DeepfakeProvider = 'truthscan' | 'hive' | 'sensity';

export interface DeepfakeResult {
  probFake: number; // 0.0 (authentic) to 1.0 (AI-generated)
  confidence: number;
  label: 'ai_generated' | 'no_detection' | 'unknown';
  provider: DeepfakeProvider;
  metadata?: any;
  error?: string;
}

class DeepfakeDetectorService {
  private initialized = false;
  private config: ReturnType<typeof getFeatureConfig<'DEEPFAKE_DETECTION'>> | null = null;

  /**
   * Initialize service (only if feature is enabled)
   */
  async initialize(): Promise<boolean> {
    // Check if feature is enabled synchronously first
    if (!isFeatureEnabledSync('DEEPFAKE_DETECTION')) {
      return false;
    }

    const featureConfig = getFeatureConfig('DEEPFAKE_DETECTION');
    
    if (!featureConfig.enabled || !featureConfig.apiKey) {
      return false;
    }

    this.config = featureConfig;
    this.initialized = true;
    return true;
  }

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    return this.initialized && this.config !== null;
  }

  /**
   * Detect deepfake in video
   */
  async detect(file: File): Promise<DeepfakeResult> {
    if (!this.isAvailable()) {
      throw new Error('Deepfake detection is not available');
    }

    switch (this.config!.provider) {
      case 'truthscan':
        return this.detectTruthScan(file);
      case 'hive':
        return this.detectHive(file);
      case 'sensity':
        return this.detectSensity(file);
      default:
        throw new Error('Unsupported provider');
    }
  }

  private async detectTruthScan(file: File): Promise<DeepfakeResult> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Step 1: Upload video
      const uploadRes = await fetch('https://api.truthscan.com/v1/detect-file', {
        method: 'POST',
        headers: {
          'X-API-Key': this.config!.apiKey,
        },
        body: formData
      });

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        throw new Error(`Upload failed: ${uploadRes.statusText} - ${errorText}`);
      }

      const { job_id } = await uploadRes.json();

      if (!job_id) {
        throw new Error('No job ID returned from upload');
      }

      // Step 2: Poll for results (with exponential backoff)
      const maxAttempts = 30;
      let delay = 2000; // Start with 2 seconds

      for (let i = 0; i < maxAttempts; i++) {
        await new Promise(resolve => setTimeout(resolve, delay));

        const resultRes = await fetch('https://api.truthscan.com/v1/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.config!.apiKey
          },
          body: JSON.stringify({ job_id })
        });

        if (!resultRes.ok) {
          throw new Error(`Query failed: ${resultRes.statusText}`);
        }

        const data = await resultRes.json();

        if (data.status === 'completed') {
          return {
            probFake: data.prob_fake || 0,
            confidence: data.confidence || 0.5,
            label: data.label || 'unknown',
            provider: 'truthscan',
            metadata: data
          };
        }

        if (data.status === 'failed') {
          throw new Error(data.error || 'Detection failed');
        }

        // Exponential backoff (max 10 seconds)
        delay = Math.min(delay * 1.5, 10000);
      }

      throw new Error('Timeout waiting for results');
    } catch (error: any) {
      return {
        probFake: 0,
        confidence: 0,
        label: 'unknown',
        provider: 'truthscan',
        error: error.message || 'Unknown error'
      };
    }
  }

  private async detectHive(file: File): Promise<DeepfakeResult> {
    // Hive implementation (placeholder - implement when needed)
    // TODO: Implement Hive API integration
    throw new Error('Hive provider not yet implemented');
  }

  private async detectSensity(file: File): Promise<DeepfakeResult> {
    // Sensity implementation (placeholder - implement when needed)
    // TODO: Implement Sensity API integration
    throw new Error('Sensity provider not yet implemented');
  }
}

// Singleton instance
export const deepfakeDetector = new DeepfakeDetectorService();

// Auto-initialize if feature is enabled (only in browser)
if (typeof window !== 'undefined') {
  deepfakeDetector.initialize().catch((error) => {
    // Silently fail - feature is optional
    console.debug('Deepfake detector initialization failed:', error);
  });
}

