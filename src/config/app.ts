/**
 * Centralized app configuration
 * Update these values after publishing to Play Store
 */

export const appConfig = {
  // App Information
  appName: 'Cyberstition',
  packageName: 'com.ermits.cyberstition',
  version: '1.0.0',
  
  // Play Store URLs (update after publishing)
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ermits.cyberstition',
  playStorePackageName: 'com.ermits.cyberstition',
  
  // Support
  supportEmail: 'support@ermits.com',
  privacyPolicyUrl: '', // Add if required
  
  // Purchase Configuration
  purchaseProductId: 'full_access', // Product ID for in-app purchase
  demoModeEnabled: true, // Enable demo/trial mode
  
  // Demo/Trial Settings
  demo: {
    // Number of free scans per tool
    scansPerTool: 3,
    // Trial period in days (0 = no time limit, only scan limit)
    trialDays: 0,
    // Features available in demo
    features: {
      batchProcessing: false,
      exportResults: false,
      advancedAnalysis: false,
      fullSignalExplanations: false,
    },
  },
} as const;
