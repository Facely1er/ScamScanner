/**
 * Centralized product configuration and pricing text
 * Avoid duplication by importing from here
 */

export const appName = "Cyberstition – Trust Signals";
export const brandName = "Cyberstition";
export const tagline = "Trust signals";
export const publisher = "by ERMITS";
export const priceLabel = "$5.99 one-time";

/**
 * Store URLs — replace these before app store submission.
 * Set to empty string to hide the link in the UI.
 */
export const playStoreUrl = "https://play.google.com/store/apps/details?id=com.ermits.cyberstition";
export const appStoreUrl = ""; // populate when iOS build is ready

/**
 * Pricing plans for subscription model (future use)
 */
export const pricingPlans = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: '4.99',
    priceValue: 4.99,
    interval: 'month',
    billingPeriod: 'month',
    description: 'Full access, billed monthly',
    savings: '',
  },
  annual: {
    id: 'annual',
    name: 'Annual',
    price: '49.99',
    priceValue: 49.99,
    interval: 'year',
    billingPeriod: 'year',
    description: 'Save 17% with annual billing',
    savings: 'Save $10/year',
    monthlyEquivalent: '$4.16/month',
  },
  lifetime: {
    id: 'lifetime',
    name: 'Lifetime',
    price: '79.99',
    priceValue: 79.99,
    interval: 'once',
    billingPeriod: 'one-time',
    description: 'Pay once, use forever',
    savings: 'Best value',
  },
};

/**
 * Premium features list
 */
export const premiumFeatures = [
  'Unlimited scam scans',
  'Multi-signal analysis',
  'Pattern detection library',
  'Export scan results',
  'Analysis history',
  'Priority support',
];

