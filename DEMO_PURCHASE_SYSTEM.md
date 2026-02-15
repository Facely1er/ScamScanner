# Demo & Purchase System Documentation

## Overview

The Android app now supports a **demo/trial version** with limited features and a **full paid version** with unlimited access. Users can explore the app with demo limitations and upgrade to full access through an in-app purchase.

## System Architecture

### Build Variants

1. **Web Build** (`BUILD_TARGET=web`)
   - Landing page only
   - No tool access
   - "Get the app" CTAs only

2. **App Build** (`BUILD_TARGET=app`)
   - Full app functionality
   - Demo mode enabled by default
   - Can be upgraded to full access via purchase

### Access Levels

1. **Demo Mode** (Default for app builds)
   - Limited scans per tool (configurable, default: 3 per tool)
   - No batch processing
   - No export functionality
   - Limited advanced features
   - Optional time-limited trial (configurable)

2. **Full Access** (After purchase)
   - Unlimited scans for all tools
   - All features enabled
   - Batch processing
   - Export functionality
   - Advanced analysis features

## Configuration

### App Configuration (`src/config/app.ts`)

```typescript
export const appConfig = {
  // Demo mode settings
  demoModeEnabled: true,
  demo: {
    scansPerTool: 3,        // Number of free scans per tool
    trialDays: 0,           // Trial period in days (0 = no time limit)
    features: {
      batchProcessing: false,
      exportResults: false,
      advancedAnalysis: false,
      fullSignalExplanations: false,
    },
  },
  // Purchase settings
  purchaseProductId: 'full_access',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=...',
};
```

## Key Components

### 1. Usage Limits (`src/app/core/usageLimits.ts`)

- `isUnlocked()` - Checks if user has verified purchase
- `isDemoMode()` - Checks if app is in demo mode
- `getUsageStatus(toolId)` - Returns usage information including demo limits
- `canUseTool(toolId)` - Checks if tool can be used
- `consumeFreeUse(toolId)` - Consumes one scan (respects limits)
- `isFeatureAvailable(feature)` - Checks if a feature is available in demo mode

### 2. Purchase Service (`src/services/purchaseService.ts`)

- `hasVerifiedPurchase()` - Checks for verified purchase
- `verifyPurchase(token)` - Verifies purchase with Play Store
- `initiatePurchase()` - Starts purchase flow
- `restorePurchases()` - Restores purchases (for reinstalls/device switches)

### 3. UI Components

- **PaywallModal** - Shows upgrade prompt when limits are reached
- **DemoStatus** - Shows demo usage limits and upgrade option
- **Account Page** - Shows purchase status and restore option

## Usage Flow

### Demo Mode Flow

1. User downloads app (demo mode active)
2. User can use tools with limited scans (e.g., 3 per tool)
3. When limit is reached, PaywallModal appears
4. User can upgrade to full access via in-app purchase
5. After purchase verification, app unlocks all features

### Purchase Flow

1. User clicks "Upgrade" button
2. `initiatePurchase()` is called
3. Capacitor purchase plugin initiates Play Store purchase flow
4. After successful purchase, `verifyPurchase()` is called
5. Purchase token is verified (with backend API in production)
6. App unlocks and user gets full access

### Restore Purchases

1. User clicks "Restore Purchases" in account page
2. `restorePurchases()` is called
3. System checks for existing purchases
4. If found, purchase is verified and app unlocks

## Implementation Details

### Purchase Verification

**Current Implementation:**
- Basic local verification for development/testing
- Accepts any non-empty purchase token

**Production Implementation Required:**
- Backend API endpoint to verify purchases with Google Play Billing API
- Secure token validation
- Purchase state management

**To implement production verification:**

1. Create backend API endpoint (e.g., `/api/verify-purchase`)
2. Update `verifyPurchase()` in `purchaseService.ts`:
   ```typescript
   const response = await fetch('/api/verify-purchase', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ 
       purchaseToken, 
       packageName: appConfig.packageName 
     })
   });
   const data = await response.json();
   ```

### Capacitor Purchase Plugin

**Note:** The purchase plugin integration is prepared but requires:

1. Install Capacitor purchase plugin (e.g., `@capacitor/purchases` or similar)
2. Configure in-app products in Google Play Console
3. Update `initiatePurchase()` to use the plugin

**Example integration:**
```typescript
import { Purchases } from '@capacitor/purchases';

const result = await Purchases.purchaseProduct({ 
  productId: appConfig.purchaseProductId 
});
return await verifyPurchase(result.purchaseToken);
```

## Testing

### Development Testing

1. **Test Demo Mode:**
   - Build app: `npm run build:app`
   - App starts in demo mode
   - Use tools until limits are reached
   - Verify PaywallModal appears

2. **Test Purchase Flow:**
   - Use localStorage to simulate purchase:
   ```javascript
   localStorage.setItem('cyberstition_purchase_verified', 'true');
   localStorage.setItem('cyberstition_purchase_token', 'test-token');
   ```
   - Reload app - should show full access

3. **Test Limits:**
   - Use tools multiple times
   - Verify limits are enforced
   - Check usage status updates correctly

### Production Testing

1. Set up Google Play Console with in-app products
2. Configure purchase product ID
3. Test purchase flow on real device
4. Verify purchase verification works
5. Test restore purchases functionality

## Files Modified/Created

### New Files
- `src/config/app.ts` - App configuration including demo settings
- `src/services/purchaseService.ts` - Purchase verification and management
- `src/components/common/DemoStatus.tsx` - Demo status display component
- `DEMO_PURCHASE_SYSTEM.md` - This documentation

### Modified Files
- `src/app/core/usageLimits.ts` - Added demo mode support
- `src/app/components/PaywallModal.tsx` - Enhanced with demo mode and purchase flow
- `src/app/routes/account.tsx` - Added purchase status and restore option
- `src/app/routes/pricing.tsx` - Updated with demo vs full comparison
- `package.json` - Added Capacitor dependencies

## Next Steps

1. **Set up Google Play Console:**
   - Create in-app product with ID matching `appConfig.purchaseProductId`
   - Configure pricing
   - Set up purchase verification API

2. **Implement Backend Verification:**
   - Create API endpoint for purchase verification
   - Integrate with Google Play Billing API
   - Update `purchaseService.ts` to use backend

3. **Install Purchase Plugin:**
   - Choose and install Capacitor purchase plugin
   - Configure plugin in Capacitor config
   - Update purchase flow to use plugin

4. **Testing:**
   - Test demo mode limits
   - Test purchase flow
   - Test restore purchases
   - Test on multiple devices

5. **Update Configuration:**
   - Set actual Play Store URL in `appConfig.playStoreUrl`
   - Adjust demo limits if needed
   - Configure trial period if desired

## Configuration Options

### Demo Limits

Adjust in `src/config/app.ts`:
- `scansPerTool`: Number of free scans per tool (default: 3)
- `trialDays`: Trial period in days (0 = no time limit, only scan limit)

### Feature Restrictions

Control which features are available in demo mode:
- `batchProcessing`: Enable/disable batch processing
- `exportResults`: Enable/disable export functionality
- `advancedAnalysis`: Enable/disable advanced features
- `fullSignalExplanations`: Enable/disable detailed explanations

## Support

For issues or questions:
- See `BUILD_GUIDE.md` for build process
- See `ANDROID_SETUP.md` for Android setup
- Check Google Play Billing documentation for purchase integration

