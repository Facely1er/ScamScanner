# Android Quick Start

Get your Android app running in 5 minutes.

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check if Android Studio is installed
# If not, download from: https://developer.android.com/studio
```

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Build the Web App

```bash
npm run build:app
```

This creates the web app that will be wrapped by Android.

## Step 3: Initialize Android Platform

```bash
npm run android:init
```

This creates the `android/` directory with the native Android project.

## Step 4: Sync to Android

```bash
npm run android:sync
```

This copies your built web app into the Android project.

## Step 5: Open in Android Studio

```bash
npm run android:open
```

This opens Android Studio where you can:
- Run the app on an emulator
- Run on a connected device
- Build release versions

## Running the App

### Option 1: From Android Studio
1. Open Android Studio (via `npm run android:open`)
2. Click the green "Run" button
3. Select an emulator or connected device

### Option 2: From Command Line
```bash
npm run android:run
```

This builds, syncs, and runs the app automatically.

## Development Workflow

After making changes to your React app:

```bash
# 1. Rebuild the web app
npm run build:app

# 2. Sync to Android
npm run android:sync

# 3. Run in Android Studio or via command line
npm run android:run
```

Or use the combined command:
```bash
npm run android:build
```

## Troubleshooting

### "SDK location not found"
Set the `ANDROID_HOME` environment variable:
- Windows: `set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk`
- Mac/Linux: `export ANDROID_HOME=~/Library/Android/sdk`

### "Gradle sync failed"
- Make sure Java JDK 17+ is installed
- Check Android Studio SDK Manager has required SDKs

### App not updating
- Run `npm run android:sync` after building
- Clear app data: Settings > Apps > Cyberstition > Clear Data

## Next Steps

1. ✅ App running on emulator/device
2. 📱 Test all features
3. 🔐 Set up signing for release
4. 🏪 Configure Play Store products
5. 📦 Build release bundle
6. 🚀 Upload to Play Store

For detailed instructions, see `ANDROID_SETUP.md`.

