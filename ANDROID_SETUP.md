# Android Setup Guide

Complete guide for setting up and building the Cyberstition Android app.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Android Studio** (latest version with Android SDK)
3. **Java Development Kit (JDK)** 17 or higher
4. **Android SDK** (API level 33+ recommended)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Android Platform

```bash
npm run android:init
```

This will:
- Create the `android/` directory
- Set up the Android project structure
- Configure Gradle build files

### 3. Build the Web App

```bash
npm run build:app
```

This builds the React app for the Android wrapper.

### 4. Sync to Android

```bash
npm run android:sync
```

This copies the built web app to the Android project.

## Development Workflow

### Open in Android Studio

```bash
npm run android:open
```

This opens the project in Android Studio where you can:
- Run on emulator or device
- Debug native code
- Configure signing

### Sync After Changes

After making changes to the web app:

```bash
npm run build:app && npm run android:sync
```

Or use the combined command:

```bash
npm run android:build
```

## Android Configuration

### App ID and Package Name

The app ID is configured in `capacitor.config.ts`:
- `appId`: `com.ermits.cyberstition`
- `appName`: `Cyberstition`

### Permissions

Required permissions are automatically configured. The app needs:
- Internet access (for Play Store verification)
- Network state (for connectivity checks)

### Signing Configuration

For release builds, you need to configure signing:

1. Create a keystore:
```bash
keytool -genkey -v -keystore cyberstition-release.keystore -alias cyberstition -keyalg RSA -keysize 2048 -validity 10000
```

2. Create `android/keystore.properties`:
```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=cyberstition
storeFile=../cyberstition-release.keystore
```

3. Update `android/app/build.gradle` to use the keystore (see Android Studio documentation)

## Play Store Setup

### 1. Create App in Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Set package name: `com.ermits.cyberstition`
4. Complete store listing

### 2. Set Up In-App Products

1. Go to **Monetize** > **Products** > **In-app products**
2. Create products matching your pricing tiers:
   - `pro_lifetime` - Pro one-time purchase
   - `unlimited_lifetime` - Unlimited one-time purchase
   - `pro_monthly` - Pro monthly subscription
   - `unlimited_monthly` - Unlimited monthly subscription

3. Update `src/config/app.ts` with your product IDs

### 3. Configure Play Billing

The app uses `@capacitor-community/in-app-purchase` for Play Billing integration.

Update `src/services/purchaseService.ts` to use actual product IDs from Play Console.

## Building for Release

### 1. Build Release Bundle (AAB)

In Android Studio:
1. **Build** > **Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Choose your keystore
4. Select **release** build variant
5. Build the bundle

Or via command line:
```bash
cd android
./gradlew bundleRelease
```

The AAB file will be at: `android/app/build/outputs/bundle/release/app-release.aab`

### 2. Upload to Play Console

1. Go to Play Console > **Release** > **Production**
2. Upload the AAB file
3. Complete the release checklist
4. Submit for review

## Testing

### Test on Emulator

1. Open Android Studio
2. Create/start an emulator
3. Run the app: `npm run android:run`

### Test on Physical Device

1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging
3. Connect device via USB
4. Run: `npm run android:run`

### Test In-App Purchases

1. Add test accounts in Play Console
2. Use test product IDs (they start with `android.test.`)
3. Test purchase flow in debug builds

## Troubleshooting

### Build Errors

**Error: SDK location not found**
- Set `ANDROID_HOME` environment variable
- Or set `sdk.dir` in `android/local.properties`

**Error: Gradle sync failed**
- Check Java version (must be JDK 17+)
- Update Android Gradle Plugin if needed

### Sync Issues

**Changes not appearing in app**
- Run `npm run android:sync` after building
- Clear app data and reinstall

### Purchase Issues

**Purchases not working**
- Verify product IDs match Play Console
- Check app is signed with release key
- Ensure app is published (at least in internal testing)

## Environment Variables

Create `.env` file for environment-specific configs:

```env
# Build target
BUILD_TARGET=app

# Play Store (update after publishing)
PLAY_STORE_URL=https://play.google.com/store/apps/details?id=com.ermits.cyberstition
```

## Project Structure

```
.
├── android/                 # Android native project (generated)
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml
│   │   │       └── java/
│   │   └── build.gradle
│   └── build.gradle
├── capacitor.config.ts      # Capacitor configuration
├── dist/app/               # Built web app (for Android)
└── src/                    # React source code
```

## Next Steps

1. ✅ Complete initial setup
2. ✅ Configure signing for release
3. ✅ Set up Play Console app
4. ✅ Create in-app products
5. ✅ Test on devices
6. ✅ Build release bundle
7. ✅ Upload to Play Store
8. ✅ Submit for review

## Resources

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Google Play Console](https://play.google.com/console)
- [Play Billing Documentation](https://developer.android.com/google/play/billing)
