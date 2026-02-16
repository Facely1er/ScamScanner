# Deepfake Detection Implementation Guide

## Overview

Deepfake detection has been implemented in parallel to the main codebase without impacting v1. The feature is **disabled by default** and can be enabled via feature flags when ready.

## What Was Implemented

### 1. Feature Flag System (`src/config/features.ts`)
- Centralized feature flag configuration
- Deepfake detection disabled by default
- Can be enabled via environment variables
- Only works in app builds (not web builds)

### 2. Video Metadata Analyzer (`src/utils/videoMetadataAnalyzer.ts`)
- **Safe for v1** - works entirely in browser
- No external dependencies
- Analyzes file size, format, duration, dimensions
- Provides basic heuristics and warnings
- **This is enabled and ready for v1**

### 3. Deepfake Detector Service (`src/services/deepfakeDetector.ts`)
- Isolated service module
- Supports TruthScan API (Hive/Sensity placeholders ready)
- Only initializes if feature flag is enabled
- Graceful error handling
- **Disabled by default - won't affect v1**

### 4. Extended Unified Analyzer (`src/services/unifiedAnalyzer.ts`)
- Added `analyzeVideo()` function
- Optionally integrates deepfake detection
- Backward compatible with existing analyzers
- Video evidence type support

### 5. Video Analyzer UI (`src/app/components/scan/VideoAnalyzer.tsx`)
- Full-featured video upload component
- Video preview
- File validation (100MB limit, format checking)
- Optional deepfake checkbox (only shown if enabled)
- Error handling

### 6. Updated Types (`src/types/scan.ts`)
- Added `'video'` to `EvidenceType` union
- Backward compatible

### 7. Updated Analysis Wizard (`src/app/components/scan/AnalysisWizard.tsx`)
- Video analyzer integrated
- Video icon and color scheme
- Video workflow step

### 8. Updated Session Store (`src/state/sessionStore.ts`)
- Video workflow step added (priority 5, optional)
- Total steps updated to 5

## Current Status

### ✅ Ready for v1
- **Video metadata analysis** - Fully functional, no API needed
- Basic video file analysis works out of the box
- No breaking changes to existing code

### 🔒 Disabled for v1 (can enable later)
- **Deepfake detection** - Implemented but disabled
- Requires API key and feature flag to enable
- Won't affect v1 release

## Environment Variables

Create a `.env` file (or set in your build system) with:

```bash
# Build target
VITE_BUILD_TARGET=app

# Deepfake Detection (disabled for v1)
VITE_ENABLE_DEEPFAKE=false
VITE_DEEPFAKE_PROVIDER=truthscan
VITE_DEEPFAKE_API_KEY=
```

**For v1 release:**
- Keep `VITE_ENABLE_DEEPFAKE=false`
- Leave `VITE_DEEPFAKE_API_KEY` empty

**To enable deepfake detection later:**
- Set `VITE_ENABLE_DEEPFAKE=true`
- Add your API key: `VITE_DEEPFAKE_API_KEY=your_key_here`

## Usage

### Video Analysis (Available Now)

1. Users can upload videos in the scan workflow
2. Basic metadata analysis runs automatically
3. Results show file characteristics, size, duration
4. Heuristic warnings for suspicious patterns

### Deepfake Detection (Enable Later)

1. Set environment variables to enable
2. Users will see "Enable Deepfake Detection" checkbox
3. When checked, video is sent to API for analysis
4. Results include `prob_fake` score (0.0-1.0)
5. High scores (>0.7) increase overall risk assessment

## API Integration

### TruthScan (Currently Implemented)

```typescript
// Service automatically handles:
// 1. Upload video to TruthScan API
// 2. Poll for results (with exponential backoff)
// 3. Return prob_fake score and confidence
// 4. Handle errors gracefully
```

### Adding Other Providers

The service has placeholders for:
- Hive AI (`detectHive()`)
- Sensity (`detectSensity()`)

Implement these methods following the same pattern as `detectTruthScan()`.

## Testing

### Test with Deepfake Disabled (v1 mode)
```bash
VITE_ENABLE_DEEPFAKE=false
```
- ✅ Video metadata works
- ✅ No deepfake UI shown
- ✅ No API calls made

### Test with Deepfake Enabled (v2 mode)
```bash
VITE_ENABLE_DEEPFAKE=true
VITE_DEEPFAKE_API_KEY=test_key
```
- ✅ Video metadata works
- ✅ Deepfake UI shown
- ✅ API integration works (with valid key)

## File Structure

```
src/
├── config/
│   └── features.ts                    # Feature flags
├── services/
│   ├── unifiedAnalyzer.ts            # Extended with video
│   └── deepfakeDetector.ts          # Isolated deepfake service
├── utils/
│   └── videoMetadataAnalyzer.ts     # Basic video analysis
├── app/components/scan/
│   └── VideoAnalyzer.tsx            # Video UI component
└── types/
    └── scan.ts                      # Extended with 'video' type
```

## Pricing Strategy (When Enabled)

Recommended tiers:
- **Free**: Basic video metadata only
- **Premium ($19.99/month)**: 20 deepfake analyses/month
- **Pro ($39.99/month)**: 100 deepfake analyses/month

## Next Steps

1. **For v1**: Ship as-is with video metadata only
2. **For v2**: 
   - Get API key from TruthScan (or other provider)
   - Set `VITE_ENABLE_DEEPFAKE=true`
   - Add API key to environment
   - Feature automatically becomes available

## Notes

- All code is backward compatible
- No breaking changes to existing functionality
- Deepfake detection is completely isolated
- Can be enabled/disabled without code changes
- Feature flag system allows gradual rollout

## Support

If you need to:
- Add new deepfake providers: Extend `deepfakeDetector.ts`
- Change pricing limits: Update usage tracking logic
- Customize UI: Modify `VideoAnalyzer.tsx`
- Adjust heuristics: Update `videoMetadataAnalyzer.ts`

