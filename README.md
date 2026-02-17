# Cyberstition

A privacy-first scam detection guide that helps users identify phishing, fraud, and deception through context-aware, guided analysis. All processing happens locally in your browser—no data collection, no server uploads.

## Features

### Guided Scan Workflow
- **Context Collection**: Provide details about how you received content
- **Smart Analysis**: System recommends which checks to run based on your situation
- **Pattern Detection**: Automatically identifies common scam tactics across multiple signals
- **Cross-Signal Correlation**: Detects inconsistencies and relationships between evidence
- **Confidence Scoring**: Clear risk assessment with transparent reasoning

### Individual Analysis Tools
- **Message Analysis**: Detect scam, phishing, and AI-generated message patterns
- **Profile Verification**: Assess social profile authenticity and identify deception signals
- **Image Inspection**: Reveal hidden metadata and manipulation indicators
- **Email Header Analysis**: Check for email spoofing and routing anomalies
- **Video Analysis**: Inspect video metadata and detect deepfakes (premium feature)

### Intelligence Features
- Pre-loaded threat pattern library for phishing, romance scams, investment fraud, and more
- Automatic correlation of evidence from multiple sources
- Dynamic workflow guidance based on findings
- Complete scan history with pattern matches and confidence scores

## Privacy & Security

- All analysis runs on-device in your browser
- No data collection or tracking
- No server uploads or account monitoring
- Results are indicators only—always verify independently

## How It Works

### Using the Guided Scan

1. **Start a New Scan** - Click "Start Guided Scan" from the home page
2. **Provide Context** - Tell us how you received the content (email, social media, SMS, etc.)
3. **Add Evidence** - The system guides you through relevant checks:
   - Analyze message content
   - Verify sender profile
   - Check email headers
   - Inspect attached images
4. **Review Findings** - Get a comprehensive risk assessment with:
   - Overall confidence score
   - Detected threat patterns
   - Cross-signal correlations
   - Clear recommendations
5. **Save Session** - Complete scans are saved to your dashboard for future reference

### Using Individual Tools

You can also use the individual analysis tools directly:
- Navigate to specific tool pages (Messages, Profiles, Images, Email)
- Each tool provides targeted analysis for that evidence type
- Results are saved as individual reports

## Development

### Prerequisites
- Node.js 18+ and npm
- (Optional) Deepfake detection API key from [TruthScan](https://truthscan.com)

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment** (optional for deepfake detection):
   ```bash
   cp .env.example .env
   # Edit .env and add your API key
   ```

3. **Start development server**:
   ```bash
   # Web build (basic features)
   npm run dev

   # App build (full features including deepfake detection)
   npm run dev:app
   ```

4. **Build for production**:
   ```bash
   # Web build
   npm run build:web

   # App build (with deepfake support)
   npm run build:app
   ```

### Mobile App Development

For Android:
```bash
npm run android:init      # First time only
npm run android:sync      # Sync web assets to Android
npm run android:open      # Open in Android Studio
npm run android:run       # Build and run on device
```

For iOS:
```bash
npm run ios:init          # First time only
npm run ios:sync          # Sync web assets to iOS
npm run ios:open          # Open in Xcode
npm run ios:run           # Build and run on device
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Build target: 'web' or 'app'
VITE_BUILD_TARGET=app

# Deepfake Detection (Premium Feature)
VITE_ENABLE_DEEPFAKE=true
VITE_DEEPFAKE_PROVIDER=truthscan
VITE_DEEPFAKE_API_KEY=your_api_key_here
```

**Note**: Deepfake detection requires:
- `VITE_BUILD_TARGET=app` (only available in app builds)
- A valid API key from a supported provider
- Without an API key, basic video metadata analysis still works

## Technology Stack

- React + TypeScript
- Vite
- React Router
