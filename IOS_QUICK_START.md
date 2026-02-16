# iOS Quick Start

Get your iOS app running with Capacitor.

## Prerequisites

- **macOS** with Xcode (iOS development is not supported on Windows/Linux)
- Node.js 18+
- CocoaPods (`sudo gem install cocoapods` if needed)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Build the Web App

```bash
npm run build:app
```

## Step 3: Initialize iOS Platform (if not already added)

```bash
npm run ios:init
```

## Step 4: Sync to iOS

```bash
npm run ios:sync
```

## Step 5: Open in Xcode

```bash
npm run ios:open
```

Then in Xcode: select a simulator or device and click Run.

## Running the App

### From Xcode
1. Open via `npm run ios:open`
2. Select a simulator or connected device
3. Click the Run button

### From Command Line
```bash
npm run ios:run
```

## Development Workflow

After making changes to your React app:

```bash
npm run build:app
npm run ios:sync
```

Or use the combined command:

```bash
npm run ios:build
```

## Note for Windows/Linux

The `ios/` project is generated and can be committed or shared, but building and running the iOS app requires macOS and Xcode. If you're on Windows, use the Android project (`npm run android:open` / `npm run android:run`) for local testing.
