import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import type { Locale } from '../../contexts/LocaleContext';

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const triggerAria = {
    'aria-expanded': open,
    'aria-haspopup': 'listbox' as const,
    'aria-label': `Language: ${current.label}`,
  };

  return (
    <div
      ref={ref}
      className="language-toggle"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="language-toggle-trigger"
        {...triggerAria}
        title={current.label}
      >
        <Globe size={18} aria-hidden />
      </button>
      {open && (
        <ul
          className="language-toggle-dropdown"
          role="listbox"
          aria-label="Select language"
        >
          {LANGUAGES.map(({ code, label }) => {
            const isSelected = locale === code;
            const optionAria = { 'aria-selected': isSelected };
            return (
            <li key={code} role="presentation">
              <button
                type="button"
                role="option"
                {...optionAria}
                className={isSelected ? 'active' : ''}
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
              >
                {label}
              </button>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
