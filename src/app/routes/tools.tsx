import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Mail, Image as ImageIcon, User, Video, ChevronDown, ChevronUp } from 'lucide-react';
import AICheckMessagePanel from '../../components/tools/AICheckMessagePanel';
import EmailHeaderAnalyzer from '../../components/tools/EmailHeaderAnalyzer';
import ImageMetadataAnalyzer from '../../components/tools/ImageMetadataAnalyzer';
import SocialProfileVerifier from '../../components/tools/SocialProfileVerifier';
import VideoMetadataAnalyzer from '../../components/tools/VideoMetadataAnalyzer';
import { useLocale } from '../../contexts/LocaleContext';

type ToolType = 'message' | 'email' | 'image' | 'profile' | 'video' | null;

const VALID_TOOLS: ToolType[] = ['message', 'email', 'image', 'profile', 'video'];

export default function Tools() {
  const { t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const toolParam = searchParams.get('tool') as ToolType;
  const initialTool = toolParam && VALID_TOOLS.includes(toolParam) ? toolParam : null;
  const [activeTool, setActiveTool] = useState<ToolType>(initialTool);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const toolMap: Record<string, ToolType> = {
        '1': 'message',
        '2': 'email',
        '3': 'image',
        '4': 'profile',
        '5': 'video'
      };

      if (toolMap[e.key]) {
        setActiveTool(activeTool === toolMap[e.key] ? null : toolMap[e.key]);
      } else if (e.key === 'Escape') {
        setActiveTool(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTool]);

  const tools = [
    {
      id: 'message' as ToolType,
      icon: <MessageSquare size={28} />,
      shortTitle: t('toolsPage.messageShort'),
      title: t('toolsPage.messageTitle'),
      description: t('toolsPage.messageDesc'),
      color: '#3b82f6'
    },
    {
      id: 'email' as ToolType,
      icon: <Mail size={28} />,
      shortTitle: t('toolsPage.emailShort'),
      title: t('toolsPage.emailTitle'),
      description: t('toolsPage.emailDesc'),
      color: '#8b5cf6'
    },
    {
      id: 'image' as ToolType,
      icon: <ImageIcon size={28} />,
      shortTitle: t('toolsPage.imageShort'),
      title: t('toolsPage.imageTitle'),
      description: t('toolsPage.imageDesc'),
      color: '#10b981'
    },
    {
      id: 'profile' as ToolType,
      icon: <User size={28} />,
      shortTitle: t('toolsPage.profileShort'),
      title: t('toolsPage.profileTitle'),
      description: t('toolsPage.profileDesc'),
      color: '#f59e0b'
    },
    {
      id: 'video' as ToolType,
      icon: <Video size={28} />,
      shortTitle: t('toolsPage.videoShort'),
      title: t('toolsPage.videoTitle'),
      description: t('toolsPage.videoDesc'),
      color: '#ec4899'
    }
  ];

  // Sync active tool when URL param changes (e.g., navigating from Home tool cards)
  useEffect(() => {
    if (toolParam && VALID_TOOLS.includes(toolParam)) {
      setActiveTool(toolParam);
    }
  }, [toolParam]);

  const toggleTool = (toolId: ToolType) => {
    const next = activeTool === toolId ? null : toolId;
    setActiveTool(next);
    // Keep URL clean after initial navigation
    if (searchParams.has('tool')) {
      searchParams.delete('tool');
      setSearchParams(searchParams, { replace: true });
    }
  };

  return (
    <div className="grid loose">
      <section className="card">
        <h1 className="h1">{t('toolsPage.title')}</h1>
        <p className="p">{t('toolsPage.intro')}</p>

        <div className="kicker" style={{ marginTop: 16, marginBottom: 10 }}>{t('toolsPage.quickAccess')}</div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center'
        }}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => toggleTool(tool.id)}
              aria-label={tool.title}
              title={tool.title}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '12px 14px',
                minWidth: 72,
                borderRadius: 12,
                border: activeTool === tool.id ? `2px solid ${tool.color}` : '1px solid var(--border)',
                background: activeTool === tool.id ? `${tool.color}12` : 'var(--bg-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text)'
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: `${tool.color}15`,
                color: tool.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {React.cloneElement(tool.icon as React.ReactElement, { size: 20, color: tool.color })}
              </div>
              <span>{tool.shortTitle}</span>
            </button>
          ))}
        </div>

        <div style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap'
        }}>
          <span className="small" style={{ fontWeight: 600, opacity: 0.7 }}>{t('toolsPage.keyboardLabel')}</span>
          <span className="small" style={{ opacity: 0.6 }}>{t('toolsPage.keyboardHint')} &bull; {t('toolsPage.keyboardEsc')}</span>
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tools.map((tool) => (
          <div key={tool.id}>
            <button
              onClick={() => toggleTool(tool.id)}
              className="card"
              style={{
                width: '100%',
                padding: 20,
                border: activeTool === tool.id ? `2px solid ${tool.color}` : '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                backgroundColor: activeTool === tool.id ? `${tool.color}08` : 'var(--bg)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    backgroundColor: `${tool.color}15`,
                    color: tool.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {tool.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="small" style={{ fontWeight: 600, marginBottom: 4 }}>
                      {tool.title}
                    </div>
                    <div className="small" style={{ opacity: 0.8, fontSize: '0.85rem' }}>
                      {tool.description}
                    </div>
                  </div>
                </div>
                <div style={{ color: tool.color }}>
                  {activeTool === tool.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>
            </button>

            {activeTool === tool.id && (
              <div style={{
                marginTop: 16,
                padding: 24,
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 8,
                border: `2px solid ${tool.color}`
              }}>
                {tool.id === 'message' && <AICheckMessagePanel />}
                {tool.id === 'email' && <EmailHeaderAnalyzer />}
                {tool.id === 'image' && <ImageMetadataAnalyzer />}
                {tool.id === 'profile' && <SocialProfileVerifier />}
                {tool.id === 'video' && <VideoMetadataAnalyzer />}
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="kicker" style={{ marginBottom: 8 }}>{t('toolsPage.proTip')}</div>
        <p className="p" style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: t('toolsPage.proTipDesc') }} />
      </section>
    </div>
  );
}
