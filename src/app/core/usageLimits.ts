/**
 * Usage limits compatibility module.
 * Feature gating is disabled, so tools are always available.
 */

const USAGE_EVENT = 'cyberstition:usage';

// Tool IDs mapping
export const TOOL_IDS = {
  MESSAGES: 'ai_message_detector',
  PROFILES: 'ai_profile_verifier',
  IMAGES: 'ai_image_analyzer',
  EMAIL: 'ai_email_analyzer',
} as const;

/**
 * Feature gating disabled: always unlocked.
 */
export function isUnlocked(): boolean {
  return true;
}

/**
 * Kept for compatibility; unlock state is always on.
 */
export function setUnlocked(_unlocked: boolean): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(USAGE_EVENT));
}

function getNextMidnightMs(now = new Date()): number {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

/**
 * Get usage status for a tool (always unlocked).
 */
export function getUsageStatus(toolId: string): {
  toolId: string;
  used: number;
  remaining: number;
  limitReached: boolean;
  resetAt: number;
  isUnlocked: boolean;
} {
  return {
    toolId,
    used: 0,
    remaining: Infinity,
    limitReached: false,
    resetAt: getNextMidnightMs(),
    isUnlocked: true,
  };
}

/**
 * Check if tool can be used (always true).
 */
export function canUseTool(_toolId: string): boolean {
  return isUnlocked();
}

/**
 * Consume one free use for a tool
 * Compatibility behavior: always returns true.
 */
export function consumeFreeUse(_toolId: string): boolean {
  return true;
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
