/**
 * Usage limits enforcement
 *
 * Three tiers:
 *   1. Web build  → landing page only, tools always locked
 *   2. App build (free tier) → daily limit per tool, then paywall
 *   3. App build (unlocked)  → unlimited (user purchased one-time)
 */

import { IS_APP_BUILD, IS_WEB_BUILD } from '../../config/env';

type UsageRecord = {
  used: number;
  resetAt: number; // epoch ms
  toolId: string;
};

const STORAGE_PREFIX = 'cyberstition_usage_';
const UNLOCK_KEY = 'cyberstition_unlocked';
const USAGE_EVENT = 'cyberstition:usage';

/** Free-tier daily limit per tool (app builds only). */
const FREE_TIER_DAILY_LIMIT = 3;

// Tool IDs mapping
export const TOOL_IDS = {
  MESSAGES: 'ai_message_detector',
  PROFILES: 'ai_profile_verifier',
  IMAGES: 'ai_image_analyzer',
  EMAIL: 'ai_email_analyzer',
} as const;

/**
 * Check if user has unlocked premium (one-time purchase).
 */
export function isUnlocked(): boolean {
  if (typeof window === 'undefined') return false;

  // Web builds are always locked — no tool access
  if (IS_WEB_BUILD) return false;

  // App builds: check purchase status
  if (IS_APP_BUILD) {
    const unlocked = window.localStorage.getItem(UNLOCK_KEY);
    return unlocked === 'true';
  }

  // Fallback (dev): check localStorage
  const unlocked = window.localStorage.getItem(UNLOCK_KEY);
  return unlocked === 'true';
}

/**
 * Set unlock status (called after successful purchase or restore).
 */
export function setUnlocked(unlocked: boolean): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(UNLOCK_KEY, unlocked ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent(USAGE_EVENT));
}

/**
 * Get next midnight in local time.
 */
function getNextMidnightMs(now = new Date()): number {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

/**
 * Load usage record for a tool.
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
 * Save usage record.
 */
function saveRecord(record: UsageRecord): void {
  const key = STORAGE_PREFIX + record.toolId;
  window.localStorage.setItem(key, JSON.stringify(record));
  window.dispatchEvent(new CustomEvent(USAGE_EVENT, { detail: { toolId: record.toolId } }));
}

/**
 * Normalize record — reset counter if past midnight.
 */
function normalizeRecord(record: UsageRecord): UsageRecord {
  const nowMs = Date.now();
  if (nowMs >= record.resetAt) {
    return { used: 0, resetAt: getNextMidnightMs(new Date(nowMs)), toolId: record.toolId };
  }
  return record;
}

/**
 * Get usage status for a tool.
 *
 * - Unlocked users: unlimited
 * - App free tier: daily limit
 * - Web builds: always locked
 */
export function getUsageStatus(toolId: string): {
  toolId: string;
  used: number;
  remaining: number;
  limit: number;
  limitReached: boolean;
  resetAt: number;
  isUnlocked: boolean;
} {
  // Unlocked → unlimited
  if (isUnlocked()) {
    return {
      toolId,
      used: 0,
      remaining: Infinity,
      limit: Infinity,
      limitReached: false,
      resetAt: getNextMidnightMs(),
      isUnlocked: true,
    };
  }

  // Web builds → always locked
  if (IS_WEB_BUILD) {
    return {
      toolId,
      used: 0,
      remaining: 0,
      limit: 0,
      limitReached: true,
      resetAt: getNextMidnightMs(),
      isUnlocked: false,
    };
  }

  // App free tier → daily limit
  const record = normalizeRecord(loadRecord(toolId));
  const remaining = Math.max(0, FREE_TIER_DAILY_LIMIT - record.used);

  return {
    toolId,
    used: record.used,
    remaining,
    limit: FREE_TIER_DAILY_LIMIT,
    limitReached: remaining <= 0,
    resetAt: record.resetAt,
    isUnlocked: false,
  };
}

/**
 * Check if tool can be used right now.
 */
export function canUseTool(toolId: string): boolean {
  if (isUnlocked()) return true;
  if (IS_WEB_BUILD) return false;

  const record = normalizeRecord(loadRecord(toolId));
  return record.used < FREE_TIER_DAILY_LIMIT;
}

/**
 * Consume one free use for a tool.
 * Returns true if allowed, false if limit reached.
 */
export function consumeFreeUse(toolId: string): boolean {
  if (isUnlocked()) return true;
  if (IS_WEB_BUILD) return false;

  const record = normalizeRecord(loadRecord(toolId));
  if (record.used >= FREE_TIER_DAILY_LIMIT) return false;

  record.used += 1;
  saveRecord(record);
  return true;
}

/**
 * Subscribe to usage changes (for reactive UI updates).
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
