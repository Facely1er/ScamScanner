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

    // Small delay for UX feedback
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
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ maxWidth: 480, width: '100%', position: 'relative', backgroundColor: 'var(--bg)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-secondary)', display: 'flex' }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <FileText size={22} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Get Report Credits</h2>
        </div>

        {credits > 0 && (
          <div style={{ padding: '8px 12px', borderRadius: 6, backgroundColor: 'rgb(240 253 244)', border: '1px solid rgb(34 197 94)', marginBottom: 16 }}>
            <div className="small" style={{ color: 'rgb(21 128 61)', fontWeight: 600 }}>
              You have {credits} report credit{credits !== 1 ? 's' : ''} remaining.
            </div>
          </div>
        )}

        <p className="p" style={{ marginBottom: 20 }}>
          Purchase a credit pack from our store, then enter your license key below to unlock report downloads.
        </p>

        {/* Packages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {PACKAGES.map(pkg => (
            <div
              key={pkg.id}
              style={{
                padding: '12px 16px', borderRadius: 8,
                border: pkg.popular ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: pkg.popular ? 'var(--bg-secondary)' : 'var(--bg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  {pkg.popular && (
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>
                      Best value
                    </div>
                  )}
                  <div style={{ fontWeight: 600 }}>{pkg.label}</div>
                  <div className="small" style={{ opacity: 0.7 }}>{pkg.credits} PDF report{pkg.credits !== 1 ? 's' : ''}</div>
                </div>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{pkg.price}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={pkg.stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 12px', textDecoration: 'none' }}
                >
                  Stripe <ExternalLink size={12} />
                </a>
                <a
                  href={pkg.gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '6px 12px', textDecoration: 'none' }}
                >
                  Gumroad <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Redeem */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Key size={16} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 600 }}>Enter License Key</span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="CBST-R5-A1B2C3D4-XXXXXXXX"
              style={{
                flex: 1, padding: '10px 12px', border: '1px solid var(--border)',
                borderRadius: 6, fontSize: 14, fontFamily: 'monospace',
                backgroundColor: 'var(--bg)',
              }}
              spellCheck={false}
            />
            <button
              onClick={handleRedeem}
              disabled={redeeming}
              className="btn primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              {redeeming ? 'Checking...' : 'Redeem'}
            </button>
          </div>

          {error && (
            <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 6, backgroundColor: 'rgb(254 242 242)', border: '1px solid rgb(239 68 68)' }}>
              <div className="small" style={{ color: 'rgb(153 27 27)' }}>{error}</div>
            </div>
          )}

          {success && (
            <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 6, backgroundColor: 'rgb(240 253 244)', border: '1px solid rgb(34 197 94)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Check size={16} style={{ color: 'rgb(21 128 61)', flexShrink: 0 }} />
              <div className="small" style={{ color: 'rgb(21 128 61)', fontWeight: 600 }}>{success}</div>
            </div>
          )}

          <p className="small" style={{ marginTop: 14, opacity: 0.6 }}>
            Keys are redeemed locally on this device. No account required. No data transmitted.
          </p>
        </div>
      </div>
    </div>
  );
}
