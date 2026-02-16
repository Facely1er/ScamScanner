import React from 'react';
import { Check, Download } from 'lucide-react';
import { appConfig } from '../../config/app';
import { useLocale } from '../../contexts/LocaleContext';
import { isDemoMode, isUnlocked } from '../core/usageLimits';
import { initiatePurchase } from '../../services/purchaseService';

export default function Pricing() {
  const { t } = useLocale();
  const demoMode = isDemoMode();
  const unlocked = isUnlocked();
  const [isPurchasing, setIsPurchasing] = React.useState(false);

  const handleGetApp = async () => {
    if (demoMode) {
      // In demo mode, try to initiate in-app purchase
      setIsPurchasing(true);
      try {
        await initiatePurchase();
      } catch (error) {
        console.error('Purchase failed:', error);
        // Fallback to Play Store URL
        window.open(appConfig.playStoreUrl, '_blank');
      } finally {
        setIsPurchasing(false);
      }
    } else {
      // Web build or not in demo mode, open Play Store
      window.open(appConfig.playStoreUrl, '_blank');
    }
  };

  return (
    <div className="grid" style={{ maxWidth: 600, margin: '0 auto' }}>
      <section className="card">
        <h1 className="h1">{t('pricing.getBrand', { brandName: t('product.brandName') })}</h1>
        {unlocked ? (
          <p className="p" style={{ marginTop: 8, color: 'var(--success, rgb(21 128 61))' }}>
            ✓ {t('pricing.fullAccessThanks')}
          </p>
        ) : demoMode ? (
          <p className="p" style={{ marginTop: 8 }}>
            {t('pricing.upgradeFromDemo')}
          </p>
        ) : (
          <p className="p" style={{ marginTop: 8 }}>
            {t('pricing.purchaseToAccess')}
          </p>
        )}
      </section>

      {demoMode && (
        <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <h2 className="h2" style={{ marginBottom: 12 }}>{t('pricing.demoVersion')}</h2>
          <p className="p" style={{ marginBottom: 16 }}>
            {t('pricing.demoLimitsIntro')}
          </p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li className="small" style={{ marginBottom: 8 }}>
              {t('pricing.scansPerToolPerDay', { count: appConfig.demo.scansPerTool })}
            </li>
            <li className="small" style={{ marginBottom: 8 }}>
              {t('pricing.noBatchProcessing')}
            </li>
            <li className="small" style={{ marginBottom: 8 }}>
              {t('pricing.noExportFunctionality')}
            </li>
            <li className="small">
              {t('pricing.limitedAdvancedFeatures')}
            </li>
          </ul>
        </section>
      )}

      <section className="card" style={{ 
        border: '2px solid var(--primary)', 
        backgroundColor: 'var(--bg-secondary)' 
      }}>
        <div className="kicker" style={{ color: 'var(--primary)' }}>
          {t('product.priceLabel')}
        </div>
        <h2 className="h2" style={{ marginTop: 8 }}>{t('pricing.unlockAllFeatures')}</h2>
        <ul style={{ marginTop: 16, paddingLeft: 0, listStyle: 'none' }}>
          <li style={{ marginBottom: 12, display: 'flex', alignItems: 'start', gap: 12 }}>
            <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <span>{t('product.premiumFeatures.0')}</span>
          </li>
          <li style={{ marginBottom: 12, display: 'flex', alignItems: 'start', gap: 12 }}>
            <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <span>{t('product.premiumFeatures.1')}</span>
          </li>
          <li style={{ marginBottom: 12, display: 'flex', alignItems: 'start', gap: 12 }}>
            <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <span>{t('product.premiumFeatures.2')}</span>
          </li>
          <li style={{ marginBottom: 12, display: 'flex', alignItems: 'start', gap: 12 }}>
            <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <span>{t('product.premiumFeatures.3')}</span>
          </li>
          <li style={{ marginBottom: 12, display: 'flex', alignItems: 'start', gap: 12 }}>
            <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <span>{t('product.premiumFeatures.4')}</span>
          </li>
          <li style={{ marginBottom: 12, display: 'flex', alignItems: 'start', gap: 12 }}>
            <Check size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
            <span>{t('product.premiumFeatures.5')}</span>
          </li>
        </ul>

        <div style={{ marginTop: 24 }}>
          {unlocked ? (
            <div style={{ 
              padding: 16, 
              backgroundColor: 'var(--success-bg, rgba(34, 197, 94, 0.1))', 
              borderRadius: 8,
              border: '1px solid var(--success, rgb(34 197 94))',
              textAlign: 'center'
            }}>
              <p className="p" style={{ margin: 0, color: 'var(--success, rgb(21 128 61))' }}>
                ✓ {t('pricing.fullAccessThanks')}
              </p>
            </div>
          ) : (
            <button
              onClick={handleGetApp}
              disabled={isPurchasing}
              className="btn primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Download size={16} />
              {isPurchasing ? '...' : (demoMode ? t('pricing.buyNow') : t('pricing.getTheApp'))}
            </button>
          )}
        </div>
      </section>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <p className="small" style={{ opacity: 0.8 }}>
          All analysis happens locally on your device. No data is collected or transmitted. 
          Your privacy is protected.
        </p>
      </section>
    </div>
  );
}

