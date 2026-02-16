import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

let addToastGlobal: ((message: string, type?: ToastType, duration?: number) => void) | null = null;

export function showToast(message: string, type: ToastType = 'info', duration = 3000) {
  addToastGlobal?.(message, type, duration);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => { addToastGlobal = null; };
  }, [addToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      style={{
        position: 'fixed',
        bottom: 90,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 400,
        pointerEvents: 'none',
      }}
    >
      {toasts.map(toast => (
        <ToastMessage key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}

function ToastMessage({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />,
  };

  const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', icon: '#10b981' },
    error: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', icon: '#ef4444' },
    warning: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', icon: '#f59e0b' },
    info: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', icon: '#3b82f6' },
  };

  const c = colors[toast.type];

  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 18px',
        borderRadius: 12,
        backgroundColor: c.bg,
        border: `1.5px solid ${c.border}`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.08)',
        animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'auto',
        color: 'var(--text)',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.5,
      }}
    >
      <span style={{ color: c.icon, flexShrink: 0, display: 'flex' }}>{icons[toast.type]}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: 4,
          display: 'flex',
          flexShrink: 0,
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <X size={16} />
      </button>
    </div>
  );
}
