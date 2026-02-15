import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="grid" style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
          <section className="card" style={{ textAlign: 'center' }}>
            <AlertTriangle size={48} style={{ color: 'var(--error)', marginBottom: 16 }} aria-hidden="true" />
            <h1 className="h1" style={{ color: 'var(--error)' }}>Something went wrong</h1>
            <p className="p" style={{ marginBottom: 24 }}>
              {this.state.error?.message || 'An unexpected error occurred. Please try reloading the page.'}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => window.location.reload()} 
                className="btn primary"
              >
                Reload Page
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="btn"
              >
                Go Home
              </button>
            </div>
            <details style={{ marginTop: 24, textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', marginBottom: 12, color: 'var(--text-secondary)' }}>
                Technical Details
              </summary>
              <pre style={{ 
                background: 'var(--bg-secondary)', 
                padding: 16, 
                borderRadius: 8,
                overflow: 'auto',
                fontSize: 12,
                color: 'var(--text-secondary)',
                marginTop: 12
              }}>
                {this.state.error?.stack}
              </pre>
            </details>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}

