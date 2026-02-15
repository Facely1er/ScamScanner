/**
 * Purchase service for Play Store in-app purchases
 * Handles purchase verification and unlock status
 */

import { appConfig } from '../config/app';
import { setUnlocked } from '../app/core/usageLimits';

const PURCHASE_KEY = 'cyberstition_purchase_verified';
const PURCHASE_TOKEN_KEY = 'cyberstition_purchase_token';
const PURCHASE_TIMESTAMP_KEY = 'cyberstition_purchase_timestamp';

export interface PurchaseResult {
  success: boolean;
  verified: boolean;
  error?: string;
}

/**
 * Check if user has a verified purchase
 */
export function hasVerifiedPurchase(): boolean {
  if (typeof window === 'undefined') return false;
  
  const verified = window.localStorage.getItem(PURCHASE_KEY);
  if (verified !== 'true') return false;
  
  // Verify purchase token exists
  const token = window.localStorage.getItem(PURCHASE_TOKEN_KEY);
  if (!token) return false;
  
  return true;
}

/**
 * Verify purchase with Play Store
 * In production, this should call your backend or Play Store API
 */
export async function verifyPurchase(purchaseToken: string): Promise<PurchaseResult> {
  try {
    // TODO: In production, implement actual Play Store purchase verification
    // This should call your backend API which verifies with Google Play Billing API
    // For now, we'll do a basic local verification
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, replace this with actual API call:
    // const response = await fetch('/api/verify-purchase', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ purchaseToken, packageName: appConfig.packageName })
    // });
    // const data = await response.json();
    
    // For development/testing, accept any non-empty token
    if (purchaseToken && purchaseToken.length > 0) {
      // Store verified purchase
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(PURCHASE_KEY, 'true');
        window.localStorage.setItem(PURCHASE_TOKEN_KEY, purchaseToken);
        window.localStorage.setItem(PURCHASE_TIMESTAMP_KEY, Date.now().toString());
        
        // Unlock the app
        setUnlocked(true);
      }
      
      return { success: true, verified: true };
    }
    
    return { success: false, verified: false, error: 'Invalid purchase token' };
  } catch (error) {
    return { 
      success: false, 
      verified: false, 
      error: error instanceof Error ? error.message : 'Purchase verification failed' 
    };
  }
}

/**
 * Initiate purchase flow using Capacitor
 */
export async function initiatePurchase(): Promise<PurchaseResult> {
  try {
    // Check if Capacitor is available
    const { Capacitor } = await import('@capacitor/core');
    
    if (!Capacitor.isNativePlatform()) {
      // Not on native platform, redirect to Play Store
      window.open(appConfig.playStoreUrl, '_blank');
      return { success: false, verified: false, error: 'Please purchase from Play Store' };
    }
    
    // TODO: Implement Capacitor purchase plugin integration
    // This requires @capacitor/purchases or similar plugin
    // Example:
    // const { Purchases } = await import('@capacitor/purchases');
    // const result = await Purchases.purchaseProduct({ 
    //   productId: appConfig.purchaseProductId 
    // });
    // return await verifyPurchase(result.purchaseToken);
    
    // For now, redirect to Play Store
    window.open(appConfig.playStoreUrl, '_blank');
    return { success: false, verified: false, error: 'Purchase flow not yet implemented' };
  } catch (error) {
    return { 
      success: false, 
      verified: false, 
      error: error instanceof Error ? error.message : 'Purchase initiation failed' 
    };
  }
}

/**
 * Restore purchases (for users who reinstalled or switched devices)
 */
export async function restorePurchases(): Promise<PurchaseResult> {
  try {
    const { Capacitor } = await import('@capacitor/core');
    
    if (!Capacitor.isNativePlatform()) {
      return { success: false, verified: false, error: 'Not on native platform' };
    }
    
    // TODO: Implement restore purchases
    // const { Purchases } = await import('@capacitor/purchases');
    // const purchases = await Purchases.getPurchases();
    // if (purchases.length > 0) {
    //   return await verifyPurchase(purchases[0].purchaseToken);
    // }
    
    // Check local storage for existing purchase
    if (hasVerifiedPurchase()) {
      setUnlocked(true);
      return { success: true, verified: true };
    }
    
    return { success: false, verified: false, error: 'No purchases found' };
  } catch (error) {
    return { 
      success: false, 
      verified: false, 
      error: error instanceof Error ? error.message : 'Restore purchases failed' 
    };
  }
}

/**
 * Clear purchase data (for testing/development)
 */
export function clearPurchaseData(): void {
  if (typeof window === 'undefined') return;
  
  window.localStorage.removeItem(PURCHASE_KEY);
  window.localStorage.removeItem(PURCHASE_TOKEN_KEY);
  window.localStorage.removeItem(PURCHASE_TIMESTAMP_KEY);
  setUnlocked(false);
}

