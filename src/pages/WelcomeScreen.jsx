import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../components/LangSwitcher';

const WelcomeScreen = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px 32px',
        backgroundColor: '#F2F3F5',
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      {/* Language Switcher - top right */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <LangSwitcher />
      </div>

      {/* Center Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: '#D4F5E3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(34,197,94,0.2)',
            }}
          >
            <img
              src="/logo.png"
              alt="MyStadium Logo"
              style={{ width: 72, height: 72, objectFit: 'contain' }}
              onError={e => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span style="font-size:44px">⚽</span>';
              }}
            />
          </motion.div>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 38, fontWeight: 800, color: '#1A1A2E', margin: '0 0 8px', letterSpacing: -1 }}>
              MyStadium
            </h1>
            <p style={{ fontSize: 16, color: '#6B7280', fontWeight: 500, margin: 0 }}>
              {t('welcome.subtitle')}
            </p>
          </div>
        </div>


        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('auth_signup')}
            style={{
              backgroundColor: '#22C55E',
              color: 'white',
              border: 'none',
              borderRadius: 14,
              padding: '16px 0',
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
              fontFamily: "'Cairo', sans-serif",
              boxShadow: '0 4px 15px rgba(34,197,94,0.35)',
            }}
          >
            {t('welcome.signup')}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('auth_login')}
            style={{
              backgroundColor: 'white',
              color: '#1A1A2E',
              border: '1.5px solid #E5E7EB',
              borderRadius: 14,
              padding: '16px 0',
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            {t('welcome.login')}
          </motion.button>
        </div>
      </motion.div>

      {/* Terms */}
      <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', margin: 0 }}>
        {t('welcome.terms')}{' '}
        <span style={{ color: '#22C55E', fontWeight: 600 }}>{t('welcome.terms_link')}</span>
        {' '}{t('welcome.terms_and')}{' '}
        <span style={{ color: '#22C55E', fontWeight: 600 }}>{t('welcome.privacy_link')}</span>.
      </p>
    </div>
  );
};

export default WelcomeScreen;
