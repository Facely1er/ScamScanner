import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, User, Image as ImageIcon, Mail, FileText, Download, Shield, WifiOff, Target, Search, Link2, BarChart3 } from 'lucide-react';
import TrustNotice from '../../components/common/TrustNotice';
import NextSteps from '../../components/common/NextSteps';
import { IS_WEB_BUILD } from '../../config/env';
import { getStoreUrlByDevice } from '../../config/app';
import { useLocale } from '../../contexts/LocaleContext';

export default function Home() {
  const { t } = useLocale();
  const handleGetApp = () => {
    window.open(getStoreUrlByDevice(), '_blank');
  };

  // Web build: Landing page only
  if (IS_WEB_BUILD) {
    return (
      <div className="grid">
        <section className="card">
          <h1 className="h1">{t('home.heroTitle')}</h1>
          <p className="p">{t('home.heroSubtitle')}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <Link className="btn" to="/how-it-works">{t('home.howItWorksLink')}</Link>
          </div>
        </section>

        <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} /> {t('home.availableToolsKicker')}
          </div>
          <p className="p" style={{ marginTop: 8 }}>{t('home.availableToolsDesc')}</p>
        </section>

        <div className="grid cols-2">
          <ToolCard title={t('home.toolMessageDetective')} desc={t('home.toolMessageDetectiveDesc')} icon={<MessageSquare size={18} />} />
          <ToolCard title={t('home.toolProfileChecker')} desc={t('home.toolProfileCheckerDesc')} icon={<User size={18} />} />
          <ToolCard title={t('home.toolImageInspector')} desc={t('home.toolImageInspectorDesc')} icon={<ImageIcon size={18} />} />
          <ToolCard title={t('home.toolEmailAnalyzer')} desc={t('home.toolEmailAnalyzerDesc')} icon={<Mail size={18} />} />
        </div>

        <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div className="kicker" style={{ color: 'var(--text)' }}>
            <Download size={16} /> {t('home.getStartedKicker')}
          </div>
          <p className="p" style={{ marginTop: 8 }}>{t('home.getStartedDesc')}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button onClick={handleGetApp} className="btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Download size={16} />
              {t('home.getTheApp')}
            </button>
            <Link className="btn" to="/pricing">{t('home.viewPricing')}</Link>
          </div>
        </section>

        <TrustNotice />
      </div>
    );
  }

  // App build: Full functionality
  return (
    <div className="grid loose">
      <section className="card" style={{
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg) 100%)',
        border: '2px solid var(--primary)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            padding: 12,
            borderRadius: 12,
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 52,
            height: 52
          }}>
            <img 
              src="/cyberstition_logo.png" 
              alt={t('product.brandName')} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain' 
              }} 
            />
          </div>
          <div>
            <div className="kicker" style={{ margin: 0, color: 'var(--primary)' }}>{t('home.recommendedKicker')}</div>
            <h2 className="h2" style={{ margin: 0, marginTop: 4 }}>{t('home.guidedScanTitle')}</h2>
          </div>
        </div>
        <p className="p">{t('home.guidedScanIntro')}</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginTop: 16,
          marginBottom: 16,
          padding: 16,
          backgroundColor: 'var(--bg)',
          borderRadius: 8
        }}>
          <div>
            <div className="small" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Target size={18} style={{ color: 'var(--primary)' }} /> {t('home.contextAware')}
            </div>
            <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>{t('home.contextAwareDesc')}</div>
          </div>
          <div>
            <div className="small" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Search size={18} style={{ color: 'var(--primary)' }} /> {t('home.patternDetection')}
            </div>
            <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>{t('home.patternDetectionDesc')}</div>
          </div>
          <div>
            <div className="small" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link2 size={18} style={{ color: 'var(--primary)' }} /> {t('home.crossSignals')}
            </div>
            <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>{t('home.crossSignalsDesc')}</div>
          </div>
          <div>
            <div className="small" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <BarChart3 size={18} style={{ color: 'var(--primary)' }} /> {t('home.confidenceScore')}
            </div>
            <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>{t('home.confidenceScoreDesc')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link className="btn primary" to="/scan" style={{ fontSize: '1.05em', padding: '12px 24px' }}>
            {t('home.startGuidedScan')}
          </Link>
          <Link className="btn" to="/how-it-works">{t('home.howItWorksLink')}</Link>
        </div>
      </section>

      <section className="card">
        <h1 className="h1">{t('home.questionTitle')}</h1>
        <p className="p">{t('home.questionSubtitle')}</p>
      </section>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <h2 className="h2" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Shield size={24} style={{ color: 'var(--primary)' }} />
          {t('home.whyCyberstition')}
        </h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Shield size={20} style={{ color: 'var(--primary)' }} />
              <h3 className="h3" style={{ margin: 0 }}>{t('home.privateTitle')}</h3>
            </div>
            <p className="small">{t('home.privateDesc')}</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Download size={20} style={{ color: 'var(--primary)' }} />
              <h3 className="h3" style={{ margin: 0 }}>{t('home.oneTimeTitle')}</h3>
            </div>
            <p className="small">{t('home.oneTimeDesc')}</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <User size={20} style={{ color: 'var(--primary)' }} />
              <h3 className="h3" style={{ margin: 0 }}>{t('home.noAccountTitle')}</h3>
            </div>
            <p className="small">{t('home.noAccountDesc')}</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <WifiOff size={20} style={{ color: 'var(--primary)' }} />
              <h3 className="h3" style={{ margin: 0 }}>{t('home.worksOfflineTitle')}</h3>
            </div>
            <p className="small">{t('home.worksOfflineDesc')}</p>
          </div>
        </div>
      </section>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={16} /> {t('home.howGuidedScansKicker')}
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'start' }}>
            <div style={{
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600
            }}>1</div>
            <div>
              <div className="small" style={{ fontWeight: 600 }}>{t('home.step1Title')}</div>
              <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>{t('home.step1Desc')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'start' }}>
            <div style={{
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600
            }}>2</div>
            <div>
              <div className="small" style={{ fontWeight: 600 }}>{t('home.step2Title')}</div>
              <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>{t('home.step2Desc')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'start' }}>
            <div style={{
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600
            }}>3</div>
            <div>
              <div className="small" style={{ fontWeight: 600 }}>{t('home.step3Title')}</div>
              <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>{t('home.step3Desc')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
            <div style={{
              minWidth: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600
            }}>4</div>
            <div>
              <div className="small" style={{ fontWeight: 600 }}>{t('home.step4Title')}</div>
              <div className="small" style={{ marginTop: 4, opacity: 0.8 }}>{t('home.step4Desc')}</div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ marginTop: 8 }}>
        <h2 className="h2" style={{ marginBottom: 16 }}>{t('home.orUseIndividualTools')}</h2>
        <div className="grid cols-2">
          <ToolCard
            to="/tools?tool=message"
            title={t('home.toolMessageDetective')}
            desc={t('home.messageDetectiveExample')}
            example='Example: "Urgent! Your account will be suspended in 24 hours. Click here now!"'
            icon={<MessageSquare size={18} />}
            color="#3b82f6"
          />
          <ToolCard
            to="/tools?tool=profile"
            title={t('home.toolProfileChecker')}
            desc={t('home.profileCheckerExample')}
            example={t('home.profileCheckerExample')}
            icon={<User size={18} />}
            color="#10b981"
          />
          <ToolCard
            to="/tools?tool=image"
            title={t('home.toolImageInspector')}
            desc={t('home.imageInspectorExample')}
            example={t('home.imageInspectorExample')}
            icon={<ImageIcon size={18} />}
            color="#f59e0b"
          />
          <ToolCard
            to="/tools?tool=email"
            title={t('home.toolEmailAnalyzer')}
            desc={t('home.emailAnalyzerExample')}
            example={t('home.emailAnalyzerExample')}
            icon={<Mail size={18} />}
            color="#ef4444"
          />
        </div>
        <p className="small" style={{ marginTop: 12, opacity: 0.7, textAlign: 'center' }}>
          {t('home.individualToolsNote')}
        </p>
      </div>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="kicker" style={{ color: 'var(--text)' }}>
          <FileText size={16} /> {t('home.yourHistoryKicker')}
        </div>
        <p className="p" style={{ marginTop: 8 }}>{t('home.yourHistoryDesc')}</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <Link className="btn primary" to="/dashboard">{t('home.viewDashboard')}</Link>
          <Link className="btn" to="/account">{t('home.preferences')}</Link>
        </div>
      </section>

      <TrustNotice />
    </div>
  );
}

