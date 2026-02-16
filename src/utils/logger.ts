/**
 * Production logging utility
 * Provides structured logging with different levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: number;
  userAgent?: string;
  url?: string;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.isProduction = import.meta.env.PROD;
  }

  private createLogEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry = this.createLogEntry(level, message, data);

    // In development, always log to console
    if (this.isDevelopment) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${level.toUpperCase()}]`, message, data || '');
    }

    // In production, only log errors and warnings
    if (this.isProduction && (level === 'error' || level === 'warn')) {
      // TODO: Integrate with error tracking service (e.g., Sentry, LogRocket)
      // Example: Sentry.captureMessage(message, { level, extra: data });
      
      // For now, log to console in production (remove in favor of error tracking service)
      if (level === 'error') {
        console.error(message, data);
      } else if (level === 'warn') {
        console.warn(message, data);
      }
    }
  }

  debug(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error | unknown): void {
    const errorData = error instanceof Error 
      ? { message: error.message, stack: error.stack, name: error.name }
      : error;
    
    this.log('error', message, errorData);
  }

  /**
   * Log performance metrics
   */
  performance(metric: string, duration: number, details?: unknown): void {
    if (this.isDevelopment) {
      console.log(`[PERF] ${metric}: ${duration}ms`, details || '');
    }
    
    // In production, you might want to send to analytics
    // Example: analytics.track('performance', { metric, duration, ...details });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for use in other modules
export type { LogLevel, LogEntry };

