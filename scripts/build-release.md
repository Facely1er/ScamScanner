# Building Release AAB for Play Store

## Prerequisites

1. **Android Studio** installed
2. **Release Keystore** created (see `create-keystore.md`)
3. **Java JDK** installed (Android Studio includes this)

## Step-by-Step Guide

### 1. Open Project in Android Studio

```bash
# From project root
npm run android:open
```

Or manually:
- Open Android Studio
- File → Open → Select `android` folder

### 2. Sync Gradle Files

- Android Studio should auto-sync
- If not: File → Sync Project with Gradle Files
- Wait for sync to complete

### 3. Configure Signing

#### Option A: Using `android/app/build.gradle` (Recommended)

1. Open `android/app/build.gradle`
2. Add signing config:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('path/to/your/release.keystore')
            storePassword 'your-keystore-password'
            keyAlias 'your-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

#### Option B: Using `keystore.properties` (More Secure)

1. Create `android/keystore.properties`:
```properties
storePassword=your-keystore-password
keyPassword=your-key-password
keyAlias=your-key-alias
storeFile=../path/to/release.keystore
```

2. Add to `android/app/build.gradle`:
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }
    ...
}
```

**Important**: Add `keystore.properties` to `.gitignore`!

### 4. Build Release AAB

#### Method 1: Android Studio GUI

1. Build → Generate Signed Bundle / APK
2. Select **Android App Bundle**
3. Click **Next**
4. Select your keystore
5. Enter passwords
6. Select **release** build variant
7. Click **Finish**
8. AAB will be in `android/app/release/app-release.aab`

#### Method 2: Command Line

```bash
cd android
./gradlew bundleRelease
```

The AAB will be at: `android/app/build/outputs/bundle/release/app-release.aab`

### 5. Verify AAB

```bash
# Check AAB contents (optional)
bundletool build-apks \
  --bundle=app-release.aab \
  --output=app.apks \
  --mode=universal
```

### 6. Upload to Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Release → Production (or Internal Testing)
4. Create new release
5. Upload `app-release.aab`
6. Fill in release notes
7. Review and roll out

## Troubleshooting

### "Keystore file not found"
- Check path is correct (relative to `android/app/`)
- Use absolute path if needed
- Ensure keystore file exists

### "Keystore password incorrect"
- Double-check passwords
- Try opening keystore with `keytool` to verify

### "Build failed"
- Check Android Studio error messages
- Ensure all dependencies are synced
- Clean build: Build → Clean Project
- Rebuild: Build → Rebuild Project

### "AAB too large"
- Check bundle size in Play Console
- Consider enabling ProGuard/R8
- Review dependencies

## Security Notes

- **Never commit keystore to git**
- **Never commit passwords to git**
- **Backup keystore securely** (you'll need it for updates)
- **Store keystore password securely** (password manager)

## Next Steps

After building:
1. Test AAB on device (optional)
2. Upload to Play Console
3. Complete store listing
4. Submit for review

