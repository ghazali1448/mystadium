import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../components/LangSwitcher';
import DataService from '../services/DataService';

/* ─── Real App Logo ─── */
const BallLogo = () => (
  <div style={{
    width: 76, height: 76, borderRadius: '50%', backgroundColor: '#D4F5E3',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px', overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(34,197,94,0.2)',
  }}>
    <img
      src="/logo.png"
      alt="MyStadium"
      style={{ width: 54, height: 54, objectFit: 'contain' }}
      onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size:36px">⚽</span>'; }}
    />
  </div>
);

/* ─── Reusable Input Field ─── */
const Field = ({ label, name, type = 'text', placeholder, iconRight, value, onChange }) => {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {iconRight && (
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#9CA3AF', pointerEvents: 'none' }}>
            {iconRight}
          </span>
        )}
        <input
          name={name}
          type={isPassword ? (showPw ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          style={{
            width: '100%',
            padding: iconRight ? '14px 44px 14px 44px' : '14px 16px',
            border: '1.5px solid #E5E7EB',
            borderRadius: 12,
            fontSize: 15,
            backgroundColor: 'white',
            color: '#1A1A2E',
            fontFamily: "'Cairo', sans-serif",
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = '#22C55E'}
          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF',
              fontSize: 16, lineHeight: 1, padding: 0,
            }}
          >
            {showPw ? '🙈' : '👁️'}
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const AuthScreen = ({ type, role, onBack, onAuthSuccess, onSwitchToLogin, onSwitchToSignup, onForgotPassword }) => {
  const { t, i18n } = useTranslation();
  const isSignup = type === 'signup';
  const isOwner = role === 'owner';
  const isRtl = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    stadiumName: '', location: '', phone: '',
    startTime: '', endTime: '', pricePerHour: '', capacity: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [ownershipDoc, setOwnershipDoc] = useState(null);
  const [docName, setDocName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (isSignup && formData.password !== formData.confirmPassword) {
      setError(t('auth.password_mismatch'));
      return;
    }
    
    setLoading(true);
    try {
      let payload;
      if (isSignup && isOwner && photo) {
        payload = new FormData();
        Object.keys(formData).forEach(key => payload.append(key, formData[key]));
        payload.append('role', role);
        payload.append('photo', photo);
        if (ownershipDoc) payload.append('ownershipDoc', ownershipDoc);
        const workingHours = formData.startTime && formData.endTime
          ? `${formData.startTime} - ${formData.endTime}`
          : '08:00 - 22:00';
        payload.append('workingHours', workingHours);
      } else {
        payload = {
          ...formData,
          role,
          workingHours: formData.startTime && formData.endTime
            ? `${formData.startTime} - ${formData.endTime}`
            : '08:00 - 22:00',
        };
      }

      const response = isSignup
        ? await DataService.registerUser(payload)
        : await DataService.loginUser(formData.email, formData.password);

      if (response?.user) onAuthSuccess(response.user);
      else setError(t('auth.invalid_credentials'));
    } catch (err) {
      setError(err.message || t('auth.error_generic'));
    } finally {
      setLoading(false);
    }
  };

  const inputDir = isRtl ? 'rtl' : 'ltr';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        backgroundColor: '#F2F3F5',
        fontFamily: "'Cairo', sans-serif",
        overflowY: 'auto',
      }}
    >
      {/* Top Bar: Back + Lang Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 20px 0',
        position: 'sticky',
        top: 0,
        backgroundColor: '#F2F3F5',
        zIndex: 10,
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: 15, fontWeight: 600,
            fontFamily: "'Cairo', sans-serif",
          }}
        >
          {isRtl ? '→' : '←'} {t('auth.back')}
        </button>
        <LangSwitcher />
      </div>

      {/* Content */}
      <div style={{ padding: '20px 24px 50px', maxWidth: 480, margin: '0 auto' }}>

        {/* Owner header (no logo, just title) */}
        {isOwner && isSignup ? (
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1A2E', marginBottom: 24, marginTop: 4 }}>
            {t('auth.owner_signup_title')}
          </h2>
        ) : (
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <BallLogo />
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A2E', marginBottom: 4 }}>
              {isSignup ? t('auth.signup_title') : t('auth.login_title')}
            </h2>
            <p style={{ fontSize: 14, color: '#22C55E', fontWeight: 600 }}>
              {isSignup ? t('auth.signup_subtitle') : t('auth.login_subtitle')}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5',
            borderRadius: 10, padding: '12px 16px', marginBottom: 16,
            fontSize: 14, color: '#B91C1C', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ direction: inputDir }}>

          {/* ── Owner Signup ── */}
          {isOwner && isSignup && (
            <>
              <SectionTitle text={t('auth.account_info')} />
              <Field label={t('auth.fullname')} name="fullName" placeholder={t('auth.fullname_placeholder')} iconRight="👤" value={formData.fullName} onChange={handleChange} />
              <Field label={t('auth.email')} name="email" type="email" placeholder={t('auth.email_placeholder')} iconRight="✉️" value={formData.email} onChange={handleChange} />
              <Field label={t('auth.password')} name="password" type="password" placeholder={t('auth.password_placeholder')} iconRight="🔒" value={formData.password} onChange={handleChange} />
              <Field label={t('auth.confirm_password')} name="confirmPassword" type="password" placeholder={t('auth.confirm_password_placeholder')} iconRight="🔒" value={formData.confirmPassword} onChange={handleChange} />

              <SectionTitle text={t('auth.stadium_details')} style={{ marginTop: 24 }} />
              <Field label={t('auth.stadium_name')} name="stadiumName" placeholder={t('auth.stadium_name_placeholder')} value={formData.stadiumName} onChange={handleChange} />
              <Field label={t('auth.stadium_location')} name="location" placeholder={t('auth.stadium_location_placeholder')} iconRight="📍" value={formData.location} onChange={handleChange} />
              <Field label={t('auth.phone')} name="phone" type="tel" placeholder={t('auth.phone_placeholder')} value={formData.phone} onChange={handleChange} />

              {/* Working Hours */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                  {t('auth.working_hours')}
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 4px', textAlign: 'center' }}>{t('auth.start_time')}</p>
                    <input name="startTime" type="time" required value={formData.startTime} onChange={handleChange}
                      style={{ width: '100%', padding: 12, border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 14, backgroundColor: 'white', fontFamily: "'Cairo', sans-serif", boxSizing: 'border-box', outline: 'none' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 4px', textAlign: 'center' }}>{t('auth.end_time')}</p>
                    <input name="endTime" type="time" required value={formData.endTime} onChange={handleChange}
                      style={{ width: '100%', padding: 12, border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 14, backgroundColor: 'white', fontFamily: "'Cairo', sans-serif", boxSizing: 'border-box', outline: 'none' }} />
                  </div>
                </div>
              </div>

              {/* Price + Capacity */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{t('auth.price_per_hour')}</label>
                  <input name="pricePerHour" type="number" placeholder={t('auth.price_per_hour_placeholder')} value={formData.pricePerHour} onChange={handleChange}
                    style={{ width: '100%', padding: 12, border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 14, backgroundColor: 'white', fontFamily: "'Cairo', sans-serif", boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{t('auth.capacity')}</label>
                  <input name="capacity" type="number" placeholder={t('auth.capacity_placeholder')} value={formData.capacity} onChange={handleChange}
                    style={{ width: '100%', padding: 12, border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 14, backgroundColor: 'white', fontFamily: "'Cairo', sans-serif", boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>

              {/* Photo Upload */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{t('auth.stadium_photo')}</label>
                <input 
                  type="file" 
                  id="photoInput" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPhoto(file);
                      setPhotoPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <div 
                  onClick={() => document.getElementById('photoInput').click()}
                  style={{ border: '2px dashed #22C55E', borderRadius: 12, padding: photoPreview ? '10px' : '28px 16px', textAlign: 'center', backgroundColor: 'white', cursor: 'pointer', color: '#9CA3AF', overflow: 'hidden' }}>
                  {photoPreview ? (
                    <img src={photoPreview} style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8 }} />
                  ) : (
                    <>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                      <p style={{ fontSize: 13, margin: 0 }}>{t('auth.photo_upload')}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Ownership Document Upload */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 6 }}>{t('auth.ownership_doc')}</label>
                <input 
                  type="file" 
                  id="docInput" 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setOwnershipDoc(file);
                      setDocName(file.name);
                    }
                  }}
                />
                <div 
                  onClick={() => document.getElementById('docInput').click()}
                  style={{ border: '2px dashed #3B82F6', borderRadius: 12, padding: '20px 16px', textAlign: 'center', backgroundColor: 'white', cursor: 'pointer', color: '#9CA3AF', overflow: 'hidden' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>📄</div>
                  <p style={{ fontSize: 13, margin: 0, color: docName ? '#3B82F6' : '#9CA3AF', fontWeight: docName ? 700 : 400 }}>
                    {docName || t('auth.ownership_doc_placeholder')}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ── Player Signup ── */}
          {!isOwner && isSignup && (
            <>
              <Field label={t('auth.fullname')} name="fullName" placeholder={t('auth.fullname_placeholder')} iconRight="👤" value={formData.fullName} onChange={handleChange} />
              <Field label={t('auth.email')} name="email" type="email" placeholder={t('auth.email_placeholder')} iconRight="✉️" value={formData.email} onChange={handleChange} />
              <Field label={t('auth.password')} name="password" type="password" placeholder={t('auth.password_placeholder')} iconRight="🔒" value={formData.password} onChange={handleChange} />
              <Field label={t('auth.confirm_password')} name="confirmPassword" type="password" placeholder={t('auth.confirm_password_placeholder')} iconRight="🔒" value={formData.confirmPassword} onChange={handleChange} />
            </>
          )}

          {/* ── Login ── */}
          {!isSignup && (
            <>
              <Field label={t('auth.email')} name="email" type="email" placeholder={t('auth.email_placeholder')} iconRight="✉️" value={formData.email} onChange={handleChange} />
              <Field label={t('auth.password')} name="password" type="password" placeholder={t('auth.password_placeholder')} iconRight="🔒" value={formData.password} onChange={handleChange} />
              <div style={{ textAlign: isRtl ? 'left' : 'right', marginBottom: 8 }}>
                <button type="button" onClick={onForgotPassword} style={{ background: 'none', border: 'none', color: '#22C55E', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
                  {t('auth.forgot_password')}
                </button>
              </div>
            </>
          )}

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#22C55E',
              color: 'white',
              border: 'none',
              borderRadius: 14,
              padding: '16px 0',
              fontSize: 18,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              fontFamily: "'Cairo', sans-serif",
              boxShadow: '0 4px 15px rgba(34,197,94,0.35)',
              marginTop: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? t('common.loading') : isSignup
              ? (isOwner ? t('auth.submit_owner_signup') : t('auth.submit_signup'))
              : t('auth.submit_login')}
          </motion.button>

          {/* Switch link */}
          <div style={{ textAlign: 'center', marginTop: 22 }}>
            <span style={{ fontSize: 14, color: '#6B7280' }}>
              {isSignup ? t('auth.already_account') : t('auth.no_account')}{' '}
            </span>
            <button
              type="button"
              onClick={isSignup ? onSwitchToLogin : onSwitchToSignup}
              style={{ background: 'none', border: 'none', color: '#22C55E', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}
            >
              {isSignup ? t('auth.login_link') : t('auth.signup_now')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Section Title Helper ─── */
const SectionTitle = ({ text, style = {} }) => (
  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1A1A2E', margin: '0 0 16px', ...style }}>
    {text}
  </h3>
);

export default AuthScreen;
