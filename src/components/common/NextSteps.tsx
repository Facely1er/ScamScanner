import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ChevronRight, MessageSquare, Users, Image as ImageIcon, Mail } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

type EntryPoint = 'messages' | 'profiles' | 'images' | 'email';
type Origin = 'email' | 'profile' | 'message' | 'unknown';
type ToolKey = 'messages' | 'profiles' | 'images' | 'email';

const defaultOriginByEntry: Record<EntryPoint, Origin> = {
  messages: 'message',
  profiles: 'profile',
  images: 'message',
  email: 'email',
};

const entryRecommendations: Record<EntryPoint, ToolKey[]> = {
  messages: ['profiles', 'images'],
  email: ['profiles', 'messages'],
  profiles: ['messages', 'images'],
  images: ['messages', 'profiles'],
};

const originPriority: Record<Origin, ToolKey | null> = {
  email: 'email',
  profile: 'profiles',
  message: 'messages',
  unknown: null,
};

export default function NextSteps({ entryPoint }: { entryPoint: EntryPoint }) {
  const { t } = useLocale();
  const [origin, setOrigin] = useState<Origin>(defaultOriginByEntry[entryPoint]);

  const originOptions: Array<{ value: Origin; label: string }> = [
    { value: 'email', label: t('common.originEmail') },
    { value: 'profile', label: t('common.originProfile') },
    { value: 'message', label: t('common.originMessage') },
    { value: 'unknown', label: t('common.originUnknown') },
  ];

  const toolMeta: Record<ToolKey, { label: string; to: string; description: string; icon: React.ReactNode }> = {
    messages: {
      label: t('common.toolMessageDetectiveLabel'),
      to: '/messages',
      description: t('common.toolMessageDetectiveDesc'),
      icon: <MessageSquare size={16} />,
    },
    profiles: {
      label: t('common.toolProfileCheckerLabel'),
      to: '/profiles',
      description: t('common.toolProfileCheckerDesc'),
      icon: <Users size={16} />,
    },
    images: {
      label: t('common.toolImageInspectorLabel'),
      to: '/images',
      description: t('common.toolImageInspectorDesc'),
      icon: <ImageIcon size={16} />,
    },
    email: {
      label: t('common.toolEmailAnalyzerLabel'),
      to: '/email',
      description: t('common.toolEmailAnalyzerDesc'),
      icon: <Mail size={16} />,
    },
  };

  const originSummary: Record<Origin, string> = {
    email: t('common.originSummaryEmail'),
    profile: t('common.originSummaryProfile'),
    message: t('common.originSummaryMessage'),
    unknown: t('common.originSummaryUnknown'),
  };

  const { recommendations, highlightTool } = useMemo(() => {
    const list: ToolKey[] = [];
    const priorityTool = originPriority[origin];

    if (priorityTool && priorityTool !== entryPoint) {
      list.push(priorityTool);
    }

    entryRecommendations[entryPoint].forEach((tool) => {
      if (tool !== entryPoint && !list.includes(tool)) {
        list.push(tool);
      }
    });

    return {
      recommendations: list,
      highlightTool: priorityTool && priorityTool !== entryPoint ? priorityTool : null,
    };
  }, [entryPoint, origin]);

  return (
    <section className="card next-steps">
      <div className="kicker" style={{ color: 'var(--text)' }}>
        <Compass size={16} /> {t('common.nextStepsKicker')}
      </div>
      <p className="small" style={{ marginTop: 6 }}>
        {t('common.nextStepsIntro')}
      </p>
      <div className="choice-group" role="group" aria-label={t('common.contentOrigin')}>
        {originOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setOrigin(option.value)}
            className={`choice-chip ${origin === option.value ? 'active' : ''}`}
            aria-pressed={origin === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="small" style={{ marginTop: 8 }}>
        {originSummary[origin]}
      </div>
      <div className="link-list" style={{ marginTop: 14 }}>
        {recommendations.map((toolKey) => {
          const tool = toolMeta[toolKey];
          const isHighlighted = highlightTool === toolKey;
          return (
            <Link key={tool.to} to={tool.to} className="link-card">
              <div className="link-content">
                <div className="link-icon">{tool.icon}</div>
                <div className="link-meta">
                  <div className="link-title">{tool.label}</div>
                  <div className="link-desc">{tool.description}</div>
                </div>
              </div>
              <div className="link-actions">
                {isHighlighted && <span className="link-badge">{t('common.recommendedBadge')}</span>}
                <ChevronRight size={16} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
