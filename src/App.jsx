import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n/config';
import WelcomeScreen from './pages/WelcomeScreen';
import RoleSelectScreen from './pages/RoleSelectScreen';
import AuthScreen from './pages/AuthScreen';
import PlayerDashboard from './pages/PlayerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  const { i18n } = useTranslation();
  // Build test comment
  const [currentPage, setCurrentPage] = useState('welcome');
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('player');
  const [resetToken, setResetToken] = useState(null);

  // Check for reset token in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
      setCurrentPage('reset_password');
      // Clear URL params without refreshing to keep it clean
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Inject Cairo font once
  useEffect(() => {
    if (!document.getElementById('cairo-font')) {
      const link = document.createElement('link');
      link.id = 'cairo-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // Update dir/lang whenever language changes
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage(userData.role === 'player' ? 'player_home' : 'owner_home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('welcome');
  };

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", backgroundColor: '#F2F3F5', minHeight: '100vh' }}>

      {/* Welcome */}
      {currentPage === 'welcome' && (
        <WelcomeScreen
          onNavigate={(page) => {
            if (page === 'auth_signup') setCurrentPage('role_select');
            else if (page === 'auth_login') setCurrentPage('auth_login');
          }}
        />
      )}

      {/* Role Selection */}
      {currentPage === 'role_select' && (
        <RoleSelectScreen
          onBack={() => setCurrentPage('welcome')}
          onNext={(role) => {
            setSelectedRole(role);
            setCurrentPage('auth_signup');
          }}
        />
      )}

      {/* Login */}
      {currentPage === 'auth_login' && (
        <AuthScreen
          type="login"
          role={selectedRole}
          onBack={() => setCurrentPage('welcome')}
          onAuthSuccess={handleLogin}
          onSwitchToLogin={() => setCurrentPage('auth_login')}
          onSwitchToSignup={() => setCurrentPage('role_select')}
          onForgotPassword={() => setCurrentPage('forgot_password')}
        />
      )}

      {/* Forgot Password */}
      {currentPage === 'forgot_password' && (
        <ForgotPassword onBack={() => setCurrentPage('auth_login')} />
      )}

      {/* Reset Password */}
      {currentPage === 'reset_password' && (
        <ResetPassword 
          token={resetToken} 
          onBack={() => {
            setResetToken(null);
            setCurrentPage('auth_login');
          }} 
        />
      )}

      {/* Signup */}
      {currentPage === 'auth_signup' && (
        <AuthScreen
          type="signup"
          role={selectedRole}
          onBack={() => setCurrentPage('role_select')}
          onAuthSuccess={handleLogin}
          onSwitchToLogin={() => setCurrentPage('auth_login')}
          onSwitchToSignup={() => setCurrentPage('role_select')}
          onForgotPassword={() => setCurrentPage('forgot_password')}
        />
      )}

      {/* Dashboards */}
      {currentPage === 'player_home' && (
        <PlayerDashboard user={user} onLogout={handleLogout} onUpdateUser={setUser} />
      )}

      {currentPage === 'owner_home' && (
        <OwnerDashboard user={user} onLogout={handleLogout} onUpdateUser={setUser} />
      )}
    </div>
  );
}

export default App;
