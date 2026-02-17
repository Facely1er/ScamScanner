# Video Analysis & Deepfake Detection

ScamScanner includes comprehensive video analysis capabilities with optional deepfake detection for premium users.

## Features

### Basic Video Metadata Analysis (Included)

Works out-of-the-box without any API keys. Analyzes:

- **File format** - Flags uncommon video formats
- **File size** - Identifies unusually large files (>50MB)
- **Duration** - Detects very short (<3s) or very long (>10min) videos
- **Dimensions** - Extracts video width and height
- **Filename patterns** - Identifies generic or suspicious filenames

**Supported formats**: MP4, WebM, MOV (QuickTime), OGG

### Deepfake Detection (Premium)

Advanced AI-powered detection for synthetic/manipulated videos:

- **Real-time analysis** - Detects AI-generated facial manipulations
- **Probability scoring** - Returns confidence level (0-100%)
- **Multiple providers** - TruthScan, Hive, Sensity (TruthScan implemented)
- **Risk integration** - Deepfake scores contribute to overall risk assessment

## Setup

### Basic Video Analysis (No Setup Required)

Basic metadata analysis works immediately:

```typescript
import { analyzeVideo } from './services/unifiedAnalyzer';

const evidence = await analyzeVideo(videoFile);
// Returns: metadata, risk score, suspicious indicators
```

### Deepfake Detection Setup