function ToolCard({ to, title, desc, icon, example, color = 'var(--primary)' }: { 
  to?: string; 
  title: string; 
  desc: string; 
  icon: React.ReactNode;
  example?: string;
  color?: string;
}) {
  const { t } = useLocale();
  if (IS_WEB_BUILD) {
    return (
      <div className="card" style={{ opacity: 0.8 }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 12, 
            background: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {React.cloneElement(icon as React.ReactElement, { size: 24, color })}
          </div>
          <div style={{ flex: 1 }}>
            <div className="kicker" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
              <span>{title}</span>
              <span className="badge">{t('home.inAppBadge')}</span>
            </div>
            <p className="p" style={{ marginTop: 8, marginBottom: 0 }}>{desc}</p>
            {example && (
              <p className="text-xs" style={{ 
                fontStyle: 'italic', 
                color: 'var(--text-muted)',
                padding: 8,
                background: 'var(--bg-secondary)',
                borderRadius: 6,
                marginTop: 8
              }}>
                {example}
              </p>
            )}
            <div style={{ marginTop: 12 }} className="small">{t('home.availableAfterPurchase')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={to!} className="card" style={{ display: 'block' }}>
      <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
        <div style={{ 
          width: 48, 
          height: 48, 
          borderRadius: 12, 
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {React.cloneElement(icon as React.ReactElement, { size: 24, color })}
        </div>
        <div style={{ flex: 1 }}>
          <div className="kicker" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
            <span>{title}</span>
            <span className="badge">{t('home.signalsBadge')}</span>
          </div>
          <p className="p" style={{ marginTop: 8, marginBottom: 0 }}>{desc}</p>
          {example && (
            <p className="text-xs" style={{ 
              fontStyle: 'italic', 
              color: 'var(--text-muted)',
              padding: 8,
              background: 'var(--bg-secondary)',
              borderRadius: 6,
              marginTop: 8
            }}>
              {example}
            </p>
          )}
          <div style={{ marginTop: 12 }} className="small">{t('home.highLevelIndicators')}</div>
        </div>
      </div>
    </Link>
  );
}
