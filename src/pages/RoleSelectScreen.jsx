import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LangSwitcher from '../components/LangSwitcher';

const RoleSelectScreen = ({ onNext, onBack }) => {
  const { t, i18n } = useTranslation();
  const [selectedRole, setSelectedRole] = useState(null);
  const isRtl = i18n.language === 'ar';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F2F3F5',
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      {/* Top Bar: back + lang switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 0' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6B7280',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "'Cairo', sans-serif",
          }}
        >
          {isRtl ? '→' : '←'} {t('role.back')}
        </button>
        <LangSwitcher />
      </div>

      {/* Title */}
      <div style={{ padding: '32px 24px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
          {t('role.title')}
        </h1>
      </div>

      {/* Cards */}
      <div style={{ padding: '28px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Player Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedRole('player')}
          style={{
            backgroundColor: selectedRole === 'player' ? '#ECFDF5' : 'white',
            border: `2px solid ${selectedRole === 'player' ? '#22C55E' : '#E5E7EB'}`,
            borderRadius: 16,
            padding: '22px 20px',
            cursor: 'pointer',
            textAlign: isRtl ? 'right' : 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            transition: 'all 0.2s',
            width: '100%',
          }}
        >
          <div style={{ fontSize: 30 }}>🏃</div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
            {t('role.player_title')}
          </p>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0, fontWeight: 500 }}>
            {t('role.player_desc')}
          </p>
        </motion.button>

        {/* Owner Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedRole('owner')}
          style={{
            backgroundColor: selectedRole === 'owner' ? '#ECFDF5' : 'white',
            border: `2px solid ${selectedRole === 'owner' ? '#22C55E' : '#E5E7EB'}`,
            borderRadius: 16,
            padding: '22px 20px',
            cursor: 'pointer',
            textAlign: isRtl ? 'right' : 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            transition: 'all 0.2s',
            width: '100%',
          }}
        >
          <div style={{ fontSize: 30 }}>🏟️</div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
            {t('role.owner_title')}
          </p>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0, fontWeight: 500 }}>
            {t('role.owner_desc')}
          </p>
        </motion.button>
      </div>

      {/* Next Button */}
      <div style={{ padding: '0 24px 40px' }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!selectedRole}
          onClick={() => selectedRole && onNext(selectedRole)}
          style={{
            backgroundColor: selectedRole ? '#22C55E' : '#D1D5DB',
            color: 'white',
            border: 'none',
            borderRadius: 14,
            padding: '16px 0',
            fontSize: 18,
            fontWeight: 700,
            cursor: selectedRole ? 'pointer' : 'not-allowed',
            width: '100%',
            fontFamily: "'Cairo', sans-serif",
            boxShadow: selectedRole ? '0 4px 15px rgba(34,197,94,0.35)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {t('role.next')}
        </motion.button>
      </div>
    </div>
  );
};

export default RoleSelectScreen;
