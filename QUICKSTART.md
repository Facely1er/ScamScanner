# Quick Start Guide - Video Analysis & Deepfake Detection

Get up and running with ScamScanner's video analysis features in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- (Optional) TruthScan API key for deepfake detection

## Step 1: Clone & Install

```bash
# Navigate to project
cd ScamScanner

# Install dependencies
npm install
```

## Step 2: Configure Environment (Optional)

For **basic video analysis only** (no API key needed):
```bash
# Skip this step - basic analysis works out of the box
```

For **deepfake detection** (requires API key):
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your API key
# VITE_BUILD_TARGET=app
# VITE_ENABLE_DEEPFAKE=true
# VITE_DEEPFAKE_API_KEY=your_actual_key_here
```

## Step 3: Run Development Server

```bash
# For basic features (web build)
npm run dev

# For full features including deepfake (app build)
npm run dev:app
```

Open browser at: `http://localhost:3000`

## Step 4: Test Video Analysis

1. Click **"Start Guided Scan"** from home page
2. Select a context (e.g., "Social Media DM")
3. Click **"Add Evidence"**
4. Select **"Analyze Video Metadata"**
5. Upload a video file (max 100MB)
6. If deepfake is enabled, check the **"Enable Deepfake Detection"** box
7. Click **"Analyze Video"**

## What You'll See

### Basic Metadata Analysis (Always Available)
✅ File format and size
✅ Video duration and dimensions
✅ Suspicious filename patterns
✅ Risk score based on heuristics

### Deepfake Detection (If Enabled)
✅ AI-generated probability score
✅ Confidence level
✅ Detection label (authentic/ai_generated)
✅ Enhanced risk assessment

## Quick Troubleshooting

### "Deepfake detection not available"

**Solution**: 
1. Check you're running `npm run dev:app` (not `npm run dev`)
2. Verify `.env` file exists with valid `VITE_DEEPFAKE_API_KEY`
3. Restart the dev server

### "File too large"

**Solution**: 
- Maximum file size is 100MB
- Compress video or use shorter clip

### "Unsupported format"

**Solution**: 
- Supported formats: MP4, WebM, MOV, OGG
- Convert video to MP4 H.264 for best compatibility

## Build for Production

### Web Build (Basic Features)
```bash
npm run build:web
# Output: dist/web/
```

### App Build (Full Features)
```bash
npm run build:app
# Output: dist/app/
```

### Mobile Apps

**Android**:
```bash
npm run android:sync
npm run android:open
```

**iOS** (macOS only):
```bash
npm run ios:sync
npm run ios:open
```

## Getting a TruthScan API Key

1. Visit: https://truthscan.com
2. Sign up for an account
3. Navigate to **API Settings**
4. Generate an API key
5. Copy key to `.env` file as `VITE_DEEPFAKE_API_KEY`

Note: TruthScan is a paid service. Check their pricing at https://truthscan.com/pricing

## Testing Without API Key

You can still test the full UI and basic video analysis without an API key:

1. Set `VITE_BUILD_TARGET=app` in `.env`
2. Leave `VITE_ENABLE_DEEPFAKE=false` (or omit)
3. Run `npm run dev:app`
4. Video analyzer will show "Basic Video Analysis" mode

## Next Steps

- Read [VIDEO_ANALYSIS.md](./VIDEO_ANALYSIS.md) for detailed documentation
- Read [BUILD_GUIDE.md](./BUILD_GUIDE.md) for deployment options
- Check [README.md](./README.md) for full feature list

## Support

- **Issues**: https://github.com/your-org/ScamScanner/issues
- **Discussions**: https://github.com/your-org/ScamScanner/discussions
- **Documentation**: See markdown files in project root

## Useful Commands

```bash
# Development
npm run dev              # Web build
npm run dev:app          # App build with all features

# Building
npm run build:web        # Production web build
npm run build:app        # Production app build

# Testing
npm test                 # Run tests
npm run lint             # Check code quality

# Check configuration
npm run check:env        # Verify environment setup
```

---

**Time to first video analysis**: < 2 minutes (no API key needed)  
**Time to deepfake detection**: < 5 minutes (with API key)
