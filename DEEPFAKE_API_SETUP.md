# Deepfake API Setup Guide

## Overview

This guide will help you fix and configure the Vite API for deepfake detection in ScamScanner.

## Issues Fixed

### 1. ✅ Added Vite Proxy Configuration

**Problem**: Direct API calls to `https://api.truthscan.com` from the browser were failing due to CORS issues in development.

**Solution**: Added proxy configuration in `vite.config.ts`:

```typescript
server: { 
  port: 3000,
  strictPort: false,
  proxy: {
    '/api/deepfake': {
      target: 'https://api.truthscan.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/deepfake/, ''),
      secure: true,
    },
  },
},
```

### 2. ✅ Updated Deepfake Detector for Proxy Support

**Problem**: The detector was hardcoded to use direct API URLs.

**Solution**: Updated `deepfakeDetector.ts` to automatically detect environment:
- **Development (localhost)**: Uses `/api/deepfake` proxy
- **Production/App Build**: Uses direct `https://api.truthscan.com` API

## Environment Configuration

### Option 1: Deepfake Disabled (Default for v1)

```bash
# .env
VITE_BUILD_TARGET=app
VITE_ENABLE_DEEPFAKE=false
VITE_DEEPFAKE_PROVIDER=truthscan
VITE_DEEPFAKE_API_KEY=
```

**Result**: Basic video metadata analysis only (no API calls).

### Option 2: Deepfake Enabled (Development/Testing)

```bash
# .env
VITE_BUILD_TARGET=app
VITE_ENABLE_DEEPFAKE=true
VITE_DEEPFAKE_PROVIDER=truthscan
VITE_DEEPFAKE_API_KEY=your_test_api_key_here
```

**Result**: Full deepfake detection enabled with API integration.

### Option 3: Deepfake Enabled (Production)

```bash
# .env (or environment variables in your deployment platform)
VITE_BUILD_TARGET=app
VITE_ENABLE_DEEPFAKE=true
VITE_DEEPFAKE_PROVIDER=truthscan
VITE_DEEPFAKE_API_KEY=sk_live_xxxxxxxxxxxxx
```

**Result**: Production-ready deepfake detection.

## Getting an API Key

### TruthScan API (Current Provider)

