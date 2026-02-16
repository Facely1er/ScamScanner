import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

export type Locale = 'en' | 'fr';

const messages: Record<Locale, typeof en> = { en, fr };

function get(obj: unknown, path: string): string | undefined {
  if (!obj || typeof path !== 'string') return undefined;
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

function substitute(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  let out = text;
  out = out.replace(/\{\{query\}\}/g, String(params.query ?? ''));
  out = out.replace(/\{brandName\}/g, String(params.brandName ?? ''));
  out = out.replace(/\{count\}/g, String(params.count ?? ''));
  Object.entries(params).forEach(([k, v]) => {
    out = out.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  });
  return out;
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useLocalStorage<Locale>('cyberstition_locale', 'en');

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const current = messages[locale];
      const fallback = messages.en;
      let value = get(current, key) ?? get(fallback, key);
      if (value === undefined) return key;
      return substitute(value, params);
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
