/**
 * Usage limits enforcement
 * Supports:
 * - Web builds: Always locked (landing page only)
 * - Demo mode: Limited scans per tool
 * - Full access: Unlimited (verified purchase)
 */

import { IS_APP_BUILD, IS_WEB_BUILD } from '../../config/env';
import { appConfig } from '../../config/app';
import { hasVerifiedPurchase } from '../../services/purchaseService';

type UsageRecord = {
  used: number;
  resetAt: number; // epoch ms
  toolId: string;
  trialStartedAt?: number; // epoch ms - when demo trial started
};

const STORAGE_PREFIX = 'cyberstition_usage_';
const UNLOCK_KEY = 'cyberstition_unlocked';
const TRIAL_START_KEY = 'cyberstition_trial_start';
const USAGE_EVENT = 'cyberstition:usage';

// Tool IDs mapping
export const TOOL_IDS = {
  MESSAGES: 'ai_message_detector',
  PROFILES: 'ai_profile_verifier',
  IMAGES: 'ai_image_analyzer',
  EMAIL: 'ai_email_analyzer',
} as const;

/**
 * Check if user has unlocked premium access (verified purchase)
 */
export function isUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Web builds are always locked - no tool access
  if (IS_WEB_BUILD) {
    return false;
  }
  
  // Check for verified purchase
  if (hasVerifiedPurchase()) {
    return true;
  }
  
  try {
    const unlocked = window.localStorage.getItem(UNLOCK_KEY);
    if (unlocked === 'true') return true;
  } catch {
    // localStorage unavailable (private mode, quota, etc.)
  }
  return false;
}

/**
 * Check if demo mode is active (not purchased, but can use limited features)
 */
export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Web builds are not demo mode - they're locked
  if (IS_WEB_BUILD) {
    return false;
  }
  
  // If unlocked (purchased), not in demo mode
  if (isUnlocked()) {
    return false;
  }
  
  // Demo mode enabled in config and app build
  return appConfig.demoModeEnabled && IS_APP_BUILD;
}

/**
 * Check if trial period has expired
 */
function isTrialExpired(): boolean {
  if (!appConfig.demo.trialDays || appConfig.demo.trialDays === 0) {
    return false; // No time limit
  }
  
  if (typeof window === 'undefined') return true;
  try {
    const trialStartStr = window.localStorage.getItem(TRIAL_START_KEY);
    if (!trialStartStr) {
      window.localStorage.setItem(TRIAL_START_KEY, Date.now().toString());
      return false;
    }
    const trialStart = parseInt(trialStartStr, 10);
    const trialEnd = trialStart + (appConfig.demo.trialDays * 24 * 60 * 60 * 1000);
    return Date.now() >= trialEnd;
  } catch {
    return false;
  }
}

/**
 * Get demo scan limit for a tool
 */
function getDemoLimit(toolId: string): number {
  return appConfig.demo.scansPerTool;
}

/**
 * Set unlock status (called after successful purchase)
 */
export function setUnlocked(unlocked: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(UNLOCK_KEY, unlocked ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent(USAGE_EVENT));
  } catch {
    // ignore storage errors
  }
}

/**
 * Get next midnight in local time (24h from last reset)
 */
