import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, FileText, Check } from 'lucide-react';
import { validateAndRedeemKey } from '../core/licenseKey';
import { getCredits } from '../core/creditStore';

interface ReportCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreditAdded: () => void;
}

const PACKAGES = [
  {
    id: 'R1', label: '1 Report', price: '$4.99', credits: 1,
    gumroadUrl: 'https://cyberstition.gumroad.com/l/report-1',
    stripeUrl: 'https://buy.stripe.com/report-1',
  },
  {
    id: 'R5', label: '5 Reports', price: '$14.99', credits: 5, popular: true,
    gumroadUrl: 'https://cyberstition.gumroad.com/l/report-5',
    stripeUrl: 'https://buy.stripe.com/report-5',
  },
  {
    id: 'R20', label: '20 Reports', price: '$39.99', credits: 20,
    gumroadUrl: 'https://cyberstition.gumroad.com/l/report-20',
    stripeUrl: 'https://buy.stripe.com/report-20',
  },
];

export default function ReportCreditModal({ isOpen, onClose, onCreditAdded }: ReportCreditModalProps) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [credits, setCredits] = useState(getCredits());

  useEffect(() => {
    if (isOpen) {
      setCredits(getCredits());
      setKey('');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRedeem = () => {
    if (!key.trim()) {
      setError('Please enter a license key.');
      return;
    }
    setRedeeming(true);
    setError('');
    setSuccess('');

    setTimeout(() => {
      const result = validateAndRedeemKey(key);
      if (result.valid) {
        setSuccess(`${result.credits} report credit${result.credits !== 1 ? 's' : ''} added successfully.`);
        setKey('');
        setCredits(getCredits());
        onCreditAdded();
      } else {
        setError(result.error ?? 'Invalid key.');
      }
      setRedeeming(false);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRedeem();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="card relative bg-base"
        style={{ maxWidth: 480, width: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="close-btn"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="d-flex items-center gap-10 mb-6">
          <FileText size={22} className="text-primary" />
          <h2 className="m-0" style={{ fontSize: 20, fontWeight: 700 }}>Get Report Credits</h2>
        </div>

        {credits > 0 && (
          <div className="credits-notice">
            <div className="small text-green font-semibold">
              You have {credits} report credit{credits !== 1 ? 's' : ''} remaining.
            </div>
          </div>
        )}

        <p className="p mb-20">
          Purchase a credit pack from our store, then enter your license key below to unlock report downloads.
        </p>

        <div className="d-flex flex-col gap-10 mb-24">
          {PACKAGES.map(pkg => (
            <div
              key={pkg.id}
              className={pkg.popular ? 'pkg-card pkg-card-popular' : 'pkg-card pkg-card-default'}
            >
              <div className="d-flex justify-between items-start mb-10">
                <div>
                  {pkg.popular && (
                    <div className="best-value-label">Best value</div>
                  )}
                  <div className="font-semibold">{pkg.label}</div>
                  <div className="small opacity-7">{pkg.credits} PDF report{pkg.credits !== 1 ? 's' : ''}</div>
                </div>
                <span className="font-bold" style={{ fontSize: 16 }}>{pkg.price}</span>
              </div>
              <div className="d-flex gap-8">
                <a
                  href={pkg.stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn primary d-inline-flex items-center gap-6"
                  style={{ fontSize: 13, padding: '6px 12px', textDecoration: 'none' }}
                >
                  Stripe <ExternalLink size={12} />
                </a>
                <a
                  href={pkg.gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn d-inline-flex items-center gap-6"
                  style={{ fontSize: 13, padding: '6px 12px', textDecoration: 'none' }}
                >
                  Gumroad <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="redeem-section">
          <div className="d-flex items-center gap-8 mb-10">
            <Key size={16} className="text-primary" />
            <span className="font-semibold">Enter License Key</span>
          </div>

          <div className="d-flex gap-8">
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="CBST-R5-A1B2C3D4-XXXXXXXX"
              className="key-input"
              spellCheck={false}
            />
            <button
              onClick={handleRedeem}
              disabled={redeeming}
              className="btn primary whitespace-nowrap"
            >
              {redeeming ? 'Checking...' : 'Redeem'}
            </button>
          </div>

          {error && (
            <div className="mt-10 p-8 notice-error" style={{ borderRadius: 6 }}>
              <div className="small text-red">{error}</div>
            </div>
          )}

          {success && (
            <div className="mt-10 p-8 notice-success d-flex items-center gap-8" style={{ borderRadius: 6 }}>
              <Check size={16} className="text-green flex-shrink-0" />
              <div className="small text-green font-semibold">{success}</div>
            </div>
          )}

          <p className="small mt-14 opacity-6">
            Keys are redeemed locally on this device. No account required. No data transmitted.
          </p>
        </div>
      </div>
    </div>
  );
}
