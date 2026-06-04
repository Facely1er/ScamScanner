import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Image as ImageIcon, User, ChevronDown, ChevronUp } from 'lucide-react';
import AICheckMessagePanel from '../../components/tools/AICheckMessagePanel';
import EmailHeaderAnalyzer from '../../components/tools/EmailHeaderAnalyzer';
import ImageMetadataAnalyzer from '../../components/tools/ImageMetadataAnalyzer';
import SocialProfileVerifier from '../../components/tools/SocialProfileVerifier';

type ToolType = 'message' | 'email' | 'image' | 'profile' | null;

export default function Tools() {
  const [activeTool, setActiveTool] = useState<ToolType>('message');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const toolMap: Record<string, ToolType> = {
        '1': 'message',
        '2': 'email',
        '3': 'image',
        '4': 'profile'
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
    <div className="grid gap-20">
      <section className="card">
        <h1 className="h1">Analysis Tools</h1>
        <p className="p">
          Use these specialized tools to analyze different types of suspicious content. Each tool focuses on specific indicators and patterns.
        </p>
        <div className="kbd-bar">
          <span className="small font-semibold opacity-7">Keyboard shortcuts:</span>
          <span className="small opacity-6">1-4 to toggle tools • Esc to close</span>
        </div>
      </section>

      <div className="tool-list">
        {tools.map((tool) => (
          <div key={tool.id}>
            <button
              onClick={() => toggleTool(tool.id)}
              className="card w-full text-left cursor-pointer"
              style={{
                padding: 20,
                border: activeTool === tool.id ? `2px solid ${tool.color}` : '1px solid var(--border)',
                transition: 'all 0.2s ease',
                backgroundColor: activeTool === tool.id ? `${tool.color}08` : 'var(--bg)',
              }}
            >
              <div className="d-flex justify-between items-center gap-16">
                <div className="d-flex items-center gap-16 flex-1">
                  <div
                    className="d-flex items-center justify-center"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      backgroundColor: `${tool.color}15`,
                      color: tool.color,
                    }}
                  >
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <div className="small font-semibold mb-4">
                      {tool.title}
                    </div>
                    <div className="small opacity-8" style={{ fontSize: '0.85rem' }}>
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
              <div
                className="tool-panel"
                style={{ border: `2px solid ${tool.color}` }}
              >
                {tool.id === 'message' && <AICheckMessagePanel />}
                {tool.id === 'email' && <EmailHeaderAnalyzer />}
                {tool.id === 'image' && <ImageMetadataAnalyzer />}
                {tool.id === 'profile' && <SocialProfileVerifier />}
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="card card-secondary">
        <div className="kicker mb-8">Pro Tip</div>
        <p className="p m-0">
          For the most comprehensive analysis, use the <strong>Guided Scan</strong> workflow. It automatically
          recommends which tools to use based on your situation and combines results for better accuracy.
        </p>
      </section>
    </div>
  );
}
