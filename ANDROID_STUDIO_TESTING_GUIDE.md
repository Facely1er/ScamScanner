# Android Studio Testing Guide
## Step-by-Step Testing Instructions

---

## 1. Opening the Project

The project should now be open in Android Studio. If it didn't open automatically:

1. Open Android Studio manually
2. Click **File > Open**
3. Navigate to: `C:\Users\facel\Downloads\GitHub\ScamScanner\android`
4. Click **OK**

---

## 2. Initial Setup (First Time Only)

### Wait for Gradle Sync
- Android Studio will automatically sync Gradle
- Wait for the sync to complete (progress bar at bottom)
- If sync fails, see Troubleshooting section

### Install Required SDKs (If Needed)
1. Click **Tools > SDK Manager**
2. Ensure these are installed:
   - Android SDK Platform 34 (Android 14)
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
3. Click **Apply** if any are missing

---

## 3. Setting Up an Emulator

### Create Virtual Device
1. Click **Tools > Device Manager**
2. Click **Create Device**
3. Select a device (e.g., **Pixel 6**)
4. Click **Next**
5. Select a system image:
   - Recommended: **API 34 (Android 14)** or **API 33 (Android 13)**
   - Click **Download** if not installed
6. Click **Next**
7. Review configuration and click **Finish**

### Start Emulator
1. In Device Manager, click the **Play** button next to your device
2. Wait for emulator to boot (may take 1-2 minutes)

---

## 4. Running the App

### Option 1: Using Run Button
1. Ensure emulator is running or device is connected
2. Click the green **Run** button (▶) in toolbar
3. Or press **Shift + F10**
4. Select your device/emulator
5. Click **OK**

### Option 2: Using Command Line
```bash
npm run android:run
```

---

## 5. What to Test

### Basic Functionality
- [ ] App launches successfully
- [ ] Home screen displays correctly
- [ ] Navigation works (bottom nav on mobile)
- [ ] Theme toggle works (light/dark mode)
- [ ] All pages load without errors

### Tools Testing
- [ ] Message Analysis tool works
- [ ] Email Header Analyzer works
- [ ] Image Metadata Analyzer works
- [ ] Social Profile Verifier works
- [ ] Guided Scan workflow works

### Features Testing
- [ ] Dashboard displays correctly
- [ ] History/sessions save properly
- [ ] Settings/Account page works
- [ ] Pricing page displays correctly
- [ ] Empty states show when appropriate
- [ ] Loading states display correctly

### UI/UX Testing
- [ ] All buttons are clickable
- [ ] Text is readable
- [ ] Icons display correctly
- [ ] Cards and layouts look good
- [ ] Responsive on different screen sizes
- [ ] Dark/light theme both work

### Performance Testing
- [ ] App launches quickly (< 3 seconds)
- [ ] Smooth scrolling
- [ ] No lag when switching pages
- [ ] Tools analyze quickly
- [ ] No memory leaks (test for 10+ minutes)

---

## 6. Testing on Physical Device

### Enable USB Debugging
1. On your Android device:
   - Go to **Settings > About Phone**
   - Tap **Build Number** 7 times (enables Developer Options)
   - Go back to **Settings > Developer Options**
   - Enable **USB Debugging**

### Connect Device
1. Connect device via USB
2. On device, allow USB debugging when prompted
3. In Android Studio, device should appear in device list
4. Click **Run** and select your device

---

## 7. Debugging

### View Logs
1. Click **View > Tool Windows > Logcat**
2. Filter by your app: Select **Cyberstition** in filter
3. Look for errors (red text) or warnings (yellow text)

### Breakpoints
1. Click left margin in code to set breakpoint
2. Run in **Debug** mode (🐛 icon)
3. App will pause at breakpoint
4. Inspect variables and step through code

### Common Issues
- **App crashes on launch:** Check Logcat for error messages
- **White screen:** Check if web assets synced correctly
- **Build errors:** Clean and rebuild project

---

## 8. Building Release Version

### Generate Signed Bundle (AAB)
1. Click **Build > Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Click **Next**
4. Select or create keystore:
   - **Create new** (first time) or **Use existing**
5. Enter keystore information
6. Click **Next**
7. Select **release** build variant
8. Click **Finish**
9. AAB file will be at: `android/app/release/app-release.aab`

### Generate Signed APK (Alternative)
1. Follow same steps but select **APK** instead
2. APK file will be at: `android/app/release/app-release.apk`

---

## 9. Troubleshooting

### Gradle Sync Failed
**Solution:**
1. Click **File > Invalidate Caches / Restart**
2. Select **Invalidate and Restart**
3. Wait for Android Studio to restart
4. Let Gradle sync again

### "SDK location not found"
**Solution:**
1. Click **File > Project Structure**
2. Set **Android SDK location**
3. Or set `ANDROID_HOME` environment variable

### App Not Updating
**Solution:**
1. Run: `npm run android:sync`
2. In Android Studio: **Build > Clean Project**
3. Then: **Build > Rebuild Project**
4. Uninstall app from device/emulator
5. Run again

### Build Errors
**Solution:**
1. Check **Build** tab for specific errors
2. Ensure all dependencies are installed
3. Try: **File > Sync Project with Gradle Files**
4. Check Java version (need JDK 17+)

### App Crashes
**Solution:**
1. Check **Logcat** for error messages
2. Look for red error text
3. Common causes:
   - Missing permissions
   - Network issues
   - JavaScript errors
   - Missing assets

---

## 10. Testing Checklist

### Pre-Release Testing
- [ ] App runs on Android 10
- [ ] App runs on Android 11
- [ ] App runs on Android 12
- [ ] App runs on Android 13
- [ ] App runs on Android 14
- [ ] Test on phone (small screen)
- [ ] Test on tablet (large screen)
- [ ] Test in portrait mode
- [ ] Test in landscape mode
- [ ] Test with dark theme
- [ ] Test with light theme
- [ ] Test all navigation paths
- [ ] Test all tools
- [ ] Test purchase flow (redirects to Play Store)
- [ ] Test offline functionality
- [ ] Test with slow internet
- [ ] No crashes after extended use
- [ ] Memory usage is reasonable
- [ ] Battery usage is reasonable

---

## 11. Performance Monitoring

### Monitor in Android Studio
1. Click **View > Tool Windows > Profiler**
2. Select your app
3. Monitor:
   - **CPU:** Should be low when idle
   - **Memory:** Should be stable (no leaks)
   - **Network:** Check data usage

### Check App Size
- App should be reasonable size (< 50MB)
- Check in: **Build > Analyze APK**

---

## 12. Quick Commands Reference

```bash
# Build web app
npm run build:app

# Sync to Android
npm run android:sync

# Open in Android Studio
npm run android:open

# Build and run
npm run android:run

# Build for release
npm run android:build
```

---

## 13. Next Steps After Testing

Once testing is complete:

1. **Fix any bugs** found during testing
2. **Optimize performance** if needed
3. **Update version** if making changes
4. **Build release AAB** for Play Store
5. **Follow Play Store submission** guide

---

## 14. Getting Help

### Android Studio Help
- **Help > Find Action** (Ctrl+Shift+A)
- **Help > Documentation**
- Android Studio has built-in help

### Capacitor Help
- Documentation: https://capacitorjs.com/docs
- Community: https://github.com/ionic-team/capacitor

### Project-Specific
- Check `ANDROID_SETUP.md` for setup issues
- Check `ANDROID_COMPLETION_CHECKLIST.md` for requirements

---

**Happy Testing! 🚀**

If you encounter any issues, check the Troubleshooting section or the Logcat output for error messages.

