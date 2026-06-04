import { isKeyUsed, markKeyUsed, addCredits } from './creditStore';

// Secret embedded in bundle — acceptable at this price point for MVP.
// Rotate by shipping a new build version if compromised.
const SECRET = 'cbst-mvp-2025-xK9mP2nQ';

const PACKAGES: Record<string, number> = {
  R1: 1,
  R5: 5,
  R20: 20,
};

// djb2 hash — fast, no async, sufficient for bundle-secret validation
function djb2(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
    h = h >>> 0; // keep 32-bit unsigned
  }
  return h;
}

function computeSig(pack: string, nonce: string): string {
  const payload = `CBST-${pack}-${nonce}-${SECRET}`;
  return djb2(payload).toString(16).padStart(8, '0').toUpperCase();
}

export interface KeyValidationResult {
  valid: boolean;
  credits: number;
  error?: string;
}

export function validateAndRedeemKey(rawKey: string): KeyValidationResult {
  const key = rawKey.trim().toUpperCase();

  // Format: CBST-R5-A1B2C3D4-XXXXXXXX
  const parts = key.split('-');
  if (parts.length !== 4 || parts[0] !== 'CBST') {
    return { valid: false, credits: 0, error: 'Invalid key format. Keys look like: CBST-R5-A1B2C3D4-XXXXXXXX' };
  }

  const [, pack, nonce, sig] = parts;

  if (!PACKAGES[pack]) {
    return { valid: false, credits: 0, error: 'Unknown package code in key.' };
  }

  if (nonce.length !== 8 || sig.length !== 8) {
    return { valid: false, credits: 0, error: 'Malformed key. Please check and try again.' };
  }

  const expectedSig = computeSig(pack, nonce);
  if (sig !== expectedSig) {
    return { valid: false, credits: 0, error: 'Key signature is invalid. This key may have been modified.' };
  }

  if (isKeyUsed(key)) {
    return { valid: false, credits: 0, error: 'This key has already been redeemed on this device.' };
  }

  const credits = PACKAGES[pack];
  markKeyUsed(key);
  addCredits(credits);

  return { valid: true, credits };
}

// — Key generator (run offline to produce keys for buyers) —
// Usage: call generateKey('R5') to get a key for the 5-report pack.
// Not exposed in the UI — seller use only.
export function generateKey(pack: 'R1' | 'R5' | 'R20'): string {
  const nonce = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
  const sig = computeSig(pack, nonce);
  return `CBST-${pack}-${nonce}-${sig}`;
}
