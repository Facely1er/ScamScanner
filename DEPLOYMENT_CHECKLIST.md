# Deployment Checklist - Video Analysis Feature

Use this checklist to ensure proper deployment of the video analysis feature.

## Pre-Deployment Checks

### Code Quality
- [x] TypeScript compilation passes (`npm run build:app`)
- [x] No critical linter errors
- [x] All imports resolved correctly
- [x] Feature flags configured properly
- [ ] Unit tests pass (if applicable)
- [ ] Manual testing completed

### Documentation
- [x] README.md updated
- [x] VIDEO_ANALYSIS.md created
- [x] BUILD_GUIDE.md created
- [x] QUICKSTART.md created
- [x] .env.example created
- [x] IMPLEMENTATION_SUMMARY.md created

### Configuration
- [x] `.env` in `.gitignore`
- [x] Environment variables documented
- [x] Feature flags properly set
- [x] Build scripts working
- [ ] API keys secured (if using deepfake)

## Development Environment

### Local Setup
```bash
# 1. Install dependencies
[ ] npm install

# 2. Configure environment
[ ] cp .env.example .env
[ ] Edit .env with your settings

# 3. Start dev server
[ ] npm run dev:app

# 4. Verify in browser
[ ] Navigate to http://localhost:3000
[ ] Test basic video upload
[ ] Test metadata analysis
[ ] (Optional) Test deepfake detection
```

### Build Tests
```bash
# Web build
[ ] npm run build:web
[ ] Check dist/web/ output
[ ] Test build locally: npm run preview:web

# App build
[ ] npm run build:app
[ ] Check dist/app/ output
[ ] Test build locally: npm run preview:app
```

## Production Deployment

### Web Deployment (Basic Features)

**Pre-flight**:
- [ ] Set `VITE_BUILD_TARGET=web` (or omit)
- [ ] Build: `npm run build:web`
- [ ] Test preview: `npm run preview:web`
- [ ] Verify video analysis loads (basic metadata only)

**Deploy**:
- [ ] Upload `dist/web/` to hosting provider
- [ ] Configure SPA routing (if needed)
- [ ] Test deployed URL
- [ ] Verify video upload works
- [ ] Check metadata extraction

**Hosting Options**:
- [ ] Netlify: drag & drop `dist/web/`
- [ ] Vercel: connect git repo
- [ ] GitHub Pages: commit to gh-pages branch
- [ ] Cloudflare Pages: connect repo

### App Deployment (Full Features)

**Pre-flight**:
- [ ] Set `VITE_BUILD_TARGET=app`
- [ ] Configure deepfake settings (if needed)
- [ ] Build: `npm run build:app`
- [ ] Test preview: `npm run preview:app`

**Android**:
```bash
[ ] npm run android:sync
[ ] npm run android:open
[ ] Build APK in Android Studio
[ ] Test on device/emulator
[ ] Sign APK for release
[ ] Upload to Play Store (or distribute APK)
```

**iOS** (macOS required):
```bash
[ ] npm run ios:sync
[ ] npm run ios:open
[ ] Build in Xcode
[ ] Test on device/simulator
[ ] Archive for App Store
[ ] Upload to TestFlight/App Store
```

## Environment Configuration

### Web Build (No API Key Needed)
```env
# Minimal configuration
# VITE_BUILD_TARGET=web  # or omit

# No other variables needed
```

### App Build (Basic - No Deepfake)
```env
# Enable app mode
VITE_BUILD_TARGET=app

# Deepfake disabled
VITE_ENABLE_DEEPFAKE=false  # or omit
```

### App Build (With Deepfake)
```env
# Enable app mode
VITE_BUILD_TARGET=app

# Enable deepfake detection
VITE_ENABLE_DEEPFAKE=true
VITE_DEEPFAKE_PROVIDER=truthscan
VITE_DEEPFAKE_API_KEY=sk_live_xxxxx  # Replace with real key
```

## Security Checklist

### API Key Security
- [ ] Never commit `.env` to git
- [ ] Use separate keys for dev/staging/prod
- [ ] Rotate keys after public releases
- [ ] Monitor API usage for anomalies
- [ ] Use scoped/read-only keys when possible
- [ ] Store production keys in CI/CD secrets

### Build Security
- [ ] No API keys in web builds
- [ ] No sensitive data in console logs
- [ ] HTTPS enforced in production
- [ ] CSP headers configured (optional)
- [ ] Rate limiting on API calls (optional)

## Feature Verification

