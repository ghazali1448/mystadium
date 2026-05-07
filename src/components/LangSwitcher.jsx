import React from 'react';
import { useTranslation } from 'react-i18next';

const langs = [
  { code: 'ar', label: 'ع' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
];

const LangSwitcher = ({ style = {} }) => {
  const { i18n } = useTranslation();

  const switchLang = (code) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        backgroundColor: 'white',
        borderRadius: 50,
        padding: '4px 6px',
        border: '1.5px solid #E5E7EB',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        ...style,
      }}
    >
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => switchLang(l.code)}
          style={{
            padding: '4px 10px',
            borderRadius: 50,
            border: 'none',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "'Cairo', sans-serif",
            backgroundColor: i18n.language === l.code ? '#22C55E' : 'transparent',
            color: i18n.language === l.code ? 'white' : '#6B7280',
            transition: 'all 0.2s',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default LangSwitcher;