function getNextMidnightMs(now = new Date()): number {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

/**
 * Load usage record for a tool
 */
function loadRecord(toolId: string): UsageRecord {
  const key = STORAGE_PREFIX + toolId;
  const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  
  if (!raw) {
    return { used: 0, resetAt: getNextMidnightMs(), toolId };
  }
  
  try {
    const parsed = JSON.parse(raw) as UsageRecord;
    if (typeof parsed.used !== 'number' || typeof parsed.resetAt !== 'number') {
      return { used: 0, resetAt: getNextMidnightMs(), toolId };
    }
    return { ...parsed, toolId };
  } catch {
    return { used: 0, resetAt: getNextMidnightMs(), toolId };
  }
}

/**
 * Save usage record
 */
function saveRecord(record: UsageRecord): void {
  try {
    const key = STORAGE_PREFIX + record.toolId;
    window.localStorage.setItem(key, JSON.stringify(record));
    window.dispatchEvent(new CustomEvent(USAGE_EVENT, { detail: { toolId: record.toolId } }));
  } catch {
    // ignore storage errors (quota, private mode)
  }
}

/**
 * Normalize record (reset if past reset time)
 */
function normalizeRecord(record: UsageRecord): UsageRecord {
  const nowMs = Date.now();
  if (nowMs >= record.resetAt) {
    return { used: 0, resetAt: getNextMidnightMs(new Date(nowMs)), toolId: record.toolId };
  }
  return record;
}

/**
 * Get usage status for a tool
 * Returns usage information including demo limits if applicable
 */
export function getUsageStatus(toolId: string): {
  toolId: string;
  used: number;
  remaining: number;
  limitReached: boolean;
  resetAt: number;
  isUnlocked: boolean;
  isDemoMode: boolean;
  trialExpired?: boolean;
} {
  const unlocked = isUnlocked();
  
  // Full access (purchased)
  if (unlocked) {
    return {
      toolId,
      used: 0,
      remaining: Infinity,
      limitReached: false,
      resetAt: getNextMidnightMs(),
      isUnlocked: true,
      isDemoMode: false,
    };
  }
  
  // Web builds are always locked (no tool access)
  if (IS_WEB_BUILD) {
    return {
      toolId,
      used: 0,
      remaining: 0,
      limitReached: true,
      resetAt: getNextMidnightMs(),
      isUnlocked: false,
      isDemoMode: false,
    };
  }
  
  // Demo mode - check limits
  const demoMode = isDemoMode();
  if (demoMode) {
    // Check if trial period expired
    const trialExpired = isTrialExpired();
    if (trialExpired && appConfig.demo.trialDays > 0) {
      return {
        toolId,
        used: 0,
        remaining: 0,
        limitReached: true,
        resetAt: getNextMidnightMs(),
        isUnlocked: false,
        isDemoMode: true,
        trialExpired: true,
      };
    }
    
    // Check scan limits
    const record = normalizeRecord(loadRecord(toolId));
    const limit = getDemoLimit(toolId);
    const remaining = Math.max(0, limit - record.used);
    const limitReached = record.used >= limit;
    
    return {
      toolId,
      used: record.used,
      remaining,
      limitReached,
      resetAt: record.resetAt,
      isUnlocked: false,
      isDemoMode: true,
      trialExpired: false,
    };
  }
  
  // Fallback: locked
  return {
    toolId,
    used: 0,
    remaining: 0,
    limitReached: true,
    resetAt: getNextMidnightMs(),
    isUnlocked: false,
    isDemoMode: false,
  };
}

/**
 * Check if tool can be used
 * Returns true if user can use the tool (purchased or within demo limits)
 */
export function canUseTool(toolId: string): boolean {
  if (isUnlocked()) {
    return true; // Unlimited for purchased users
  }
  
  if (IS_WEB_BUILD) {
    return false; // Web builds locked
  }
  
  // Check demo mode limits
  const status = getUsageStatus(toolId);
  return !status.limitReached;
}

/**
 * Consume one use for a tool
 * Returns true if allowed, false if limit reached
 */
export function consumeFreeUse(toolId: string): boolean {
  if (isUnlocked()) {
    return true; // Unlimited for unlocked users
  }
  
  if (IS_WEB_BUILD) {
    return false; // Web builds locked
  }

  const status = getUsageStatus(toolId);
  if (status.limitReached) {
    return false;
  }

  const record = normalizeRecord(loadRecord(toolId));
  record.used += 1;
  saveRecord(record);
  
  return true;
}

/**
 * Check if a feature is available (for demo mode restrictions)
 */
export function isFeatureAvailable(feature: keyof typeof appConfig.demo.features): boolean {
  if (isUnlocked()) {
    return true; // All features available for purchased users
  }
  
  if (!isDemoMode()) {
    return false; // No features if not in demo mode
  }
  
  return appConfig.demo.features[feature];
}

/**
 * Subscribe to usage changes (for reactive UI updates)
 */
export function subscribeToUsageChanges(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const listener = () => handler();
  window.addEventListener(USAGE_EVENT, listener as EventListener);
  window.addEventListener('storage', listener);
  
  return () => {
    window.removeEventListener(USAGE_EVENT, listener as EventListener);
    window.removeEventListener('storage', listener);
  };
}