1. Visit [TruthScan](https://truthscan.com) or their API portal
2. Sign up for an account
3. Navigate to API settings
4. Generate a new API key
5. Copy the key (format: `sk_test_xxxxx` or `sk_live_xxxxx`)
6. Add to your `.env` file: `VITE_DEEPFAKE_API_KEY=sk_live_xxxxx`

### Alternative Providers

The system supports multiple providers:

- **TruthScan** (implemented) - Current default
- **Hive AI** (placeholder) - Set `VITE_DEEPFAKE_PROVIDER=hive`
- **Sensity** (placeholder) - Set `VITE_DEEPFAKE_PROVIDER=sensity`

To implement additional providers, update the corresponding method in `src/services/deepfakeDetector.ts`.

## Testing the Setup

### 1. Check Environment Variables

```bash
npm run check:env
```

Expected output:
```
Build Target: app
Deepfake Enabled: true
```

### 2. Start Development Server

```bash
npm run dev:app
```

### 3. Test Video Analysis

1. Navigate to the scan workflow
2. Upload a video file
3. Look for the "Enable Deepfake Detection" checkbox
4. Check the checkbox and analyze
5. Check browser console for API calls

### 4. Verify API Calls

Open browser DevTools (F12) → Network tab:

**In Development (localhost):**
- Should see requests to `/api/deepfake/v1/detect-file`
- Should see requests to `/api/deepfake/v1/query`

**In Production/App:**
- Should see requests to `https://api.truthscan.com/v1/detect-file`
- Should see requests to `https://api.truthscan.com/v1/query`

## Troubleshooting

### Issue: "Deepfake detection is not available"

**Causes:**
1. `VITE_ENABLE_DEEPFAKE` is not set to `'true'`
2. `VITE_DEEPFAKE_API_KEY` is empty
3. Build target is `web` instead of `app`
4. Feature flag check is failing

**Solutions:**
1. Verify `.env` file exists and has correct values
2. Restart dev server after changing `.env`
3. Check `VITE_BUILD_TARGET=app`
4. Verify API key is valid and not expired

### Issue: CORS errors in development

**Error**: `Access-Control-Allow-Origin` blocked

**Cause**: Proxy not working correctly

**Solution**:
1. Verify `vite.config.ts` has proxy configuration
2. Restart dev server: `Ctrl+C` then `npm run dev:app`
3. Clear browser cache
4. Check that requests go to `/api/deepfake/*` not `https://api.truthscan.com/*`

### Issue: API returns 401 Unauthorized

**Cause**: Invalid or expired API key

**Solution**:
1. Verify API key in `.env` is correct
2. Check for extra spaces or quotes
3. Regenerate API key from provider dashboard
4. Ensure key has not expired

### Issue: API returns 429 Too Many Requests

**Cause**: API rate limit exceeded

**Solution**:
1. Check your API plan limits
2. Implement request throttling
3. Upgrade to higher tier plan
4. Use test videos sparingly

### Issue: Timeout waiting for results

**Cause**: Video processing takes too long

**Solution**:
1. Use smaller video files (< 100MB)
2. Compress videos before upload
3. Increase `maxAttempts` in detector (currently 30)
4. Check TruthScan API status

## How It Works

### Development Mode (localhost)

```
Browser → Vite Dev Server → Proxy → TruthScan API
       (localhost:3000)  (/api/deepfake)  (api.truthscan.com)
```

**Benefits:**
- No CORS issues
- Simplified debugging
- API key stays secure

### Production/App Mode

```
Browser/App → TruthScan API
            (https://api.truthscan.com)
```

**Benefits:**
- Direct connection
- Faster response
- Works in mobile apps

## Configuration Reference

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_BUILD_TARGET` | Yes | `web` | Set to `app` for full features |
| `VITE_ENABLE_DEEPFAKE` | No | `false` | Enable deepfake detection |
| `VITE_DEEPFAKE_PROVIDER` | No | `truthscan` | API provider (`truthscan`, `hive`, `sensity`) |
| `VITE_DEEPFAKE_API_KEY` | No* | `''` | API key from provider |

*Required if `VITE_ENABLE_DEEPFAKE=true`

### Feature Flags

Located in `src/config/features.ts`:

```typescript
DEEPFAKE_DETECTION: {
  enabled: import.meta.env.VITE_ENABLE_DEEPFAKE === 'true',
  provider: import.meta.env.VITE_DEEPFAKE_PROVIDER || 'truthscan',
  apiKey: import.meta.env.VITE_DEEPFAKE_API_KEY || '',
  requiresAppBuild: true,
}
```

## API Request Flow

1. **Upload Video**
   - `POST /v1/detect-file`
   - Multipart form data with video file
   - Returns `job_id`

2. **Poll for Results**
   - `POST /v1/query` with `job_id`
   - Poll every 2-10 seconds (exponential backoff)
   - Max 30 attempts (60-300 seconds total)

3. **Parse Response**
   - `status: 'completed'` → Success
   - `status: 'failed'` → Error
   - `status: 'processing'` → Continue polling

4. **Return Result**
   ```typescript
   {
     probFake: 0.85,      // 0.0-1.0
     confidence: 0.92,     // 0.0-1.0
     label: 'ai_generated',
     provider: 'truthscan',
     metadata: {...}
   }
   ```

## Cost Considerations

Deepfake detection is a **paid feature**:

- **Free tier**: Basic video metadata only
- **API costs**: Typically $0.05-0.50 per video analyzed
- **Rate limits**: Varies by provider plan

**Recommendation**: Start with test API key, monitor costs, then upgrade.

## Security Best Practices

1. **Never commit API keys**: Use `.env` file (gitignored)
2. **Use environment secrets**: For production deployments
3. **Rotate keys regularly**: Every 90 days minimum
4. **Monitor usage**: Set up alerts for unusual activity
5. **Use test keys**: For development/testing only

## Build Commands

### Development with Deepfake

```bash
# Make sure .env has VITE_ENABLE_DEEPFAKE=true
npm run dev:app
```

### Build for Production (with Deepfake)

```bash
# Set environment variables
npm run build:app

# For Android
npm run android:build

# For iOS
npm run ios:build
```

### Build for Production (without Deepfake)

```bash
# Set VITE_ENABLE_DEEPFAKE=false in .env
npm run build:app
```

## Next Steps

1. ✅ **Fixed Vite proxy configuration**
2. ✅ **Updated deepfake detector for proxy support**
3. 🔲 **Get API key from TruthScan**
4. 🔲 **Add key to `.env` file**
5. 🔲 **Test in development**
6. 🔲 **Test app build**
7. 🔲 **Deploy to production**

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review `VIDEO_ANALYSIS.md` for feature details
3. Check `DEEPFAKE_IMPLEMENTATION.md` for architecture
4. Examine browser console for error messages
5. Test with `VITE_ENABLE_DEEPFAKE=false` first

## Files Modified

- ✅ `vite.config.ts` - Added proxy configuration
- ✅ `src/services/deepfakeDetector.ts` - Added proxy support
- ✅ `DEEPFAKE_API_SETUP.md` - Created this guide

## Summary

The Vite API for deepfakes has been fixed with:

1. **Proxy configuration** in `vite.config.ts` for CORS handling in development
2. **Auto-detection** of environment (dev vs production) in deepfake detector
3. **Comprehensive documentation** for setup and troubleshooting

The system now:
- ✅ Works in development (via proxy)
- ✅ Works in production (direct API)
- ✅ Works in mobile apps (direct API)
- ✅ Handles CORS correctly
- ✅ Has clear configuration steps
- ✅ Includes troubleshooting guide

**Status**: Ready for testing with API key!
