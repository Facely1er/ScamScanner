import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, LayoutGrid, Settings, ChevronRight, Wrench, HelpCircle } from 'lucide-react';
import TrustNotice from '../../components/common/TrustNotice';
import { useLocale } from '../../contexts/LocaleContext';

export default function More() {
  const { t } = useLocale();

  return (
    <div className="grid">
      <section className="card">
        <h1 className="h1">{t('more.title')}</h1>
        <p className="p">{t('more.subtitle')}</p>
      </section>

      <section className="card">
        <div className="kicker" style={{ color: 'var(--text)' }}>{t('more.explore')}</div>
        <div className="link-list" style={{ marginTop: 12 }}>
          <MoreLink to="/" icon={<Home size={16} />} title={t('more.homeTitle')} description={t('more.homeDesc')} />
          <MoreLink to="/tools" icon={<Wrench size={16} />} title={t('more.toolsTitle')} description={t('more.toolsDesc')} />
          <MoreLink to="/how-it-works" icon={<HelpCircle size={16} />} title={t('more.howItWorksTitle')} description={t('more.howItWorksDesc')} />
          <MoreLink to="/about" icon={<BookOpen size={16} />} title={t('more.aboutTitle')} description={t('more.aboutDesc')} />
        </div>
      </section>

      <section className="card">
        <div className="kicker" style={{ color: 'var(--text)' }}>{t('more.manage')}</div>
        <div className="link-list" style={{ marginTop: 12 }}>
          <MoreLink to="/dashboard" icon={<LayoutGrid size={16} />} title={t('more.dashboardTitle')} description={t('more.dashboardDesc')} />
          <MoreLink to="/account" icon={<Settings size={16} />} title={t('more.preferencesTitle')} description={t('more.preferencesDesc')} />
        </div>
      </section>

      <TrustNotice />
    </div>
  );
}

function MoreLink({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link to={to} className="link-card">
      <div className="link-content">
        <div className="link-icon">{icon}</div>
        <div className="link-meta">
          <div className="link-title">{title}</div>
          <div className="link-desc">{description}</div>
        </div>
      </div>
      <div className="link-actions">
        <ChevronRight size={16} />
      </div>
    </Link>
  );
}
