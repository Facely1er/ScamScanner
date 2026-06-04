import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="grid container-sm text-center">
      <section className="card p-48">
        <div
          className="d-flex items-center justify-center mx-auto mb-20"
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          <Shield size={32} className="opacity-4" style={{ opacity: 0.4 }} />
        </div>
        <h1 className="h1" style={{ fontSize: 32 }}>404</h1>
        <p className="p mt-8 mb-24 opacity-7">
          This page doesn't exist or has moved.
        </p>
        <Link to="/" className="btn primary d-inline-flex items-center gap-8">
          <Home size={16} /> Go Home
        </Link>
      </section>
    </div>
  );
}
