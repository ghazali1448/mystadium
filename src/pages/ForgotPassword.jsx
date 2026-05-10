import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DataService from '../services/DataService';
import LangSwitcher from '../components/LangSwitcher';

const ForgotPassword = ({ onBack }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await DataService.requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', backgroundColor: '#F2F3F5', fontFamily: "'Cairo', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 15, fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>
          {isRtl ? '→' : '←'} {t('auth.back')}
        </button>
        <LangSwitcher />
      </div>

      <div style={{ padding: '40px 24px', maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', backgroundColor: '#D4F5E3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 4px 16px rgba(34,197,94,0.2)' }}>
          <span style={{ fontSize: 36 }}>🔑</span>
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>{t('auth.forgot_password_title')}</h2>
        <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 32, lineHeight: 1.6 }}>{t('auth.forgot_password_subtitle')}</p>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#B91C1C' }}>
            {error}
          </div>
        )}

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#166534', margin: '0 0 16px' }}>{t('auth.password_reset_sent') || 'Reset link sent!'}</p>
            <p style={{ fontSize: 14, color: '#15803d', marginBottom: 24 }}>Check your email inbox for further instructions.</p>
            <button onClick={onBack} style={{ width: '100%', backgroundColor: '#22C55E', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              {t('auth.back_to_login')}
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24, textAlign: isRtl ? 'right' : 'left' }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 8 }}>{t('auth.email')}</label>
              <input
                type="email"
                required
                placeholder={t('auth.email_placeholder')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 15, fontFamily: "'Cairo', sans-serif", boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              style={{ width: '100%', backgroundColor: '#22C55E', color: 'white', border: 'none', borderRadius: 14, padding: '16px', fontSize: 18, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(34,197,94,0.3)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? t('common.loading') : t('auth.send_reset_link')}
            </motion.button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
