import React, { useState } from 'react';
import { MessageSquare, Mail, Image as ImageIcon, User, ChevronDown, ChevronUp } from 'lucide-react';
import AICheckMessagePanel from '../../components/tools/AICheckMessagePanel';
import EmailHeaderAnalyzer from '../../components/tools/EmailHeaderAnalyzer';
import ImageMetadataAnalyzer from '../../components/tools/ImageMetadataAnalyzer';
import SocialProfileVerifier from '../../components/tools/SocialProfileVerifier';

type ToolType = 'message' | 'email' | 'image' | 'profile' | null;

export default function Tools() {
  const [activeTool, setActiveTool] = useState<ToolType>(null);

  const tools = [
    {
      id: 'message' as ToolType,
      icon: <MessageSquare size={28} />,
      title: 'Message Analysis',
      description: 'Analyze message text for scam patterns, urgency tactics, and manipulation techniques',
      color: '#3b82f6'
    },
    {
      id: 'email' as ToolType,
      icon: <Mail size={28} />,
      title: 'Email Header Analysis',
      description: 'Check email authenticity, routing paths, and spoofing indicators',
      color: '#8b5cf6'
    },
    {
      id: 'image' as ToolType,
      icon: <ImageIcon size={28} />,
      title: 'Image Metadata Analysis',
      description: 'Inspect image metadata, editing history, and manipulation indicators',
      color: '#10b981'
    },
    {
      id: 'profile' as ToolType,
      icon: <User size={28} />,
      title: 'Profile Verification',
      description: 'Verify social media profiles for fake account indicators and suspicious patterns',
      color: '#f59e0b'
    }
  ];

  const toggleTool = (toolId: ToolType) => {
    setActiveTool(activeTool === toolId ? null : toolId);
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="card">
        <h1 className="h1">Analysis Tools</h1>
        <p className="p">
          Use these specialized tools to analyze different types of suspicious content. Each tool focuses on specific indicators and patterns.
        </p>
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
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="card" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="kicker" style={{ marginBottom: 8 }}>Pro Tip</div>
        <p className="p" style={{ margin: 0 }}>
          For the most comprehensive analysis, use the <strong>Guided Scan</strong> workflow. It automatically
          recommends which tools to use based on your situation and combines results for better accuracy.
        </p>
      </section>
    </div>
  );
}
