# Build Configuration Guide

This guide explains how to build ScamScanner for different environments and feature sets.

## Build Targets

ScamScanner supports two build targets:

### Web Build (`web`)
- **Purpose**: Landing page and basic functionality
- **Features**: Core scam detection tools (message, email, image, profile analysis)
- **Limitations**: No deepfake detection, some premium features disabled
- **Deployment**: Can be hosted on any static web host (Netlify, Vercel, GitHub Pages)
- **Command**: `npm run build:web`

### App Build (`app`)
- **Purpose**: Full-featured mobile/desktop application
- **Features**: All tools including video analysis with optional deepfake detection
- **Deployment**: Compiled into iOS/Android apps via Capacitor
- **Command**: `npm run build:app`

## Environment Variables

Create a `.env` file in the project root to configure features:

```env
# Required: Build target
VITE_BUILD_TARGET=app

# Optional: Enable deepfake detection
VITE_ENABLE_DEEPFAKE=true
VITE_DEEPFAKE_PROVIDER=truthscan
VITE_DEEPFAKE_API_KEY=your_api_key_here
```

### Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_BUILD_TARGET` | Yes | `web` | Build target: `web` or `app` |
| `VITE_ENABLE_DEEPFAKE` | No | `false` | Enable deepfake detection |
| `VITE_DEEPFAKE_PROVIDER` | No | `truthscan` | Provider: `truthscan`, `hive`, or `sensity` |
| `VITE_DEEPFAKE_API_KEY` | No* | `''` | API key from provider |

*Required if `VITE_ENABLE_DEEPFAKE=true`

## Build Commands

### Development

```bash
# Web build (basic features)
npm run dev
# or
npm run dev:web

# App build (full features)
npm run dev:app
```

### Production Builds

```bash
# Web build
npm run build:web
# Output: dist/web/

# App build
npm run build:app
# Output: dist/app/
```

### Preview Production Builds

```bash
# Preview web build
npm run preview:web

# Preview app build
npm run preview:app
```

## Mobile App Builds

### Android

```bash
# First time setup
npm run android:init

# Sync assets and open Android Studio
npm run android:sync
npm run android:open

# Build and run on connected device
npm run android:run
```

### iOS

```bash
# First time setup (requires macOS)
npm run ios:init

# Sync assets and open Xcode
npm run ios:sync
npm run ios:open

# Build and run on connected device
npm run ios:run
```

## Feature Flags at Build Time

Features are enabled/disabled at build time based on environment variables:

### Checking Build Target

```typescript
import { IS_APP_BUILD, IS_WEB_BUILD } from './config/env';

if (IS_APP_BUILD) {
  // App-only features
}
```

### Checking Feature Availability

```typescript
import { isFeatureEnabledSync } from './config/features';

const canUseDeepfake = isFeatureEnabledSync('DEEPFAKE_DETECTION');
```

## Common Build Scenarios

### Scenario 1: Deploy Web Version (No Premium Features)

```bash
# .env
VITE_BUILD_TARGET=web

# Build
npm run build:web

# Deploy dist/web/ to your host
```

### Scenario 2: Build Mobile App (With Deepfake)

```bash
# .env
VITE_BUILD_TARGET=app
VITE_ENABLE_DEEPFAKE=true
VITE_DEEPFAKE_PROVIDER=truthscan
VITE_DEEPFAKE_API_KEY=sk_live_xxxxx

# Build and sync
npm run build:app
npm run android:sync  # or ios:sync
```

### Scenario 3: Build Mobile App (Without Deepfake)

```bash
# .env
VITE_BUILD_TARGET=app

# No deepfake variables needed
# Build and sync
npm run build:app
npm run android:sync
```

### Scenario 4: Development with Deepfake Testing

```bash
# .env
VITE_BUILD_TARGET=app
VITE_ENABLE_DEEPFAKE=true
VITE_DEEPFAKE_PROVIDER=truthscan
VITE_DEEPFAKE_API_KEY=sk_test_xxxxx  # Use test key

# Run dev server
npm run dev:app
```

