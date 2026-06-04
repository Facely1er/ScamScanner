const INVESTIGATION_KEY = 'cyberstition_investigation_usage';
const USAGE_EVENT = 'cyberstition:usage';

const FREE_MONTHLY_LIMIT = 5;

interface InvestigationUsage {
  count: number;
  resetAt: number; // first day of next month, epoch ms
}

function getNextMonthStart(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
}

function loadUsage(): InvestigationUsage {
  try {
    const raw = localStorage.getItem(INVESTIGATION_KEY);
    if (!raw) return { count: 0, resetAt: getNextMonthStart() };
    const parsed = JSON.parse(raw) as InvestigationUsage;
    if (typeof parsed.count !== 'number' || typeof parsed.resetAt !== 'number') {
      return { count: 0, resetAt: getNextMonthStart() };
    }
    // Reset if past the reset date
    if (Date.now() >= parsed.resetAt) {
      return { count: 0, resetAt: getNextMonthStart() };
    }
    return parsed;
  } catch {
    return { count: 0, resetAt: getNextMonthStart() };
  }
}

function saveUsage(usage: InvestigationUsage): void {
  localStorage.setItem(INVESTIGATION_KEY, JSON.stringify(usage));
  window.dispatchEvent(new CustomEvent(USAGE_EVENT));
}

export function getInvestigationStatus(): {
  used: number;
  remaining: number;
  limit: number;
  limitReached: boolean;
  resetAt: number;
} {
  const usage = loadUsage();
  const remaining = Math.max(0, FREE_MONTHLY_LIMIT - usage.count);
  return {
    used: usage.count,
    remaining,
    limit: FREE_MONTHLY_LIMIT,
    limitReached: remaining === 0,
    resetAt: usage.resetAt,
  };
}

export function canStartInvestigation(): boolean {
  return !getInvestigationStatus().limitReached;
}

export function consumeInvestigation(): boolean {
  const usage = loadUsage();
  if (usage.count >= FREE_MONTHLY_LIMIT) return false;
  saveUsage({ ...usage, count: usage.count + 1 });
  return true;
}

export function subscribeToUsageChanges(handler: () => void): () => void {
  window.addEventListener(USAGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(USAGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

// Legacy exports kept so existing imports don't break
export const TOOL_IDS = {
  MESSAGES: 'ai_message_detector',
  PROFILES: 'ai_profile_verifier',
  IMAGES: 'ai_image_analyzer',
  EMAIL: 'ai_email_analyzer',
} as const;

export function canUseTool(_toolId: string): boolean {
  return true;
}

export function isUnlocked(): boolean {
  return true;
}
