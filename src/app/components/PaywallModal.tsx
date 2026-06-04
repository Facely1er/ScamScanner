import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName?: string;
}

export default function PaywallModal({ isOpen, onClose, toolName }: PaywallModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    navigate('/tools');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="card bg-base relative"
        style={{ maxWidth: 400, width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="close-btn"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="d-flex items-center gap-8 mb-16">
          <ArrowRight size={24} className="text-primary" />
          <h2 className="heading-with-icon m-0" style={{ fontSize: 22, fontWeight: 600 }}>Continue</h2>
        </div>

        <p className="p mb-24">
          {toolName
            ? `${toolName} is available now. Open tools to continue your analysis.`
            : "This feature is available now. Open tools to continue your analysis."}
        </p>

        <div className="d-flex flex-col gap-10">
          <button
            onClick={handleContinue}
            className="btn primary w-full d-flex items-center justify-center gap-8"
          >
            <ArrowRight size={16} />
            Open Tools
          </button>
        </div>
      </div>
    </div>
  );
}
