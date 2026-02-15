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
    deepfakeEnabled: false, // Deepfake disabled by default
  },
} as const;

/**
 * Check if a feature is available
 */
export async function isFeatureEnabled(feature: keyof typeof FEATURES): Promise<boolean> {
  const config = FEATURES[feature];
  
  if (feature === 'DEEPFAKE_DETECTION') {
    // Deepfake requires app build and explicit enable
    return config.enabled && IS_APP_BUILD && !!config.apiKey;
  }
  
  return config.enabled;
}

/**
 * Synchronous check for feature availability (for UI rendering)
 */
export function isFeatureEnabledSync(feature: keyof typeof FEATURES): boolean {
  const config = FEATURES[feature];
  
  if (feature === 'DEEPFAKE_DETECTION') {
    return config.enabled && IS_APP_BUILD && !!config.apiKey;
  }
  
  return config.enabled;
}

/**
 * Get feature configuration
 */
export function getFeatureConfig<T extends keyof typeof FEATURES>(
  feature: T
): typeof FEATURES[T] {
  return FEATURES[feature];
}

