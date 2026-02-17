# Vite API Fix for Deepfakes - Summary

## What Was Fixed

The Vite API configuration for deepfake detection has been fixed and enhanced with the following changes:

### 1. ✅ Added Vite Proxy Configuration (`vite.config.ts`)

**Problem**: CORS errors when calling TruthScan API from browser in development mode.

**Solution**: Added proxy configuration to route API calls through Vite dev server:

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

### 2. ✅ Updated Deepfake Detector (`src/services/deepfakeDetector.ts`)

**Problem**: Hardcoded API URLs didn't work in all environments.

**Solution**: Added environment detection:

- **Development (localhost)**: Uses `/api/deepfake` proxy (no CORS)
- **Production/App**: Uses direct `https://api.truthscan.com` (native fetch)

```typescript
const isDev = import.meta.env.DEV;
const useProxy = isDev && typeof window !== 'undefined' && window.location.hostname === 'localhost';
const apiBase = useProxy ? '/api/deepfake' : 'https://api.truthscan.com';
```

### 3. ✅ Created Configuration Test Script

**File**: `scripts/test-deepfake-config.js`

**Usage**: 
```bash
npm run test:deepfake-config
```

**Features**:
- Checks `.env` file existence
- Validates all deepfake environment variables
- Shows API key status (without revealing full key)
- Provides recommendations based on configuration

### 4. ✅ Comprehensive Documentation

**File**: `DEEPFAKE_API_SETUP.md`

**Contents**:
- Complete setup instructions
- Environment variable reference
- Troubleshooting guide
- API request flow documentation
- Security best practices

## Files Modified

1. ✅ `vite.config.ts` - Added proxy configuration
2. ✅ `src/services/deepfakeDetector.ts` - Added environment detection
3. ✅ `scripts/test-deepfake-config.js` - Created test script
4. ✅ `package.json` - Added `test:deepfake-config` script
5. ✅ `DEEPFAKE_API_SETUP.md` - Created setup guide
6. ✅ `DEEPFAKE_FIX_SUMMARY.md` - This file

## Current Configuration Status

Based on your `.env` file:

```bash
VITE_BUILD_TARGET=app              ✅ Correct
VITE_ENABLE_DEEPFAKE=true          ✅ Enabled
VITE_DEEPFAKE_PROVIDER=truthscan   ✅ Implemented
VITE_DEEPFAKE_API_KEY=             ❌ Missing (needs API key)
```

## Next Steps

### To Enable Deepfake Detection

1. **Get API Key**
   - Visit TruthScan API portal
   - Sign up for account
   - Generate API key
   - Copy key (format: `sk_test_*` or `sk_live_*`)

2. **Update .env**
   ```bash
   VITE_DEEPFAKE_API_KEY=sk_test_your_key_here
   ```

3. **Test Configuration**
   ```bash
   npm run test:deepfake-config
   ```
   
   Should show: ✅ Configuration looks good!

4. **Start Development**
   ```bash
   npm run dev:app
   ```

5. **Test in Browser**
   - Navigate to scan workflow
   - Upload a video file
   - Enable "Deepfake Detection" checkbox
   - Click "Analyze Video"
   - Check DevTools Network tab for API calls

### To Disable Deepfake (Use Basic Video Analysis Only)

Update `.env`:
```bash
VITE_ENABLE_DEEPFAKE=false
```

## Testing Checklist

- [x] Vite proxy configuration added
- [x] Deepfake detector updated
- [x] Test script created
- [x] Documentation written
- [ ] API key obtained (user needs to do this)
- [ ] Test in development mode
- [ ] Test in production build
- [ ] Test on Android app
- [ ] Test on iOS app

## How to Test

### Quick Test (Without API Key)

```bash
# Check configuration
npm run test:deepfake-config

# Start dev server
npm run dev:app

# Expected: Video upload works, deepfake checkbox hidden or disabled
```

### Full Test (With API Key)

```bash
# 1. Add API key to .env
# VITE_DEEPFAKE_API_KEY=sk_test_xxxxx

# 2. Check configuration
npm run test:deepfake-config
# Expected: ✅ Configuration looks good!

# 3. Start dev server
npm run dev:app

# 4. Upload test video
# Expected: 
# - Deepfake checkbox visible
# - API calls to /api/deepfake/v1/detect-file
# - Results show prob_fake score
```

## Troubleshooting

### Issue: CORS errors in development

**Check**:
```bash
# Proxy should be in vite.config.ts
grep -A 7 "proxy:" vite.config.ts
```

**Fix**: Restart dev server
```bash
Ctrl+C
npm run dev:app
```

### Issue: API key not recognized

**Check**:
```bash
npm run test:deepfake-config
```

**Fix**: 
- Verify no extra spaces in `.env`
- Ensure key starts with `sk_test_` or `sk_live_`
- Restart dev server after changing `.env`

### Issue: "Deepfake detection is not available"

**Causes**:
1. `VITE_ENABLE_DEEPFAKE` not `'true'`
2. `VITE_BUILD_TARGET` not `'app'`
3. `VITE_DEEPFAKE_API_KEY` empty
4. Feature flag check failing

**Solution**:
```bash
npm run test:deepfake-config
# Follow recommendations
```

## API Endpoints (via Proxy)

In development mode:

| Original | Proxied To |
|----------|------------|
| `https://api.truthscan.com/v1/detect-file` | `/api/deepfake/v1/detect-file` |
| `https://api.truthscan.com/v1/query` | `/api/deepfake/v1/query` |

In production/app mode: Direct URLs (no proxy)

## Security Notes

- ✅ API key never committed to git (`.env` is gitignored)
- ✅ Proxy only active in development
- ✅ Production uses direct HTTPS
- ⚠️ Remember to use test keys for development
- ⚠️ Rotate keys regularly (every 90 days)

## Cost Considerations

Deepfake detection has per-API-call costs:

- **TruthScan**: ~$0.05-0.50 per video
- **Rate limits**: Varies by plan
- **Free tier**: Basic metadata only

**Recommendation**: Start with test API key, monitor usage, upgrade as needed.

## Support Resources

1. **Setup Guide**: `DEEPFAKE_API_SETUP.md`
2. **Implementation**: `DEEPFAKE_IMPLEMENTATION.md`
3. **Video Analysis**: `VIDEO_ANALYSIS.md`
4. **Build Guide**: `BUILD_GUIDE.md`
5. **Test Script**: `npm run test:deepfake-config`

## Success Criteria

Your setup is complete when:

1. ✅ `npm run test:deepfake-config` shows all green checkmarks
2. ✅ Dev server starts without errors
3. ✅ Video upload works
4. ✅ Deepfake checkbox appears
5. ✅ API calls complete successfully
6. ✅ Results show deepfake probability

## Summary

The Vite API for deepfakes is now **fully configured and ready for testing**. The only remaining step is to add a valid API key from TruthScan to the `.env` file.

**Status**: ✅ Fixed and ready for API key
**Blocking**: API key acquisition (user action required)
**Estimated time to working**: 5-10 minutes (after getting API key)

---

**Created**: 2026-02-16  
**Last Updated**: 2026-02-16  
**Status**: Complete
