/**
 * Feature flags for experimental/premium features
 * These can be enabled per build or via environment variables
 * 
 * Deepfake detection is disabled by default for v1 release
 */

import { IS_APP_BUILD } from './env';

export const FEATURES = {
  // Deepfake detection (disabled for v1)
  DEEPFAKE_DETECTION: {
    enabled: import.meta.env.VITE_ENABLE_DEEPFAKE === 'true',
    provider: (import.meta.env.VITE_DEEPFAKE_PROVIDER || 'truthscan') as 'truthscan' | 'hive' | 'sensity',
    apiKey: import.meta.env.VITE_DEEPFAKE_API_KEY || '',
    // Only enable in app builds, not web
    requiresAppBuild: true,
  },
  
  // Video analysis (basic metadata - can be enabled for v1)
  VIDEO_ANALYSIS: {
    enabled: true, // Basic metadata is safe for v1
    deepfakeEnabled: import.meta.env.VITE_ENABLE_DEEPFAKE === 'true', // Deepfake enabled via env var
  },
} as const;

/**
 * Check if a feature is available (async version for dynamic checks)
 */
export async function isFeatureEnabled(feature: keyof typeof FEATURES): Promise<boolean> {
  return isFeatureEnabledSync(feature);
}

/**
 * Synchronous check for feature availability (for UI rendering)
 */
export function isFeatureEnabledSync(feature: keyof typeof FEATURES): boolean {
  if (feature === 'DEEPFAKE_DETECTION') {
    const config = FEATURES.DEEPFAKE_DETECTION;
    return config.enabled && IS_APP_BUILD && !!config.apiKey;
  }
  
  return FEATURES[feature].enabled;
}

/**
 * Get feature configuration
 */
export function getFeatureConfig<T extends keyof typeof FEATURES>(
  feature: T
): typeof FEATURES[T] {
  return FEATURES[feature];
}