### Basic Video Analysis
- [ ] Upload MP4 video
- [ ] Upload WebM video
- [ ] Upload MOV video
- [ ] Verify metadata extraction (duration, dimensions)
- [ ] Verify risk score calculation
- [ ] Verify error handling (large files, wrong format)
- [ ] Verify UI feedback

### Deepfake Detection (If Enabled)
- [ ] Verify "Deepfake Enabled" badge shows
- [ ] Upload test video
- [ ] Enable deepfake checkbox
- [ ] Analyze video
- [ ] Verify probability score shown
- [ ] Verify confidence level shown
- [ ] Verify error handling (API failures)

### UI/UX Testing
- [ ] Video preview displays correctly
- [ ] Loading states work
- [ ] Error messages are clear
- [ ] File size validation works
- [ ] Format validation works
- [ ] Progress indicators show
- [ ] Results display properly

## Performance Checks

### Web Performance
- [ ] Bundle size acceptable (<1MB main chunk)
- [ ] Page load time <3s
- [ ] Video upload responsive
- [ ] No memory leaks

### Mobile Performance
- [ ] App size acceptable (<50MB)
- [ ] Launch time <2s
- [ ] Video processing responsive
- [ ] Battery usage reasonable

## Monitoring Setup

### Analytics (Optional)
- [ ] Track video upload events
- [ ] Track analysis completion
- [ ] Track deepfake detection usage
- [ ] Track error rates
- [ ] Track API call success rates

### Error Tracking (Optional)
- [ ] Integrate error tracking (Sentry, etc.)
- [ ] Monitor API failures
- [ ] Monitor build errors
- [ ] Set up alerts for critical errors

## User Communication

### Documentation for Users
- [ ] Help text in UI explains features
- [ ] Limitations clearly stated (file size, format)
- [ ] Privacy policy updated (if video uploads occur)
- [ ] Terms updated (if using paid API)

### Support Preparation
- [ ] FAQ created for common issues
- [ ] Support email/channel set up
- [ ] Troubleshooting guide available
- [ ] Demo videos created (optional)

## Rollback Plan

### If Issues Arise
1. [ ] Keep previous build available
2. [ ] Document rollback procedure
3. [ ] Test rollback in staging
4. [ ] Have emergency contacts ready

### Emergency Rollback
```bash
# If needed, revert to previous version
git revert HEAD
npm run build:app
# Re-deploy
```

## Post-Deployment

### Immediate (First 24 Hours)
- [ ] Monitor error rates
- [ ] Check API usage
- [ ] Verify user feedback
- [ ] Test all features in production
- [ ] Check performance metrics

### Short Term (First Week)
- [ ] Review analytics
- [ ] Address user feedback
- [ ] Fix any bugs found
- [ ] Update documentation if needed
- [ ] Optimize performance if needed

### Long Term
- [ ] Plan feature enhancements
- [ ] Review API costs
- [ ] Consider additional providers
- [ ] Add more test coverage

## Success Criteria

### Deployment Successful If:
- [x] Build completes without errors
- [ ] Application deploys successfully
- [ ] Video analysis feature loads
- [ ] Basic metadata extraction works
- [ ] No critical errors in production
- [ ] User can complete video analysis workflow
- [ ] (If enabled) Deepfake detection works

### Rollback If:
- [ ] Critical errors preventing app use
- [ ] Video analysis completely broken
- [ ] Security vulnerabilities found
- [ ] API costs too high
- [ ] User experience severely degraded

## Sign-Off

**Deployment Completed By**: ___________________  
**Date**: ___________________  
**Build Version**: ___________________  
**Deployed To**: ___________________  
**Deepfake Enabled**: Yes [ ] No [ ]  
**Issues Found**: ___________________  
**Notes**: ___________________

---

## Quick Reference

**Build Commands**:
- `npm run dev:app` - Development with full features
- `npm run build:app` - Production build
- `npm run preview:app` - Test production build locally

**Key Files**:
- `.env` - Environment configuration
- `src/config/features.ts` - Feature flags
- `src/services/deepfakeDetector.ts` - API integration
- `src/app/components/scan/VideoAnalyzer.tsx` - UI component

**Documentation**:
- [QUICKSTART.md](./QUICKSTART.md) - Getting started
- [VIDEO_ANALYSIS.md](./VIDEO_ANALYSIS.md) - Detailed docs
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Build configuration
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Changes made

**Support**:
- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Email: (if configured)

---

**Last Updated**: February 16, 2026  
**Checklist Version**: 1.0
