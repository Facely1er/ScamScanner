import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="grid" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
      <section className="card" style={{ padding: 48 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <Shield size={32} style={{ opacity: 0.4 }} />
        </div>
        <h1 className="h1" style={{ fontSize: 32 }}>404</h1>
        <p className="p" style={{ marginTop: 8, marginBottom: 24, opacity: 0.7 }}>
          This page doesn't exist or has moved.
        </p>
        <Link to="/" className="btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Home size={16} /> Go Home
        </Link>
      </section>
    </div>
  );
}
