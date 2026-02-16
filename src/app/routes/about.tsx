import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TrustNotice from '../../components/common/TrustNotice';
import { useLocale } from '../../contexts/LocaleContext';

export default function About() {
  const { t } = useLocale();

  return (
    <div className="grid">
      <section className="card">
        <h1 className="h1">{t('about.title')}</h1>
        <p className="p">{t('about.intro')}</p>
        <hr />
        <ul className="small">
          <li><strong>{t('about.onDeviceTitle')}</strong>: {t('about.onDeviceDesc')}</li>
          <li><strong>{t('about.privacyTitle')}</strong>: {t('about.privacyDesc')}</li>
          <li><strong>{t('about.indicatorsTitle')}</strong>: {t('about.indicatorsDesc')}</li>
          <li><strong>{t('about.verificationTitle')}</strong>: {t('about.verificationDesc')}</li>
        </ul>
        <div style={{ marginTop: 16 }}>
          <Link
            to="/how-it-works"
            className="btn primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            {t('about.learnHowItWorks')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="card">
        <h2 className="h2">{t('about.faqTitle')}</h2>
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">{t('about.faqPurchaseQ')}</h3>
            <p className="small" style={{ opacity: 0.9 }}>{t('about.faqPurchaseA')}</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">{t('about.faqAccuracyQ')}</h3>
            <p className="small" style={{ opacity: 0.9 }}>{t('about.faqAccuracyA')}</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">{t('about.faqThreatsQ')}</h3>
            <p className="small" style={{ opacity: 0.9 }}>{t('about.faqThreatsA')}</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">{t('about.faqOfflineQ')}</h3>
            <p className="small" style={{ opacity: 0.9 }}>{t('about.faqOfflineA')}</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">{t('about.faqDevicesQ')}</h3>
            <p className="small" style={{ opacity: 0.9 }}>{t('about.faqDevicesA')}</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">{t('about.faqPrivacyQ')}</h3>
            <p className="small" style={{ opacity: 0.9 }}>{t('about.faqPrivacyA')}</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 className="h3">{t('about.faqRefundQ')}</h3>
            <p className="small" style={{ opacity: 0.9 }}>{t('about.faqRefundA')}</p>
          </div>
        </div>
      </section>

      <TrustNotice />
    </div>
  );
}
