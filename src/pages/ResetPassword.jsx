import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DataService from '../services/DataService';
import LangSwitcher from '../components/LangSwitcher';

const ResetPassword = ({ token, onBack }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await DataService.verifyResetToken(token);
        setUserEmail(res.email);
        setVerifying(false);
      } catch (err) {
        setError(err.message || 'Invalid or expired token');
        setVerifying(false);
      }
    };
    if (token) verifyToken();
    else {
      setError('No token provided');
      setVerifying(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.password_mismatch'));
      return;
    }

    setLoading(true);
    try {
      await DataService.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2F3F5', fontFamily: "'Cairo', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '4px solid #E5E7EB', borderTopColor: '#22C55E', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#6B7280', fontWeight: 600 }}>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

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
          <span style={{ fontSize: 36 }}>🛡️</span>
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>{t('auth.reset_password_title')}</h2>
        {userEmail && <p style={{ fontSize: 14, color: '#22C55E', fontWeight: 700, marginBottom: 8 }}>{userEmail}</p>}
        <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 32, lineHeight: 1.6 }}>{t('auth.reset_password_subtitle')}</p>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#B91C1C' }}>
            {error}
          </div>
        )}

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: 16, padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#166534', marginBottom: 24 }}>{t('auth.reset_success')}</p>
            <button onClick={onBack} style={{ width: '100%', backgroundColor: '#22C55E', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              {t('auth.back_to_login')}
            </button>
          </motion.div>
        ) : error ? (
           <button onClick={onBack} style={{ width: '100%', backgroundColor: '#1A1A2E', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 20 }}>
              {t('auth.back_to_login')}
            </button>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16, textAlign: isRtl ? 'right' : 'left' }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 8 }}>{t('auth.new_password')}</label>
              <input
                type="password"
                required
                placeholder="********"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 15, fontFamily: "'Cairo', sans-serif", boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: 32, textAlign: isRtl ? 'right' : 'left' }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 8 }}>{t('auth.confirm_new_password')}</label>
              <input
                type="password"
                required
                placeholder="********"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 15, fontFamily: "'Cairo', sans-serif", boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              style={{ width: '100%', backgroundColor: '#22C55E', color: 'white', border: 'none', borderRadius: 14, padding: '16px', fontSize: 18, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(34,197,94,0.3)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? t('common.loading') : t('auth.reset_password_title')}
            </motion.button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
