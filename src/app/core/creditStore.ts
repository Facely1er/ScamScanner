const CREDITS_KEY = 'cyberstition_report_credits';
const USED_KEYS_KEY = 'cyberstition_used_keys';
const USAGE_EVENT = 'cyberstition:credits';

export interface CreditBalance {
  credits: number;
  updatedAt: number;
}

export function getCredits(): number {
  try {
    const raw = localStorage.getItem(CREDITS_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as CreditBalance;
    return typeof parsed.credits === 'number' ? Math.max(0, parsed.credits) : 0;
  } catch {
    return 0;
  }
}

export function addCredits(amount: number): void {
  const current = getCredits();
  const updated: CreditBalance = { credits: current + amount, updatedAt: Date.now() };
  localStorage.setItem(CREDITS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(USAGE_EVENT));
}

export function consumeCredit(): boolean {
  const current = getCredits();
  if (current <= 0) return false;
  const updated: CreditBalance = { credits: current - 1, updatedAt: Date.now() };
  localStorage.setItem(CREDITS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(USAGE_EVENT));
  return true;
}

export function isKeyUsed(key: string): boolean {
  try {
    const raw = localStorage.getItem(USED_KEYS_KEY);
    const used: string[] = raw ? JSON.parse(raw) : [];
    return used.includes(key.toUpperCase());
  } catch {
    return false;
  }
}

export function markKeyUsed(key: string): void {
  try {
    const raw = localStorage.getItem(USED_KEYS_KEY);
    const used: string[] = raw ? JSON.parse(raw) : [];
    used.push(key.toUpperCase());
    localStorage.setItem(USED_KEYS_KEY, JSON.stringify(used));
  } catch {}
}

export function subscribeToCredits(handler: () => void): () => void {
  window.addEventListener(USAGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(USAGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
