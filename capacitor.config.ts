import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.cyberstition.scamscanner',
  appName: 'Cyberstition',
  webDir: 'dist/app',
  server: {
    androidScheme: 'https',
    // Uncomment for development with live reload
    // url: 'http://localhost:3000',
    // cleartext: true
  },
  android: {
    allowMixedContent: true,
    buildOptions: {
      keystorePath: undefined, // Set path to your keystore for release builds
      releaseType: 'AAB', // Use AAB for Play Store, APK for direct distribution
    },
  },
  ios: {
    contentInset: 'automatic',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#0a0f1a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0f1623',
    },
    App: {
      // App lifecycle configuration
    },
  },
};

export default config;
