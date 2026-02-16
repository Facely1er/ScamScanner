import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

export default function TrustNotice() {
  const { t } = useLocale();
  return (
    <section className="notice">
      <div className="kicker" style={{ color: 'var(--text)' }}>
        <ShieldCheck size={16} /> {t('common.trustNoticeKicker')}
      </div>
      <div className="small" style={{ marginTop: 6 }}>
        {t('common.trustNoticeBody')}
      </div>
    </section>
  );
}
