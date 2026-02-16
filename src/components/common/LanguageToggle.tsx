import React from 'react';
import { useLocale } from '../../contexts/LocaleContext';
export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="language-toggle" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={locale === 'en' ? 'active' : ''}
        aria-pressed={locale === 'en'}
        aria-label="English"
        title="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('fr')}
        className={locale === 'fr' ? 'active' : ''}
        aria-pressed={locale === 'fr'}
        aria-label="Français"
        title="Français"
      >
        FR
      </button>
    </div>
  );
}