1. **Get an API Key**

   Currently supported provider: [TruthScan](https://truthscan.com)
   - Sign up at https://truthscan.com
   - Navigate to API settings
   - Generate an API key
   - Note: This is a paid service

2. **Configure Environment**

   Create or edit `.env` in the project root:

   ```env
   VITE_BUILD_TARGET=app
   VITE_ENABLE_DEEPFAKE=true
   VITE_DEEPFAKE_PROVIDER=truthscan
   VITE_DEEPFAKE_API_KEY=your_actual_api_key_here
   ```

3. **Build as App**

   Deepfake detection only works in app builds:

   ```bash
   # Development
   npm run dev:app

   # Production
   npm run build:app
   ```

## Usage

### In the Guided Scan Workflow

1. Start a new scan session
2. Navigate to "Add Evidence"
3. Select "Analyze Video Metadata"
4. Upload your video file (max 100MB)
5. If deepfake detection is enabled, check the "Enable Deepfake Detection" option
6. Click "Analyze Video"

### Programmatic Usage

```typescript
import { analyzeVideo } from './services/unifiedAnalyzer';

// Basic metadata only
const basicAnalysis = await analyzeVideo(videoFile);

// With deepfake detection (requires API key)
const fullAnalysis = await analyzeVideo(videoFile, {
  enableDeepfake: true
});

console.log(fullAnalysis.data.deepfake);
// {
//   probFake: 0.85,
//   confidence: 0.92,
//   label: 'ai_generated',
//   provider: 'truthscan'
// }
```

### Direct Deepfake Detector Usage

```typescript
import { deepfakeDetector } from './services/deepfakeDetector';

// Initialize (happens automatically on app load)
const available = await deepfakeDetector.initialize();

if (available) {
  const result = await deepfakeDetector.detect(videoFile);
  console.log(`Deepfake probability: ${result.probFake * 100}%`);
}
```

## API Providers

### TruthScan (Implemented)

- **Status**: ✅ Fully implemented
- **Website**: https://truthscan.com
- **API Endpoint**: `https://api.truthscan.com/v1/`
- **Process**: 
  1. Upload video via `/detect-file`
  2. Receive job ID
  3. Poll `/query` endpoint for results
  4. Returns probability score and confidence

### Hive (Not Yet Implemented)

- **Status**: ⏳ Placeholder only
- Set `VITE_DEEPFAKE_PROVIDER=hive` to use (once implemented)

### Sensity (Not Yet Implemented)

- **Status**: ⏳ Placeholder only
- Set `VITE_DEEPFAKE_PROVIDER=sensity` to use (once implemented)

## Feature Flags

The deepfake feature uses a sophisticated flag system:

```typescript
// features.ts
DEEPFAKE_DETECTION: {
  enabled: import.meta.env.VITE_ENABLE_DEEPFAKE === 'true',
  provider: 'truthscan' | 'hive' | 'sensity',
  apiKey: string,
  requiresAppBuild: true, // Only works in app builds, not web
}
```

Checking if deepfake is available:

```typescript
import { isFeatureEnabledSync } from './config/features';
import { deepfakeDetector } from './services/deepfakeDetector';

const deepfakeAvailable = 
  isFeatureEnabledSync('DEEPFAKE_DETECTION') && 
  deepfakeDetector.isAvailable();
```

## Limitations & Best Practices

### File Size Limits
- **Maximum**: 100MB per video
- **Recommended**: <50MB for faster processing
- **Duration**: <10 minutes recommended

### Accuracy Considerations

1. **Not definitive proof**: Results are probabilistic indicators, not absolute truth
2. **False positives**: High-quality CGI or heavy editing may trigger false alarms
3. **False negatives**: Advanced deepfakes may not be detected
4. **Context matters**: Always combine with other evidence types

### Performance Tips

1. **Compress videos** before upload when possible
2. **Use shorter clips** - First 30 seconds often sufficient
3. **Check format** - MP4 H.264 is most reliable
4. **Monitor quota** - API calls are rate-limited and billed

### Error Handling

The implementation gracefully degrades:

```typescript
try {
  const result = await analyzeVideo(file, { enableDeepfake: true });
  // Use result
} catch (error) {
  // Falls back to basic metadata analysis
  // Deepfake detection failures don't break video analysis
}
```

## Cost Considerations

### Free Tier (Basic Metadata)
- ✅ No API key required
- ✅ Unlimited usage
- ✅ Works in web and app builds
- ❌ No deepfake detection

### Premium Tier (Deepfake Detection)
- 💰 Requires paid API subscription
- 📊 Usage-based pricing (check provider)
- ⚡ Rate limits apply
- 🔒 App build only
- ✅ Advanced AI detection

## Security & Privacy

### Data Handling
- Videos are **uploaded to third-party API** for deepfake detection
- Basic metadata analysis is **100% local** (browser-only)
- No videos are stored on our servers
- API provider may cache videos temporarily per their policy

### API Key Security
- Store API keys in `.env` (never commit to git)
- `.env` is in `.gitignore` by default
- Keys are only included in compiled app builds
- Rotate keys regularly if exposed

## Troubleshooting

### "Deepfake detection is not available"

**Causes**:
- `VITE_ENABLE_DEEPFAKE` not set to `'true'`
- `VITE_DEEPFAKE_API_KEY` is empty
- Running web build instead of app build
- Invalid API key

**Solution**:
1. Check `.env` file exists and has correct values
2. Run `npm run dev:app` (not `npm run dev`)
3. Verify API key is valid with provider

### "Upload failed" or "Query failed"

**Causes**:
- Invalid API key
- Rate limit exceeded
- File too large
- Unsupported format
- Network issues

**Solution**:
1. Verify API key is active
2. Check file size (<100MB)
3. Convert to MP4 if using exotic format
4. Check provider's API status page

### "Timeout waiting for results"

**Causes**:
- Video processing taking too long (>5 minutes)
- API endpoint unresponsive
- Large file size

**Solution**:
1. Use shorter video clips
2. Compress video file
3. Try again later
4. Check provider status

## Development & Testing

### Running Tests

```bash
npm test
```

### Manual Testing Checklist

- [ ] Basic metadata works without API key
- [ ] Deepfake detection requires app build
- [ ] File size validation works (>100MB rejected)
- [ ] Format validation works (non-video rejected)
- [ ] Preview player displays correctly
- [ ] Risk scores integrate properly
- [ ] Graceful degradation on API failure
- [ ] Error messages are user-friendly

### Adding New Providers

To add a new deepfake provider:

1. Add provider type to `DeepfakeProvider`:
   ```typescript
   export type DeepfakeProvider = 'truthscan' | 'hive' | 'sensity' | 'your_provider';
   ```

2. Implement detection method in `DeepfakeDetectorService`:
   ```typescript
   private async detectYourProvider(file: File): Promise<DeepfakeResult> {
     // Your implementation
   }
   ```

3. Add to switch statement in `detect()` method

4. Document provider in this file

## Resources

- [TruthScan API Documentation](https://truthscan.com/docs)
- [Understanding Deepfakes](https://en.wikipedia.org/wiki/Deepfake)
- [Video Metadata Standards](https://exiftool.org/TagNames/QuickTime.html)

## Support

For issues related to:
- **Basic video analysis**: Check GitHub issues
- **API integration**: Contact your provider's support
- **Feature requests**: Open a GitHub discussion

---

**Last Updated**: February 2026  
**Status**: Production Ready (Basic), Beta (Deepfake)