## Build Verification

After building, verify the configuration:

```bash
# Check environment variables
npm run check:env

# Check build output
ls -la dist/web/   # or dist/app/
```

## Troubleshooting

### "Deepfake detection not working"

**Check**:
1. Built with `npm run build:app` (not `build:web`)
2. `.env` has `VITE_BUILD_TARGET=app`
3. `.env` has `VITE_ENABLE_DEEPFAKE=true`
4. `.env` has valid `VITE_DEEPFAKE_API_KEY`

### "Environment variables not loading"

**Solutions**:
1. Ensure `.env` is in project root
2. Restart dev server after changing `.env`
3. Check `.env` syntax (no quotes around values)
4. Verify variables start with `VITE_` prefix

### "Build fails with TypeScript errors"

**Solutions**:
```bash
# Clean build artifacts
rm -rf dist/ node_modules/.vite

# Reinstall dependencies
npm install

# Try building again
npm run build:app
```

### "Mobile sync fails"

**Solutions**:
```bash
# Ensure app is built first
npm run build:app

# Check Capacitor config
npx cap doctor

# Sync again
npx cap sync android  # or ios
```

## Security Considerations

### API Keys in Builds

- ⚠️ **Never commit `.env` to version control**
- ⚠️ API keys are embedded in compiled builds
- ✅ Use separate keys for development/production
- ✅ Rotate keys if builds are distributed publicly
- ✅ Consider using a proxy server for production API calls

### Secure Build Pipeline

For production releases:

1. Use CI/CD environment variables (not `.env` file)
2. Encrypt API keys in your CI/CD system
3. Use read-only/scoped API keys when possible
4. Monitor API usage for anomalies
5. Rotate keys after each public release

### Example GitHub Actions

```yaml
# .github/workflows/build.yml
name: Build App
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build app
        env:
          VITE_BUILD_TARGET: app
          VITE_ENABLE_DEEPFAKE: true
          VITE_DEEPFAKE_API_KEY: ${{ secrets.DEEPFAKE_API_KEY }}
        run: npm run build:app
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: app-build
          path: dist/app/
```

## Build Optimization

### Reduce Bundle Size

1. **Tree shaking** - Unused code is automatically removed
2. **Code splitting** - Route-based lazy loading is configured
3. **Asset optimization** - Images and videos are compressed

### Performance Tips

```typescript
// Lazy load heavy features
const DeepfakeDetector = lazy(() => import('./services/deepfakeDetector'));

// Conditional imports
if (IS_APP_BUILD) {
  const { deepfakeDetector } = await import('./services/deepfakeDetector');
}
```

## Deployment Targets

### Web Deployment

**Recommended hosts**:
- Netlify (automatic builds from git)
- Vercel (optimized for React)
- GitHub Pages (free for public repos)
- Cloudflare Pages (fast CDN)

**Build command**: `npm run build:web`  
**Publish directory**: `dist/web`

### App Distribution

**Android**:
- Google Play Store (production)
- APK direct download (testing)
- Firebase App Distribution (beta testing)

**iOS**:
- Apple App Store (production)
- TestFlight (beta testing)

## Continuous Integration

### Basic CI Script

```bash
#!/bin/bash
# ci-build.sh

set -e  # Exit on error

echo "Installing dependencies..."
npm ci

echo "Running tests..."
npm test

echo "Building web version..."
npm run build:web

echo "Building app version..."
npm run build:app

echo "Build complete!"
ls -la dist/
```

Make executable and run:
```bash
chmod +x ci-build.sh
./ci-build.sh
```

## Resources

- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Capacitor Build Guide](https://capacitorjs.com/docs/basics/building-your-app)
- [Environment Variables in Vite](https://vitejs.dev/guide/env-and-mode.html)

---

**Last Updated**: February 2026
