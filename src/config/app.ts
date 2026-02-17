/**
 * Centralized app configuration
 * Update these values after publishing to Play Store
 */

export const appConfig = {
  // App Information
  appName: 'Cyberstition',
  packageName: 'app.cyberstition.scamscanner',
  version: '1.0.0',
  
  // Store URLs (update Apple app ID after publishing to App Store)
  playStoreUrl: 'https://play.google.com/store/apps/details?id=app.cyberstition.scamscanner',
  playStorePackageName: 'app.cyberstition.scamscanner',
  appStoreUrl: 'https://apps.apple.com/app/id000000000', // Replace 000000000 with your Apple app ID from App Store Connect
  
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

// Helper function for getting Play Store URL
export function getPlayStoreUrl(): string {
  return appConfig.playStoreUrl;
}

// Helper function for getting App Store URL
export function getAppStoreUrl(): string {
  return appConfig.appStoreUrl;
}

/** Opens the appropriate store (App Store on iOS, Play Store on Android) or Play Store on desktop. */
export function getStoreUrlByDevice(): string {
  if (typeof navigator === 'undefined') return appConfig.playStoreUrl;
  const ua = navigator.userAgent || navigator.vendor;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return isIOS ? appConfig.appStoreUrl : appConfig.playStoreUrl;
}

// Platform detection helpers
export const isAndroidApp = typeof (window as any).Capacitor !== 'undefined' && 
  (window as any).Capacitor?.getPlatform?.() === 'android';

export const isNativeApp = typeof (window as any).Capacitor !== 'undefined';
