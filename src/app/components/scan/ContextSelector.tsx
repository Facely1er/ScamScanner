import React, { useState, useEffect, useRef } from 'react';
import { useSessionStore } from '../../../state/sessionStore';
import { Mail, MessageCircle, MessageSquare, Smartphone, HelpCircle, ArrowRight } from 'lucide-react';
import { ContextOrigin } from '../../../types/scan';

interface ContextSelectorProps {
  onComplete: () => void;
}

export default function ContextSelector({ onComplete }: ContextSelectorProps) {
  const { createSession } = useSessionStore();
  const [selectedOrigin, setSelectedOrigin] = useState<ContextOrigin | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [requestedAction, setRequestedAction] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [hasImage, setHasImage] = useState<string>('');
  const [imageReceived, setImageReceived] = useState('');
  const [imageContext, setImageContext] = useState('');

  const firstInputRef = useRef<HTMLInputElement>(null);
  const imageReceivedRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showDetails && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [showDetails]);

  useEffect(() => {
    if (hasImage === 'yes' && imageReceivedRef.current) {
      imageReceivedRef.current.focus();
    }
  }, [hasImage]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDetails) {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showDetails]);

  const origins = [
    {
      id: 'email' as ContextOrigin,
      title: 'Email',
      icon: <Mail size={32} />,
      description: 'Received via email or email client',
      color: '#3b82f6'
    },
    {
      id: 'social_media' as ContextOrigin,
      title: 'Social Media',
      icon: <MessageCircle size={32} />,
      description: 'Post, comment, or message on social platform',
      color: '#8b5cf6'
    },
    {
      id: 'direct_message' as ContextOrigin,
      title: 'Direct Message',
      icon: <MessageSquare size={32} />,
      description: 'Private message on any platform',
      color: '#10b981'
    },
    {
      id: 'sms' as ContextOrigin,
      title: 'SMS/Text',
      icon: <Smartphone size={32} />,
      description: 'Text message or SMS',
      color: '#f59e0b'
    },
    {
      id: 'unknown' as ContextOrigin,
      title: 'Not Sure',
      icon: <HelpCircle size={32} />,
      description: 'Unknown or multiple sources',
      color: '#6b7280'
    }
  ];

  const handleOriginSelect = (origin: ContextOrigin) => {
    setSelectedOrigin(origin);
    setTimeout(() => setShowDetails(true), 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrigin) return;

    const contextNotes = [
      additionalNotes,
      hasImage === 'yes' ? `Image received: ${imageReceived}. Context: ${imageContext}` : null
    ].filter(Boolean).join(' | ');

    createSession({
      origin: selectedOrigin,
      senderName: senderName || undefined,
      relationship: relationship || undefined,
      requestedAction: requestedAction || undefined,
      additionalNotes: contextNotes || undefined
    });

    onComplete();
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedOrigin(null);
  };

  if (!showDetails || !selectedOrigin) {
    return (
      <section className="card">
        <div className="kicker mb-8">Step 1 of 3</div>
        <h2 className="h2">Where did you receive this?</h2>
        <p className="p mt-8">
          Select how you received the suspicious content. This helps us analyze it correctly.
        </p>

        <div
          className="d-grid gap-16 mt-24"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
        >
          {origins.map((origin) => (
            <button
              key={origin.id}
              onClick={() => handleOriginSelect(origin.id)}
              className="card cursor-pointer text-left"
              style={{
                padding: 20,
                border: selectedOrigin === origin.id ? `2px solid ${origin.color}` : '1px solid var(--border)',
                transition: 'all 0.2s ease',
                backgroundColor: 'var(--bg)',
              }}
            >
              <div
                className="d-flex items-center justify-center mb-12"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  backgroundColor: `${origin.color}15`,
                  color: origin.color,
                }}
              >
                {origin.icon}
              </div>
              <div className="small font-semibold mb-4">
                {origin.title}
              </div>
              <div className="small opacity-7" style={{ fontSize: '0.85rem' }}>
                {origin.description}
              </div>
            </button>
          ))}
        </div>
      </section>
    );
  }

  const selectedOriginData = origins.find(o => o.id === selectedOrigin);

  return (
    <section className="card">
      <div className="kicker mb-8">Step 1 of 3</div>
      <div className="d-flex items-center gap-12 mb-12">
        <div
          className="d-flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            backgroundColor: `${selectedOriginData?.color}15`,
            color: selectedOriginData?.color,
          }}
        >
          {selectedOriginData?.icon}
        </div>
        <div>
          <h2 className="h2 m-0">Tell us more details</h2>
          <p className="small m-0 mt-4 opacity-7">
            Optional but helpful for better analysis
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-24">
        <div className="d-flex flex-col gap-16">
          <div>
            <label className="small d-block mb-6 font-semibold">
              Sender Name
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="btn w-full text-left"
              placeholder="e.g., John Smith, Support Team, unknown number"
            />
          </div>

          <div>
            <label className="small d-block mb-6 font-semibold">
              Your relationship to sender
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="btn w-full text-left"
            >
              <option value="">Select...</option>
              <option value="stranger">Complete stranger</option>
              <option value="acquaintance">Acquaintance</option>
              <option value="friend">Friend or family</option>
              <option value="business">Business contact</option>
              <option value="service">Service provider</option>
              <option value="unknown">Not sure</option>
            </select>
          </div>

          <div>
            <label className="small d-block mb-6 font-semibold">
              What action are they requesting?
            </label>
            <input
              type="text"
              value={requestedAction}
              onChange={(e) => setRequestedAction(e.target.value)}
              className="btn w-full text-left"
              placeholder="e.g., send money, verify account, click link, provide info"
            />
          </div>

          <div>
            <label className="small d-block mb-6 font-semibold">
              Did they send an image, photo, or screenshot?
            </label>
            <select
              value={hasImage}
              onChange={(e) => setHasImage(e.target.value)}
              className="btn w-full text-left"
            >
              <option value="">Select...</option>
              <option value="yes">Yes, they sent an image</option>
              <option value="no">No image included</option>
            </select>
          </div>

          {hasImage === 'yes' && (
            <>
              <div>
                <label className="small d-block mb-6 font-semibold">
                  How was the image received?
                </label>
                <input
                  ref={imageReceivedRef}
                  type="text"
                  value={imageReceived}
                  onChange={(e) => setImageReceived(e.target.value)}
                  className="btn w-full text-left"
                  placeholder="e.g., attached to email, in chat message, via link"
                />
              </div>

              <div>
                <label className="small d-block mb-6 font-semibold">
                  What was the image about and why did they send it?
                </label>
                <textarea
                  value={imageContext}
                  onChange={(e) => setImageContext(e.target.value)}
                  className="btn w-full text-left"
                  style={{ minHeight: 60, resize: 'vertical' }}
                  placeholder="e.g., proof of payment, verification document, identity card, product photo"
                />
              </div>
            </>
          )}

          <div>
            <label className="small d-block mb-6 font-semibold">
              When did you receive this?
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="btn w-full text-left"
              placeholder="e.g., today, yesterday, 2 days ago, last week"
            />
          </div>

          <div className="d-flex gap-12 mt-8 flex-wrap items-center">
            <button
              type="submit"
              className="btn primary d-flex items-center gap-8"
            >
              Continue to Analysis <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="btn"
            >
              Back
            </button>
            <span className="small opacity-6 ml-auto">
              Press Enter to continue • Esc to go back
            </span>
          </div>
        </div>
      </form>
    </section>
  );
}
