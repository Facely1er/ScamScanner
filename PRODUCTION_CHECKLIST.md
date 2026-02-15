# Production Readiness Checklist

Use this checklist to verify the app is ready for production deployment.

## Pre-Build Verification

### Code Quality
- [ ] All TypeScript compilation errors resolved
- [ ] No console errors in development
- [ ] All TODO comments addressed or documented
- [ ] Code follows project conventions
- [ ] No hardcoded secrets or API keys

### Configuration
- [ ] `src/config/app.ts` updated with production values:
  - [ ] Play Store URL (after publishing)
  - [ ] Package name correct
  - [ ] Support email set
  - [ ] Privacy policy URL (if applicable)
- [ ] `capacitor.config.ts` configured:
  - [ ] App ID matches Play Store package name
  - [ ] App name correct
  - [ ] Web directory set to `dist/app`
- [ ] Environment variables documented in `.env.example`

### Build Scripts
- [ ] `npm run build:app` completes successfully
- [ ] `npm run build:web` completes successfully
- [ ] No build warnings (or warnings are acceptable)
- [ ] Build output size is reasonable

## Android-Specific

### Capacitor Setup
- [ ] Capacitor dependencies installed (`npm install`)
- [ ] `npx cap add android` completed successfully
- [ ] `android/` directory exists and is in `.gitignore`
- [ ] `capacitor.config.ts` properly configured

### Android Build
- [ ] `npm run android:sync` completes without errors
- [ ] Android project opens in Android Studio
- [ ] App builds in Android Studio (debug build)
- [ ] App runs on Android device/emulator
- [ ] All features work on Android

### Android Configuration
- [ ] `AndroidManifest.xml` permissions are correct
- [ ] App icon displays correctly
- [ ] Splash screen works
- [ ] App name displays correctly
- [ ] Package name matches Play Store listing

### Signing (Production)
- [ ] Keystore file created and secured
- [ ] Keystore password stored securely (not in code)
- [ ] Release build variant configured
- [ ] AAB file generated successfully
- [ ] AAB file tested before upload

## Functionality Testing

### Core Features
- [ ] All analysis tools work correctly
- [ ] Scan workflow functions properly
- [ ] Session history saves and loads
- [ ] Pattern detection works
- [ ] Cross-signal correlation works
- [ ] Error handling works (test error scenarios)

### User Experience
- [ ] Navigation works smoothly
- [ ] UI is responsive on mobile devices
- [ ] Dark/light theme works
- [ ] Loading states display correctly
- [ ] Error messages are user-friendly
- [ ] Offline functionality works

### Performance
- [ ] App loads quickly
- [ ] No memory leaks (test extended use)
- [ ] Smooth scrolling and interactions
- [ ] Large data sets handled gracefully
- [ ] No excessive battery drain

## Security & Privacy

### Data Handling
- [ ] No data sent to external servers (verify network requests)
- [ ] localStorage usage is appropriate
- [ ] No sensitive data in logs
- [ ] Error messages don't expose sensitive info

### Permissions
- [ ] Only necessary Android permissions requested
- [ ] Permission requests are clear and justified
- [ ] App works with minimal permissions

## Play Store Preparation

### Store Listing
- [ ] App name: "Cyberstition"
- [ ] Short description written
- [ ] Full description written
- [ ] Screenshots prepared (phone and tablet)
- [ ] Feature graphic created (1024x500)
- [ ] App icon (512x512) ready
- [ ] Privacy policy URL (if required)

### Content Rating
- [ ] Content rating questionnaire completed
- [ ] App appropriate for target audience

### Pricing & Distribution
- [ ] Pricing set correctly
- [ ] Countries selected for distribution
- [ ] Age restrictions configured (if any)

## Post-Publish

### After Upload
- [ ] Update `src/config/app.ts` with actual Play Store URL
- [ ] Test the published app from Play Store
- [ ] Verify purchase flow works
- [ ] Monitor crash reports (if enabled)

### Monitoring
- [ ] Set up error tracking (if applicable)
- [ ] Monitor user reviews
- [ ] Track app performance metrics
- [ ] Plan for updates and bug fixes

## Documentation

### User-Facing
- [ ] README.md is up to date
- [ ] User guide is clear (USER_GUIDE.md)
- [ ] FAQ section answers common questions

### Developer
- [ ] BUILD_GUIDE.md is accurate
- [ ] ANDROID_SETUP.md is complete
- [ ] Architecture documentation is current
- [ ] Code comments are helpful

## Final Steps

1. **Test on Real Devices**: Test on multiple Android devices and versions
2. **Beta Testing**: Consider internal testing track before production
3. **Backup**: Ensure all code and assets are backed up
4. **Version Control**: Tag release version in git
5. **Release Notes**: Prepare release notes for users

## Common Issues to Check

- [ ] App crashes on startup
- [ ] Features don't work on older Android versions
- [ ] App doesn't work offline
- [ ] Performance issues on low-end devices
- [ ] UI breaks on different screen sizes
- [ ] Permissions not requested properly
- [ ] Play Store purchase verification fails
- [ ] App doesn't update properly

## Emergency Contacts

- Developer: [Your contact]
- Support Email: [From app.ts]
- Play Store Support: https://support.google.com/googleplay/android-developer

---

**Note**: This checklist should be reviewed and updated as the project evolves. Not all items may be applicable to every release.

