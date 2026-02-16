import React, { useState } from 'react';
import { Check, Zap, Star, Crown } from 'lucide-react';
import { pricingPlans, premiumFeatures } from '../app/config/product';

/**
 * Pricing cards for monthly, annual, and lifetime plans
 */
export default function PricingCards() {
  const [selectedPlan, setSelectedPlan] = useState<string>('annual');

  const plans = [
    {
      ...pricingPlans.monthly,
      icon: <Zap size={22} />,
      features: premiumFeatures,
      cta: 'Start Monthly',
    },
    {
      ...pricingPlans.annual,
      icon: <Star size={22} />,
      features: premiumFeatures,
      cta: 'Start Annual',
      popular: true,
    },
    {
      ...pricingPlans.lifetime,
      icon: <Crown size={22} />,
      features: [...premiumFeatures, 'Lifetime updates included'],
      cta: 'Get Lifetime Access',
    },
  ];

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    // Redirect to Play Store for app purchase
    // Note: This component is for web builds showing subscription options
    // App builds use one-time purchase via Play Store
    const { getPlayStoreUrl } = await import('../config/app');
    window.open(getPlayStoreUrl(), '_blank');
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
      }}
    >
      {plans.map((plan) => {
        const isPopular = 'popular' in plan && plan.popular;
        const isSelected = selectedPlan === plan.id;

        return (
          <div
            key={plan.id}
            className="card"
            style={{
              position: 'relative',
              border: isPopular
                ? '2px solid var(--primary)'
                : '1px solid var(--border)',
              backgroundColor: isPopular
                ? 'var(--bg-secondary)'
                : 'var(--card)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {isPopular && (
              <div
                style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '4px 14px',
                  borderRadius: 999,
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Most Popular
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  padding: 8,
                  borderRadius: 10,
                  backgroundColor: isPopular
                    ? 'var(--primary)'
                    : 'rgba(155,125,212,0.12)',
                  color: isPopular ? 'white' : 'var(--primary)',
                  display: 'flex',
                }}
              >
                {plan.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{plan.name}</div>
                {'savings' in plan && plan.savings && (
                  <span
                    className="small"
                    style={{
                      color: 'var(--success)',
                      fontWeight: 600,
                    }}
                  >
                    {plan.savings}
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)' }}>
                ${plan.price}
              </span>
              <span
                className="small"
                style={{ marginLeft: 4, color: 'var(--text-muted)' }}
              >
                /{'billingPeriod' in plan && plan.billingPeriod === 'one-time' ? 'forever' : plan.interval}
              </span>
              {'monthlyEquivalent' in plan && plan.monthlyEquivalent && (
                <div
                  className="small"
                  style={{ marginTop: 4, color: 'var(--text-muted)' }}
                >
                  {plan.monthlyEquivalent as React.ReactNode}
                </div>
              )}
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', flex: 1 }}>
              {plan.features.map((feature: string) => (
                <li
                  key={feature}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: 10,
                    marginBottom: 10,
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Check
                    size={16}
                    style={{
                      color: 'var(--success)',
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan(plan.id)}
              className={`btn ${isPopular ? 'primary' : ''}`}
              style={{
                width: '100%',
                padding: '12px 20px',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Zap size={16} />
              {plan.cta}
            </button>
          </div>
        );
      })}
    </div>
  );
}
