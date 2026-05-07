import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import DataService from '../services/DataService';
import NotificationsScreen from '../components/NotificationsScreen';

/* ─── Icons ─── */
const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#22C55E' : 'none'} stroke={active ? '#22C55E' : '#9CA3AF'} strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const BookingsIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#22C55E' : '#9CA3AF'} strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ProfileIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#22C55E' : '#9CA3AF'} strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const StadiumIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v4c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 9v4c0 1.66 4.03 3 9 3s9-1.34 9-3V9"/><path d="M3 13v4c0 1.66 4.03 3 9 3s9-1.34 9-3v-4"/>
  </svg>
);
const OpponentIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const RatingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const LocationPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#22C55E" stroke="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
  </svg>
);
const StarFilledIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const BackIcon = ({ isRtl }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }}>
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="2" y1="14" x2="6" y2="14"/><line x1="10" y1="8" x2="14" y2="8"/><line x1="18" y1="16" x2="22" y2="16"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const UserGroupIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

/* ─── FONT ─── */
const FONT = "'Cairo', sans-serif";
const GREEN = '#22C55E';
const LIGHT_GREEN = '#DCFCE7';
const DARK = '#1A1A2E';
const GREY = '#6B7280';
const BG = '#F7F8FA';

const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  
  const fetchNotifs = async () => {
    try {
      if (userId) {
        const notifs = await DataService.getNotifications(userId);
        setNotifications(notifs);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  return { notifications, setNotifications };
};

/* ─── MAIN COMPONENT ─── */
const PlayerDashboard = ({ user, onLogout, onUpdateUser }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [tab, setTab] = useState('home'); // home | bookings | profile
  const [activeFeature, setActiveFeature] = useState(null); // null | 'stadium' | 'opponent' | 'rating'
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationInitialized, setLocationInitialized] = useState(false);
  const [stadiums, setStadiums] = useState([]);
  const [openMatches, setOpenMatches] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [allConfirmedBookings, setAllConfirmedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const { notifications, setNotifications } = useNotifications(user.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Local notifications engine for "match_reminder" and "rate_stadium"
  useEffect(() => {
    const processLocalNotifs = async () => {
      if (!myBookings.length) return;
      
      const now = new Date();
      for (const booking of myBookings) {
        if (booking.status !== 'confirmed') continue;
        
        // Parse booking date and time (slot like "17:00")
        const [hours, minutes] = booking.slot.split(':');
        const matchTime = new Date(booking.date);
        matchTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const timeDiffMins = (matchTime - now) / 1000 / 60;
        
        // 1. MATCH REMINDER: less than 30 mins away, and not past
        if (timeDiffMins <= 30 && timeDiffMins > 0) {
          const hasReminder = notifications.some(n => n.type === 'match_reminder' && n.relatedId === booking.id);
          if (!hasReminder) {
            await DataService.createNotification({
              userId: user.id,
              type: 'match_reminder',
              title: 'تذكير بمباراة',
              message: `مباراتك ستبدأ بعد ${Math.ceil(timeDiffMins)} دقيقة في ملعب ${booking.stadium?.name || 'الأبطال'}. لا تتأخر!`,
              relatedId: booking.id
            });
          }
        }
        
        // 2. RATE STADIUM: match has ended (trigger 1 hour after end, approx 2 hours after start)
        if (timeDiffMins < -120) {
          const hasRateNotif = notifications.some(n => n.type === 'rate_stadium' && n.relatedId === booking.id);
          if (!hasRateNotif) {
            await DataService.createNotification({
              userId: user.id,
              type: 'rate_stadium',
              title: '⭐ كيف كانت المباراة؟',
              message: `لقد انتهت مباراتك في ملعب ${booking.stadium?.name || 'النجوم'}. يرجى تقييم الملعب من حيث النظافة، الجودة، والإضاءة.`,
              relatedId: booking.id
            });
          }
        }
      }
    };
    processLocalNotifs();
  }, [myBookings, notifications, user.id]);

  /* Background Geolocation on Mount */
  useEffect(() => {
    const backgroundRequest = async () => {
      try {
        const coords = await requestLocation();
        await DataService.updateLocation(user.id, coords.latitude, coords.longitude);
      } catch (err) {
        console.log("Background location failed:", err);
      }
    };
    backgroundRequest();
  }, [user.id]);

  /* Get Geolocation Utility */
  const requestLocation = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject('not_supported'); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        setLocationLoading(false);
        resolve(pos.coords);
      },
      err => {
        setLocationLoading(false);
        setLocationError('تعذّر الحصول على موقعك. يرجى السماح بالوصول.');
        reject(err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

  /* Distance calculator (Haversine) */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  /* Feature tap: Non-blocking access with background data fetching */
  const handleFeatureTap = async (feature) => {
    // 1. Immediately switch to the feature view to ensure NO BLANK SCREEN or delay
    setActiveFeature(feature);
    setLoading(true);

    // 2. Try to get location but don't BLOCK the UI if it's slow
    const fetchWithLocation = async () => {
      let currentCoords = location;
      
      try {
        // Attempt a quick fresh location check but with a small timeout
        const pos = await new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 });
        });
        currentCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(currentCoords);
        DataService.updateLocation(user.id, currentCoords.lat, currentCoords.lng).catch(() => {});
      } catch (e) {
        console.log("Quick location check skipped or failed, using last known.");
      }

      try {
        if (feature === 'stadium' || feature === 'opponent' || feature === 'rating') {
          const data = await DataService.getAllStadiums();
          const enriched = data.map(s => ({
            ...s,
            distance: calculateDistance(currentCoords?.lat, currentCoords?.lng, s.latitude, s.longitude)
          })).sort((a,b) => (a.distance || 999) - (b.distance || 999));
          
          setStadiums(enriched);
          const allBookings = await DataService.getAllBookings();
          setAllConfirmedBookings(allBookings.filter(b => b.status === 'confirmed'));
        }

        if (feature === 'opponent') {
          const data = await DataService.getOpenMatches();
          setOpenMatches(data);
        }
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWithLocation();
  };

  const handleBook = async (stadiumId, slot, date) => {
    try {
      setLoading(true);
      await DataService.createBooking(stadiumId, user.id, slot, date || new Date().toISOString());
      showToast(isRtl ? '✅ تم تقديم طلب الحجز بنجاح' : '✅ Booking request sent');
      
      // Refresh bookings
      const myNotifs = await DataService.getNotifications(user.id);
      setNotifications(myNotifs);
      
      const allB = await DataService.getAllBookings();
      setAllConfirmedBookings(allB.filter(b => b.status === 'confirmed'));
      
      const myB = await DataService.getPlayerBookings(user.id);
      setMyBookings(myB);
      
      setActiveFeature(null);
    } catch (e) { 
      showToast(isRtl ? '❌ خطأ: ' + e.message : '❌ Error: ' + e.message); 
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMatch = async (matchId) => {
    try {
      await DataService.joinMatch(matchId, user.id);
      showToast(t('player.opponent.wait_for_opponent'));
    } catch (e) { showToast('خطأ في الانضمام'); }
  };

  const handleRate = async (stadiumId, ratings) => {
    try {
      await DataService.rateStadium(stadiumId, user.id, ratings);
      showToast(t('player.rating.rating_saved'));
      setActiveFeature(null);
    } catch (e) { showToast('خطأ في التقييم'); }
  };

  const handleCreateMatch = async (data) => {
    try {
      setLoading(true);
      // data: { selectedStadium, matchDate, matchTime, phone, ageGroup, format }
      
      // 1. Create the booking for this match
      const booking = await DataService.createBooking(data.selectedStadium.id, user.id, data.matchTime, data.matchDate);
      
      // 2. Create the match
      await DataService.createMatch(booking.id, parseInt(data.format) * 2, data.ageGroup, data.phone);
      
      showToast(isRtl ? '📣 تم إنشاء المباراة وبثها للاعبين!' : '📣 Match created and broadcasted!');
      
      // Refresh data
      const matches = await DataService.getOpenMatches();
      setOpenMatches(matches);
      
      setActiveFeature(null);
    } catch (e) { 
      showToast(isRtl ? '❌ فشل الإنشاء' : '❌ Creation failed');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const firstName = (user?.fullName || user?.email || 'لاعب').split(' ')[0];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', backgroundColor: BG, fontFamily: FONT, display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', backgroundColor: DARK, color: 'white', padding: '12px 24px', borderRadius: 20, fontSize: 14, fontWeight: 600, zIndex: 999, fontFamily: FONT, whiteSpace: 'nowrap' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Inner Screen ── */}
      <AnimatePresence mode="wait">
        {showSecuritySettings ? (
          <SecuritySettingsScreen
             key="security"
             isRtl={isRtl}
             onBack={() => setShowSecuritySettings(false)}
             onSave={async (currentPassword, newPassword) => {
               try {
                 await DataService.updatePassword(user.id, currentPassword, newPassword);
                 setShowSecuritySettings(false);
                 showToast(isRtl ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated');
               } catch (err) {
                 showToast(isRtl ? 'فشل التحديث: ' + err.message : 'Error: ' + err.message);
               }
             }}
          />
        ) : showEditProfile ? (
          <ProfileSettingsScreen
            key="edit-profile"
            user={user}
            isRtl={isRtl}
            onBack={() => setShowEditProfile(false)}
            onSave={async (data) => {
              try {
                await DataService.updateProfile(user.id, data.name, data.email);
                onUpdateUser({ ...user, fullName: data.name });
                showToast(isRtl ? 'تم الحفظ بنجاح' : 'Saved successfully');
                setShowEditProfile(false);
              } catch(err) {
                showToast('Error: ' + err.message);
              }
            }}
          />
        ) : activeFeature ? (
          <FeatureScreen
            key={activeFeature}
            feature={activeFeature}
            isRtl={isRtl}
            t={t}
            stadiums={stadiums}
            openMatches={openMatches}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onBack={() => setActiveFeature(null)}
            onBook={handleBook}
            onJoin={handleJoinMatch}
            onRate={handleRate}
            onCreateMatch={handleCreateMatch}
            userId={user.id}
            myBookings={myBookings}
            allConfirmedBookings={allConfirmedBookings}
          />
        ) : tab === 'notifications' ? (
          <NotificationsScreen 
            key="notifs" 
            notifications={notifications} 
            isRtl={isRtl} 
            onBack={() => setTab('home')}
            onMarkAsRead={async (id) => {
              const prev = [...notifications];
              setNotifications(prev.map(n => n.id === id ? { ...n, isRead: true } : n));
              try { await DataService.markNotificationRead(id); } catch(e) { setNotifications(prev); }
            }}
            onNotificationClick={(n) => {
              if (n.type === 'booking_confirmed' || n.type === 'discount') {
                setTab('bookings');
              } else if (n.type === 'rate_stadium') {
                 setTab('home');
                 setActiveFeature('rating');
              } else if (n.type === 'match_new_broadcast') {
                 setTab('home');
                 handleFeatureTap('opponent');
              } else if (n.type === 'match_canceled_conflict') {
                 setTab('home');
                 handleFeatureTap('opponent');
              }
            }}
          />
        ) : tab === 'bookings' ? (
          <BookingsScreen key="bookings" isRtl={isRtl} onBack={() => setTab('home')} bookings={myBookings} />
        ) : tab === 'profile' ? (
          <ProfileScreen
            key="profile"
            user={user}
            isRtl={isRtl}
            t={t}
            onLogout={onLogout}
            onEditProfile={() => setShowEditProfile(true)}
            onSecurity={() => setShowSecuritySettings(true)}
            bookingsCount={myBookings.length}
          />
        ) : (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingBottom: 40 }}>

            {/* HEADER MATCH IMAGE 1 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '52px 24px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, overflow: 'hidden', border: '2px solid #E5E7EB', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                     onClick={() => setTab('profile')}>
                  <img src="/logo.png" alt="avatar" style={{ width: 32, height: 32, objectFit: 'contain' }}
                    onError={e => { e.target.parentNode.innerHTML = '<span style="font-size:20px">🧑</span>'; }} />
                </div>
                <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                  <h1 style={{ fontSize: 18, fontWeight: 800, color: DARK, margin: 0 }}>
                    {isRtl ? `أهلاً بك، ${firstName}!` : `Welcome, ${firstName}!`}
                  </h1>
                </div>
              </div>
              
              <h2 style={{ fontSize: 20, fontWeight: 900, color: GREEN, margin: 0, fontFamily: FONT }}>
                KINETIC ARENA
              </h2>
            </div>

            {/* Location status - Non-blocking */}
            {locationLoading && (
              <div style={{ textAlign: 'center', fontSize: 11, color: GREEN, marginBottom: 8, fontWeight: 700 }}>📡 جاري تحديث موقعك بدقة...</div>
            )}

            {/* FEATURE CARDS */}
            <div style={{ padding: '0 20px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FeatureCard
                icon={<StadiumIcon />}
                label={t('player.tabs.search_stadium')}
                bg={GREEN}
                textColor="white"
                iconColor="white"
                onTap={() => handleFeatureTap('stadium')}
              />
              <FeatureCard
                icon={<OpponentIcon />}
                label={t('player.tabs.search_opponent')}
                bg={LIGHT_GREEN}
                textColor={DARK}
                iconColor={DARK}
                onTap={() => handleFeatureTap('opponent')}
              />
              <FeatureCard
                icon={<RatingIcon />}
                label={t('player.tabs.rate_stadium')}
                bg={LIGHT_GREEN}
                textColor={DARK}
                iconColor={DARK}
                onTap={() => handleFeatureTap('rating')}
                showDot={notifications.some(n => !n.isRead && n.type === 'rate_stadium')}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM NAV */}
      {!activeFeature && !showEditProfile && !showSecuritySettings && (
        <BottomNav tab={tab} setTab={setTab} isRtl={isRtl} t={t} onLogout={onLogout} notifications={notifications} />
      )}
    </div>
  );
};

/* ─── Feature Card ─── */
const FeatureCard = ({ icon, label, bg, textColor, iconColor, onTap, showDot }) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    onClick={onTap}
    style={{
      backgroundColor: bg,
      border: 'none',
      borderRadius: 20,
      padding: '28px 20px',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      fontFamily: FONT,
      boxShadow: bg === GREEN ? '0 6px 20px rgba(34,197,94,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
      position: 'relative'
    }}
  >
    {showDot && (
       <div style={{ position: 'absolute', top: 12, right: 12, width: 10, height: 10, backgroundColor: GREEN, borderRadius: '50%', border: '2px solid white' }} />
    )}
    <div style={{ color: iconColor }}>{icon}</div>
    <span style={{ fontSize: 18, fontWeight: 700, color: textColor }}>{label}</span>
  </motion.button>
);

/* ─── Feature Screen (Stadium / Opponent / Rating) ─── */
const FeatureScreen = ({ feature, isRtl, t, stadiums, openMatches, loading, searchQuery, setSearchQuery, onBack, onBook, onJoin, onRate, onCreateMatch, userId, myBookings, allConfirmedBookings }) => {
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [ratings, setRatings] = useState({ lighting: 3, pitchQuality: 3, cleanliness: 3, comment: '' });

  const title = feature === 'stadium'
    ? t('player.tabs.search_stadium')
    : feature === 'opponent'
    ? t('player.tabs.search_opponent')
    : t('player.tabs.rate_stadium');

  const filtered = stadiums.filter(s =>
    !searchQuery || s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ x: isRtl ? -40 : 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: isRtl ? 40 : -40, opacity: 0 }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Sticky Header */}
      <div style={{ position: 'sticky', top: 0, backgroundColor: BG, zIndex: 20, padding: '52px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {selectedStadium ? (
          <>
            <button onClick={() => setSelectedStadium(null)} style={{ background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <BackIcon isRtl={isRtl} />
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: DARK, margin: 0, flex: 1, textAlign: 'center' }}>
              {isRtl ? 'تفاصيل الملعب' : 'Stadium Details'}
            </h2>
            <div style={{ width: 40, height: 40, borderRadius: 12, overflow: 'hidden', border: '2px solid #E5E7EB' }}>
              <img src="/logo.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </>
        ) : (
          <>
            <button onClick={onBack} style={{ background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <BackIcon isRtl={isRtl} />
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: DARK, margin: 0, flex: 1, textAlign: 'center' }}>FIND A PITCH</h2>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>⚽</div>
          </>
        )}
      </div>

      {/* Search bar (stadium & rating) */}
      {(feature === 'stadium' || feature === 'rating') && !selectedStadium && (
        <div style={{ padding: '24px 20px 0' }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: DARK, margin: '0 0 4px', textAlign: isRtl ? 'right' : 'left' }}>
            {isRtl ? 'ابحث عن ملعب' : 'Search for a pitch'}
          </h1>
          <p style={{ fontSize: 13, color: GREY, margin: '0 0 24px', textAlign: isRtl ? 'right' : 'left' }}>
            {isRtl ? 'لحجز أفضل ملاعب كرة القدم القريبة منك' : 'To book the best football pitches near you'}
          </p>
          
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
            <button style={{ backgroundColor: '#065F46', color: 'white', border: 'none', borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              <FilterIcon />
              <span>{isRtl ? 'تصفية' : 'Filter'}</span>
            </button>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', right: isRtl ? 'auto' : 14, left: isRtl ? 14 : 'auto', top: '50%', transform: 'translateY(-50%)' }}>
                <SearchIcon />
              </span>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isRtl ? 'ابحث بالاسم أو الموقع...' : 'Search by name or location...'}
                style={{ width: '100%', padding: isRtl ? '13px 44px 13px 16px' : '13px 16px 13px 44px', border: '1.5px solid #E5E7EB', borderRadius: 14, fontSize: 14, backgroundColor: 'white', fontFamily: FONT, boxSizing: 'border-box', outline: 'none', direction: isRtl ? 'rtl' : 'ltr' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: selectedStadium && feature !== 'rating' ? '0 0 100px' : '0 20px 120px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 60, color: GREY, fontSize: 16 }}>⏳ {t('common.loading')}</div>
        ) : (selectedStadium && feature !== 'rating') ? (
          <StadiumDetail stadium={selectedStadium} onBook={onBook} isRtl={isRtl} t={t} />
        ) : feature === 'stadium' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 10 }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: DARK, margin: 0 }}>{isRtl ? 'ملاعب قريبة منك' : 'Nearby Stadiums'}</h3>
              <button style={{ background: 'none', border: 'none', color: GREEN, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>{isRtl ? 'عرض الكل' : 'View All'}</span> {isRtl ? '←' : '→'}
              </button>
            </div>
            <StadiumList stadiums={filtered} onSelect={setSelectedStadium} isRtl={isRtl} t={t} />
          </>
        ) : feature === 'opponent' ? (
          <OpponentView
            openMatches={openMatches}
            onJoin={onJoin}
            stadiums={stadiums}
            userId={userId}
            isRtl={isRtl}
            t={t}
            onCreateConfirm={onCreateMatch}
            allConfirmedBookings={allConfirmedBookings}
          />
        ) : (
          <RatingView 
            stadiums={
              myBookings ? Array.from(new Set(myBookings.map(b => b.stadium?.id)))
                .map(id => myBookings.find(b => b.stadium?.id === id)?.stadium)
                .filter(Boolean) : []
            } 
            onRate={onRate} isRtl={isRtl} t={t} selectedStadium={selectedStadium} setSelectedStadium={setSelectedStadium} ratings={ratings} setRatings={setRatings} 
          />
        )}
      </div>
    </motion.div>
  );
};

/* ─── Stadium List ─── */
const StadiumList = ({ stadiums, onSelect, isRtl, t }) => {
  if (!stadiums.length) return (
    <div style={{ textAlign: 'center', marginTop: 60, color: GREY }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🏟️</div>
      <p>{isRtl ? 'لا توجد ملاعب متاحة حالياً' : 'No stadiums available'}</p>
    </div>
  );

  return stadiums.map(s => (
    <motion.div key={s.id} whileTap={{ scale: 0.98 }} onClick={() => onSelect(s)}
      style={{ backgroundColor: 'white', borderRadius: 24, padding: '0', marginBottom: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #F3F4F6', cursor: 'pointer' }}>
      
      <div style={{ position: 'relative', height: 180 }}>
        <img src={s.photoUrl || (s.name.includes('المدينة') ? '/stadium-red.jpg' : '/stadium-green.jpg')} alt="stadium" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = '/stadium-bg.jpg'; }} />
        <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: '#065F46', color: 'white', padding: '6px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
          {s.pricePerHour} {isRtl ? 'د.ج / ساعة' : 'DZD / hr'}
        </div>
      </div>

      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: DARK, margin: 0 }}>{s.name}</h3>
          <div style={{ backgroundColor: '#F3F4F6', borderRadius: 20, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <StarIcon /> <span style={{ fontSize: 12, fontWeight: 800, color: DARK }}>{s.avgRating || '0.0'}</span> <span style={{ fontSize: 11, color: GREY }}>({s.ratingCount || '0'})</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: GREY, fontSize: 12, marginBottom: 20 }}>
          <MapPinIcon /> <span>{s.location}</span>
        </div>

        <button style={{ width: '100%', backgroundColor: '#F3F4F6', color: DARK, border: 'none', borderRadius: 16, padding: '14px', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <span>{isRtl ? 'اختر الآن' : 'Select Now'}</span>
          <span style={{ fontSize: 16 }}>{isRtl ? '‹' : '›'}</span>
        </button>
      </div>
    </motion.div>
  ));
};

const StadiumDetail = ({ stadium, onBook, isRtl, t, allConfirmedBookings = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? (isRtl ? 'م' : 'PM') : (isRtl ? 'ص' : 'AM');
    const hours12 = h % 12 || 12;
    return `${hours12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const generateSlots = () => {
    try {
      if (!stadium.workingHours) return ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
      
      const [startStr, endStr] = stadium.workingHours.split('-').map(s => s.trim());
      const [startH, startM] = startStr.split(':').map(Number);
      const [endH, endM] = endStr.split(':').map(Number);
      
      let currentMin = startH * 60 + startM;
      let endMin = endH * 60 + endM;
      if (endMin <= currentMin) endMin += 24 * 60;
      
      const res = [];
      while (currentMin < endMin) {
        const h = Math.floor(currentMin / 60) % 24;
        const m = currentMin % 60;
        res.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        currentMin += 60;
      }
      return res;
    } catch (e) {
      return ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    }
  };

  const slots = generateSlots();

  const getDates = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        day: d.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'short' }),
        date: d.getDate(),
        fullDate: d.toISOString().split('T')[0]
      });
    }
    return days;
  };

  const isSlotBooked = (slot) => {
    return allConfirmedBookings.some(b => 
      b.stadiumId === stadium.id && 
      b.slot === slot && 
      b.date.split('T')[0] === selectedDate
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: 100 }}>
      {/* Hero Image */}
      <div style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
        <img 
          src={stadium.photoUrl || '/stadium-bg.jpg'} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          onError={e => { e.target.src = '/stadium-bg.jpg'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)' }} />
        
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
           <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: '0 0 8px' }}>{stadium.name}</h1>
           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {stadium.avgRating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 10, backdropFilter: 'blur(10px)' }}>
                   <StarIcon /> <span style={{ color: 'white', fontSize: 13, fontWeight: 800 }}>{stadium.avgRating}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>
                 <LocationPinIcon /> <span>{stadium.location}</span>
              </div>
           </div>
        </div>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, color: GREY, fontWeight: 700 }}>{isRtl ? 'السعر' : 'Price'}</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: GREEN }}>{stadium.pricePerHour} <span style={{ fontSize: 12 }}>دج/ساعة</span></p>
          </div>
          <div style={{ backgroundColor: 'white', padding: 16, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, color: GREY, fontWeight: 700 }}>{isRtl ? 'المساحة' : 'Size'}</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: DARK }}>{stadium.capacity} {isRtl ? 'لاعبين' : 'Players'}</p>
          </div>
        </div>

        {/* Date Selector */}
        <h3 style={{ fontSize: 18, fontWeight: 900, color: DARK, marginBottom: 16 }}>{isRtl ? 'اختر التاريخ' : 'Select Date'}</h3>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12, marginBottom: 24, scrollbarWidth: 'none' }}>
           {getDates().map(d => (
             <button key={d.fullDate} onClick={() => { setSelectedDate(d.fullDate); setSelectedSlot(null); }}
               style={{ minWidth: 65, padding: '16px 0', borderRadius: 20, border: 'none', backgroundColor: selectedDate === d.fullDate ? GREEN : 'white', color: selectedDate === d.fullDate ? 'white' : DARK, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
               <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.8 }}>{d.day}</span>
               <span style={{ fontSize: 18, fontWeight: 900 }}>{d.date}</span>
             </button>
           ))}
        </div>

        {/* Time Slots */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
           {slots.map(s => {
             const booked = isSlotBooked(s);
             const isSelected = selectedSlot === s;
             return (
                <button key={s} disabled={booked} onClick={() => setSelectedSlot(s)}
                  style={{ 
                    padding: '14px 0', 
                    borderRadius: 16, 
                    border: booked ? 'none' : (isSelected ? 'none' : '1.5px solid #E5E7EB'), 
                    backgroundColor: booked ? '#EF4444' : (isSelected ? DARK : 'white'), 
                    color: booked || isSelected ? 'white' : DARK, 
                    fontSize: 13, 
                    fontWeight: 800, 
                    cursor: booked ? 'not-allowed' : 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s',
                    textDecoration: booked ? 'line-through' : 'none',
                    opacity: booked ? 0.9 : 1
                  }}>
                  {formatTime(s)}
                  {booked && <div style={{ fontSize: 9, fontWeight: 900, marginTop: 2, textDecoration: 'none' }}>{isRtl ? 'مشغول 🚫' : 'BUSY 🚫'}</div>}
                </button>
             );
           })}
        </div>

        {/* Booking Button */}
        <motion.button 
          whileTap={{ scale: 0.96 }}
          disabled={!selectedSlot}
          onClick={() => onBook(stadium.id, selectedSlot, selectedDate)}
          style={{ width: '100%', padding: '20px', backgroundColor: GREEN, color: 'white', border: 'none', borderRadius: 20, fontSize: 18, fontWeight: 800, cursor: selectedSlot ? 'pointer' : 'not-allowed', opacity: selectedSlot ? 1 : 0.6, boxShadow: '0 8px 25px rgba(34,197,94,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <span>{isRtl ? 'تأكيد الحجز الآن' : 'Confirm Booking'}</span>
          <span style={{ fontSize: 20 }}>⚽</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ─── Create Match Screen ─── */
const CreateMatchScreen = ({ isRtl, t, stadiums, onBack, onConfirm, allConfirmedBookings = [], initialStadium = null }) => {
  const [selectedStadium, setSelectedStadium] = useState(initialStadium);
  const [showStadiumPicker, setShowStadiumPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [phone, setPhone] = useState('05XXXXXXXX');
  const [ageGroup, setAgeGroup] = useState('20-30');
  const [format, setFormat] = useState('5');

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedStadium]);

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? (isRtl ? 'م' : 'PM') : (isRtl ? 'ص' : 'AM');
    const hours12 = h % 12 || 12;
    return `${hours12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const generateSlots = () => {
    try {
      if (!selectedStadium || !selectedStadium.workingHours) return [];
      const [startStr, endStr] = selectedStadium.workingHours.split('-').map(s => s.trim());
      const [startH, startM] = startStr.split(':').map(Number);
      const [endH, endM] = endStr.split(':').map(Number);
      
      let currentMin = startH * 60 + startM;
      let endMin = endH * 60 + endM;
      if (endMin <= currentMin) endMin += 24 * 60;
      
      const res = [];
      while (currentMin < endMin) {
        const h = Math.floor(currentMin / 60) % 24;
        const m = currentMin % 60;
        res.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        currentMin += 60;
      }
      return res;
    } catch (e) {
      return [];
    }
  };

  const slots = generateSlots();

  const isSlotBooked = (slot, date, stadiumId) => {
    if (!stadiumId) return false;
    return allConfirmedBookings.some(b => b.stadiumId === stadiumId && b.slot === slot && b.date.split('T')[0] === date);
  };

  const getDates = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push({
            day: d.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'short' }),
            date: d.getDate(),
            fullDate: d.toISOString().split('T')[0]
        });
    }
    return days;
  };

  const handleConfirm = () => {
    if (!selectedStadium) { alert(isRtl ? 'اختر ملعباً أولاً' : 'Choose stadium first'); return; }
    if (!selectedSlot) { alert(isRtl ? 'اختر وقتاً' : 'Choose time'); return; }
    onConfirm({ selectedStadium, matchDate: selectedDate, matchTime: selectedSlot, phone, ageGroup, format });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: 120, backgroundColor: BG, minHeight: '100vh', direction: isRtl ? 'rtl' : 'ltr' }}>
        <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
            <img src={selectedStadium?.photoUrl || '/stadium-bg.jpg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 100%)' }} />
            
            <div style={{ position: 'absolute', top: 52, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onBack} style={{ background: 'white', border: 'none', borderRadius: 12, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <BackIcon isRtl={isRtl} />
                </button>
                <div style={{ width: 40, height: 40, borderRadius: 12, overflow: 'hidden', border: '2px solid white' }}>
                    <img src="/logo.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: '0 0 6px' }}>{selectedStadium ? selectedStadium.name : (isRtl ? 'اختر ملعباً' : 'Choose a Stadium')}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <LocationPinIcon /> <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{selectedStadium?.location || (isRtl ? 'لم يتم تحديد موقع' : 'No location')}</span>
                </div>
            </div>
            
            <button onClick={() => setShowStadiumPicker(true)} style={{ position: 'absolute', bottom: 20, right: isRtl ? 'auto' : 20, left: isRtl ? 20 : 'auto', backgroundColor: '#FBBF24', color: DARK, border: 'none', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                {isRtl ? 'تغيير' : 'Change'}
            </button>
        </div>

        <div style={{ padding: '24px 20px' }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: GREEN, textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>Booking Details</h4>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: DARK, margin: '0 0 20px' }}>{isRtl ? 'اختر التاريخ' : 'Choose Date'}</h3>
            
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12, marginBottom: 24, scrollbarWidth: 'none' }}>
                {getDates().map(d => (
                    <button key={d.fullDate} onClick={() => { setSelectedDate(d.fullDate); setSelectedSlot(null); }}
                        style={{ minWidth: 65, padding: '16px 0', borderRadius: 20, border: 'none', cursor: 'pointer', backgroundColor: selectedDate === d.fullDate ? '#065F46' : 'white', color: selectedDate === d.fullDate ? 'white' : DARK, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <span style={{ fontSize: 10 }}>{d.day}</span>
                        <span style={{ fontSize: 18, fontWeight: 900 }}>{d.date}</span>
                    </button>
                ))}
            </div>

            {slots.length > 0 ? (
              <>
                <h4 style={{ fontSize: 11, fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', marginBottom: 12 }}>Available Times</h4>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: DARK, margin: '0 0 20px' }}>{isRtl ? 'الأوقات المتاحة' : 'Available Times'}</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
                    {slots.map(s => {
                        const booked = isSlotBooked(s, selectedDate, selectedStadium?.id);
                        const isSelected = selectedSlot === s;
                        return (
                            <button key={s} disabled={booked} onClick={() => setSelectedSlot(s)}
                                style={{ padding: '14px 0', borderRadius: 16, border: booked ? 'none' : (isSelected ? 'none' : '1.5px solid #E5E7EB'), backgroundColor: booked ? '#EF4444' : (isSelected ? '#065F46' : 'white'), color: booked || isSelected ? 'white' : DARK, fontWeight: 800, fontSize: 13, cursor: booked ? 'not-allowed' : 'pointer', opacity: booked ? 0.9 : 1, transition: 'all 0.2s' }}>
                                {formatTime(s)}
                                {booked && <div style={{ fontSize: 9, fontWeight: 900, marginTop: 2 }}>{isRtl ? 'مشغول' : 'BUSY'}</div>}
                            </button>
                        );
                    })}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 20px', backgroundColor: 'white', borderRadius: 24, marginBottom: 32, boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: GREY }}>
                  {selectedStadium 
                    ? (isRtl ? 'لا توجد أوقات عمل محددة لهذا الملعب' : 'No working hours defined for this stadium')
                    : (isRtl ? 'يرجى اختيار ملعب أولاً لعرض الأوقات المتاحة' : 'Please select a stadium to see available times')
                  }
                </p>
              </div>
            )}

            <h4 style={{ fontSize: 11, fontWeight: 800, color: '#F87171', textTransform: 'uppercase', marginBottom: 12 }}>Match Info</h4>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: DARK, margin: '0 0 20px' }}>{isRtl ? 'معلومات المباراة' : 'Match Info'}</h3>

            <div style={{ backgroundColor: 'white', borderRadius: 24, padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                    <span style={{ fontSize: 11, color: GREY, display: 'block' }}>رقم التواصل</span>
                    <input value={phone} onChange={e => setPhone(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 18, fontWeight: 900, color: DARK, width: '100%', direction: 'ltr' }} />
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563EB"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.05 15.05 0 01-6.59-6.59l2.2-2.21a1.02 1.02 0 00.25-1.02c-.37-1.12-.57-2.32-.57-3.57 0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/></svg>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 24, padding: '16px 20px', marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                    <span style={{ fontSize: 11, color: GREY, display: 'block' }}>متوسط الأعمار</span>
                    <input value={ageGroup} onChange={e => setAgeGroup(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 18, fontWeight: 900, color: DARK, width: '100%' }} />
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserGroupIcon />
                </div>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleConfirm}
                style={{ width: '100%', padding: '20px', backgroundColor: '#065F46', color: 'white', border: 'none', borderRadius: 24, fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 10px 30px rgba(6,95,70,0.3)' }}>
                <CheckCircleIcon />
                <span>{isRtl ? 'تأكيد إنشاء المباراة' : 'Confirm Match Creation'}</span>
            </motion.button>
        </div>

        {/* Stadium Picker Overlay */}
        <AnimatePresence>
            {showStadiumPicker && (
                <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} style={{ position: 'fixed', inset: 0, backgroundColor: 'white', zIndex: 100, padding: '52px 20px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                        <button onClick={() => setShowStadiumPicker(false)} style={{ background: 'none', border: 'none', fontSize: 20 }}>✕</button>
                        <h2 style={{ fontSize: 20, fontWeight: 900 }}>{isRtl ? 'اختر ملعباً' : 'Choose a Stadium'}</h2>
                    </div>
                    {stadiums.map(s => (
                        <div key={s.id} onClick={() => { setSelectedStadium(s); setShowStadiumPicker(false); }}
                            style={{ padding: '16px', backgroundColor: '#F9FAFB', borderRadius: 16, marginBottom: 12, cursor: 'pointer', border: selectedStadium?.id === s.id ? '2px solid #22C55E' : 'none' }}>
                            <p style={{ margin: 0, fontWeight: 800 }}>{s.name}</p>
                            <p style={{ margin: 0, fontSize: 12, color: GREY }}>{s.location}</p>
                        </div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};

/* ─── Opponent View ─── */
const OpponentView = ({ openMatches, onJoin, stadiums, userId, isRtl, t, onCreateConfirm, allConfirmedBookings }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('open'); // 'open' | 'create'
  const [selectedStadium, setSelectedStadium] = useState(null);

  if (showCreate) return (
    <CreateMatchScreen
      isRtl={isRtl}
      t={t}
      stadiums={stadiums}
      initialStadium={selectedStadium}
      onBack={() => setShowCreate(false)}
      onConfirm={(data) => { onCreateConfirm(data); setShowCreate(false); }}
      allConfirmedBookings={allConfirmedBookings}
    />
  );

  const filteredMatches = openMatches.filter(m => 
    !search || m.booking?.stadium?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '0 0 100px' }}>
      {/* Header Info */}
      <h1 style={{ fontSize: 26, fontWeight: 900, color: DARK, margin: '24px 20px 4px', textAlign: isRtl ? 'right' : 'left' }}>
        {isRtl ? 'البحث عن خصم' : 'Find an Opponent'}
      </h1>
      <p style={{ fontSize: 13, color: GREY, margin: '0 20px 24px', textAlign: isRtl ? 'right' : 'left' }}>
        {isRtl ? 'انضم لمباراة موجودة أو أنشئ واحدة جديدة' : 'Join an existing match or create a new one'}
      </p>

      {/* Tabs */}
      <div style={{ padding: '0 20px', display: 'flex', gap: 12, marginBottom: 24 }}>
        <button onClick={() => setActiveTab('open')} style={{ flex: 1, padding: '12px', borderRadius: 16, border: 'none', backgroundColor: activeTab === 'open' ? GREEN : 'white', color: activeTab === 'open' ? 'white' : DARK, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          {isRtl ? 'المباريات المفتوحة' : 'Open Matches'}
        </button>
        <button onClick={() => setActiveTab('create')} style={{ flex: 1, padding: '12px', borderRadius: 16, border: 'none', backgroundColor: activeTab === 'create' ? GREEN : 'white', color: activeTab === 'create' ? 'white' : DARK, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          {isRtl ? 'إنشاء تحدي جديد' : 'Create Challenge'}
        </button>
      </div>

      <div style={{ padding: '0 20px' }}>
        {activeTab === 'open' ? (
          <>
            {filteredMatches.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: 40, color: GREY }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⚽</div>
                <p>{isRtl ? 'لا توجد مباريات مفتوحة حالياً' : 'No open matches'}</p>
              </div>
            ) : filteredMatches.map(m => (
              <div key={m.id} style={{ backgroundColor: 'white', borderRadius: 28, padding: 20, marginBottom: 20, boxShadow: '0 8px 25px rgba(0,0,0,0.03)', border: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 900, color: DARK }}>{m.booking?.stadium?.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: GREY, fontSize: 12 }}>
                      <LocationPinIcon /> <span>{m.booking?.stadium?.location}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                    <div style={{ backgroundColor: LIGHT_GREEN, color: GREEN, padding: '4px 10px', borderRadius: 10, fontSize: 11, fontWeight: 800 }}>
                      {m.neededPlayers} {isRtl ? 'لاعب مطلوب' : 'Needed'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 16 }}>
                  <div style={{ flex: 1 }}>
                     <p style={{ margin: '0 0 2px', fontSize: 10, color: GREY, fontWeight: 700 }}>{isRtl ? 'التاريخ' : 'Date'}</p>
                     <p style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>{m.booking?.date.split('T')[0]}</p>
                  </div>
                  <div style={{ width: 1, height: 24, backgroundColor: '#E5E7EB' }} />
                  <div style={{ flex: 1 }}>
                     <p style={{ margin: '0 0 2px', fontSize: 10, color: GREY, fontWeight: 700 }}>{isRtl ? 'التوقيت' : 'Time'}</p>
                     <p style={{ margin: 0, fontSize: 13, fontWeight: 800 }}>{m.booking?.slot}</p>
                  </div>
                </div>

                <button onClick={() => onJoin(m.id)} style={{ width: '100%', padding: '14px', backgroundColor: DARK, color: 'white', border: 'none', borderRadius: 16, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
                  {isRtl ? 'قبول التحدي الآن' : 'Accept Challenge'}
                </button>
              </div>
            ))}
          </>
        ) : (
          <>
            {stadiums.map(s => (
              <div key={s.id} style={{ backgroundColor: 'white', borderRadius: 32, marginBottom: 24, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6' }}>
                <div style={{ position: 'relative', height: 180 }}>
                    <img src={s.photoUrl || '/stadium-bg.jpg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {s.distance && (
                      <div style={{ position: 'absolute', top: 12, right: isRtl ? 'auto' : 12, left: isRtl ? 12 : 'auto', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '6px 12px', borderRadius: 10, fontSize: 11, fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                        📍 {s.distance.toFixed(1)} km
                      </div>
                    )}
                </div>
                <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: DARK, margin: '0 0 4px' }}>{s.name}</h3>
                    <p style={{ fontSize: 12, color: GREY, margin: '0 0 16px' }}>{s.location}</p>
                    <button onClick={() => { setSelectedStadium(s); setShowCreate(true); }} style={{ width: '100%', padding: '14px', backgroundColor: GREEN, color: 'white', border: 'none', borderRadius: 16, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
                        {isRtl ? 'اختر لإنشاء مباراة' : 'Select to Create Match'}
                    </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};


/* ─── Rating View ─── */
const RatingView = ({ stadiums, onRate, isRtl, t, selectedStadium, setSelectedStadium, ratings, setRatings }) => {
  if (!selectedStadium) return (
    <div style={{ padding: '0 20px' }}>
      <p style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 16, textAlign: isRtl ? 'right' : 'left' }}>
        {isRtl ? 'اختر ملعباً لتقييمه:' : 'Choose a stadium to rate:'}
      </p>
      {!stadiums.length ? (
         <div style={{ textAlign: 'center', marginTop: 40, color: GREY }}><div style={{ fontSize: 40, marginBottom: 12 }}>🏟️</div><p>{isRtl ? 'لم تلعب في أي ملعب بعد!' : 'You haven\'t played in any stadium yet!'}</p></div>
      ) : stadiums.map(s => (
        <motion.button key={s.id} whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedStadium(s)}
          style={{ width: '100%', backgroundColor: 'white', border: 'none', borderRadius: 18, padding: '16px 18px', marginBottom: 14, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: FONT, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: DARK, margin: '0 0 6px' }}>{s.name}</p>
            <p style={{ fontSize: 14, color: GREY, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
               <span style={{ fontSize: 13 }}>📍</span> {s.location}
            </p>
          </div>
          <span style={{ color: GREEN, fontSize: 18 }}>{isRtl ? '←' : '→'}</span>
        </motion.button>
      ))}
    </div>
  );

  const DetailedRatingRow = ({ label, field, icon, color, bg }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #F3F4F6' }}>
      <div style={{ display: 'flex', gap: 4, direction: 'ltr' }}>
        {[1,2,3,4,5].map(v => (
          <motion.button key={v} whileTap={{ scale: 0.8 }} onClick={() => setRatings(r => ({ ...r, [field]: v }))}
            style={{ background:'none', border:'none', cursor:'pointer', fontSize: 18, color: v <= ratings[field] ? '#FBBF24' : '#E5E7EB', padding: 0 }}>
            ★
          </motion.button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
          {icon}
        </div>
      </div>
    </div>
  );

  const overall = Math.round((ratings.lighting + ratings.pitchQuality + ratings.cleanliness) / 3);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      
      {/* Stadium Card */}
      <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
          <h3 style={{ margin: '0 0 6px', color: DARK, fontSize: 16, fontWeight: 800 }}>{selectedStadium.name}</h3>
          <p style={{ margin: 0, color: GREY, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
             {selectedStadium.location} <span style={{ fontSize: 13 }}>📍</span>
          </p>
        </div>
        <div style={{ width: 60, height: 60, borderRadius: 14, backgroundColor: '#1a2744', overflow: 'hidden' }}>
          <img src="/stadium-bg.jpg" alt={selectedStadium.name} onError={(e) => { e.target.style.display='none'; e.target.parentNode.style.background='linear-gradient(135deg, #1a2744 0%, #2d5a27 100%)'; }} style={{width:'100%', height:'100%', objectFit:'cover'}} />
        </div>
      </div>

      {/* Overall Rating */}
      <div style={{ backgroundColor: 'white', borderRadius: 20, padding: '24px 20px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <p style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 800, color: DARK }}>{isRtl ? 'ما هو تقييمك العام للملعب؟' : 'Overall Stadium Rating?'}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, direction: 'ltr', marginBottom: 12 }}>
          {[1,2,3,4,5].map(v => (
             <span key={v} style={{ fontSize: 32, color: v <= overall ? '#FBBF24' : '#E5E7EB' }}>★</span>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 12, color: GREY }}>{isRtl ? 'اضغط على النجوم بالأسفل لتحديد التقييم' : 'Tap detailed stars below to set rating'}</p>
      </div>

      {/* Detailed Ratings */}
      <div style={{ backgroundColor: 'white', borderRadius: 20, padding: '20px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
         <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: GREY, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'التقييمات التفصيلية' : 'Detailed Ratings'}</p>
         <DetailedRatingRow label={isRtl ? 'جودة الإضاءة' : 'Lighting'} field="lighting" icon="💡" color="#F59E0B" bg="#FEF3C7" />
         <DetailedRatingRow label={isRtl ? 'جودة الأرضية' : 'Pitch'} field="pitchQuality" icon="🌿" color={GREEN} bg={LIGHT_GREEN} />
         <DetailedRatingRow label={isRtl ? 'النظافة' : 'Cleanliness'} field="cleanliness" icon="🧹" color="#10B981" bg="#D1FAE5" />
      </div>

      {/* Comment */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: DARK, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'رأيك يهمنا' : 'Your opinion matters'}</p>
        <textarea
          value={ratings.comment}
          onChange={e => setRatings(r => ({ ...r, comment: e.target.value }))}
          placeholder={isRtl ? 'اكتب تعليقك هنا...' : 'Write your comment here...'}
          rows={4}
          style={{ width: '100%', padding: 16, border: 'none', borderRadius: 20, fontSize: 14, fontFamily: FONT, boxSizing: 'border-box', resize: 'none', outline: 'none', backgroundColor: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        />
        <p style={{ margin: '6px 0 0', fontSize: 11, color: GREY, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'أقصى 500 حرف' : 'Max 500 chars'}</p>
      </div>

      {/* Submit Button */}
      <motion.button whileTap={{ scale: 0.97 }}
        onClick={() => onRate(selectedStadium.id, ratings)}
        style={{ width: '100%', padding: '18px 0', border: 'none', borderRadius: 16, backgroundColor: GREEN, color: 'white', cursor: 'pointer', fontFamily: FONT, fontSize: 16, fontWeight: 800, boxShadow: '0 4px 15px rgba(34,197,94,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
        <span>{isRtl ? 'إرسال التقييم' : 'Submit Rating'}</span>
        <span style={{ fontSize: 18, transform: isRtl ? 'rotate(180deg)' : 'none' }}>➤</span>
      </motion.button>
      <div style={{ height: 60 }} />
    </motion.div>
  );
};

/* ─── Profile Screen ─── */
const ProfileScreen = ({ user, isRtl, t, onLogout, onEditProfile, onSecurity, bookingsCount }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '40px 20px 100px', direction: isRtl ? 'rtl' : 'ltr' }}>
       {/* Avatar & Info */}
       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 100, height: 100, borderRadius: 24, overflow: 'hidden', backgroundColor: '#F3F4F6', position: 'relative', marginBottom: 16 }}>
             <img src="/logo.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 10 }} onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML = '<span style="font-size: 40px; display:flex; align-items:center; justify-content:center; height: 100%;">🧑</span>'; }} />
          </div>
          <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: DARK }}>{user.fullName || (user.email ? user.email.split('@')[0] : 'User')}</h2>
          <p style={{ margin: 0, fontSize: 14, color: GREY }}>{user.email || ''}</p>
       </div>

       {/* Activity Summary */}
       <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: DARK, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'ملخص النشاط' : 'Activity Summary'}</h3>
       <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ padding: '6px 12px', backgroundColor: LIGHT_GREEN, color: GREEN, borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
             {bookingsCount > 0 ? (isRtl ? 'نشط جداً' : 'Very Active') : (isRtl ? 'جديد' : 'New User')}
          </span>
          <div style={{ textAlign: isRtl ? 'left' : 'right', display: 'flex', alignItems: 'center', gap: 16 }}>
             <div>
                <p style={{ margin: '0 0 2px', fontSize: 13, color: GREY }}>{isRtl ? 'إجمالي الحجوزات' : 'Total Bookings'}</p>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: DARK }}>{bookingsCount}</p>
             </div>
             <div style={{ width: 44, height: 44, backgroundColor: '#F3F4F6', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📅</div>
          </div>
       </div>

       {/* Account Settings */}
       <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: DARK, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'إعدادات الحساب' : 'Account Settings'}</h3>
       <div style={{ backgroundColor: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <button onClick={onEditProfile} style={{ width: '100%', padding: '18px 20px', border: 'none', borderBottom: '1px solid #F3F4F6', backgroundColor: 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: FONT }}>
             <span style={{ color: GREY, fontWeight: 700, fontSize: 18 }}>{isRtl ? '‹' : '›'}</span>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>{isRtl ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span>
                <div style={{ width: 36, height: 36, backgroundColor: '#F3F4F6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GREEN, fontSize: 16 }}>👤</div>
             </div>
          </button>
          
          <button onClick={onSecurity} style={{ width: '100%', padding: '18px 20px', border: 'none', borderBottom: '1px solid #F3F4F6', backgroundColor: 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: FONT }}>
             <span style={{ color: GREY, fontWeight: 700, fontSize: 18 }}>{isRtl ? '‹' : '›'}</span>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: DARK }}>{isRtl ? 'تغيير كلمة المرور' : 'Change Password'}</span>
                <div style={{ width: 36, height: 36, backgroundColor: '#F3F4F6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GREEN, fontSize: 16 }}>🔒</div>
             </div>
          </button>

          <button onClick={onLogout} style={{ width: '100%', padding: '18px 20px', border: 'none', backgroundColor: 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: FONT }}>
             <span style={{ color: "transparent" }}>{' '}</span>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#EF4444' }}>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
                <div style={{ width: 36, height: 36, backgroundColor: '#FEF2F2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', fontSize: 16 }}>🚪</div>
             </div>
          </button>
       </div>
    </motion.div>
  );
};

/* ─── Profile Settings Screen ─── */
const ProfileSettingsScreen = ({ user, isRtl, onBack, onSave }) => {
  const [name, setName] = useState(user.fullName || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');

  return (
    <motion.div initial={{ x: isRtl ? -40 : 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: isRtl ? 40 : -40, opacity: 0 }}
       style={{ position: 'fixed', inset: 0, backgroundColor: BG, display: 'flex', flexDirection: 'column', zIndex: 100, direction: isRtl ? 'rtl' : 'ltr' }}>
       
       <div style={{ padding: '52px 20px 20px', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: GREEN, zIndex: 2 }}>
            {isRtl ? '→' : '←'}
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: GREEN, margin: 0, position: 'absolute', width: '100%', left: 0, textAlign: 'center', zIndex: 1 }}>
            {isRtl ? 'الملف الشخصي' : 'Profile Settings'}
          </h2>
       </div>

       <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          {/* Avatar edit */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
             <div style={{ width: 110, height: 110, borderRadius: 28, backgroundColor: '#475569', position: 'relative', marginBottom: 16, border: '4px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 50 }}>🧑</span>
                <div style={{ position: 'absolute', bottom: -10, right: -10, width: 36, height: 36, backgroundColor: GREEN, borderRadius: 12, border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14 }}>✏️</div>
             </div>
             <p style={{ margin: 0, fontSize: 14, color: GREY, fontWeight: 600 }}>{isRtl ? 'تعديل الصورة الشخصية' : 'Edit Profile Picture'}</p>
          </div>

          {/* Form */}
          <div style={{ marginBottom: 20 }}>
             <label style={{ display: 'block', margin: '0 10px 8px', fontSize: 13, fontWeight: 700, color: GREEN, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'الاسم الكامل' : 'Full Name'}</label>
             <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <input value={name} onChange={e=>setName(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: FONT, background: 'transparent', textAlign: isRtl ? 'right' : 'left' }} />
                <span style={{ color: '#9CA3AF', fontSize: 18, marginLeft: isRtl ? 0 : 12, marginRight: isRtl ? 12 : 0 }}>👤</span>
             </div>
          </div>

          <div style={{ marginBottom: 20 }}>
             <label style={{ display: 'block', margin: '0 10px 8px', fontSize: 13, fontWeight: 700, color: GREEN, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</label>
             <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: FONT, background: 'transparent', textAlign: isRtl ? 'right' : 'left' }} />
                <span style={{ color: '#9CA3AF', fontSize: 18, marginLeft: isRtl ? 0 : 12, marginRight: isRtl ? 12 : 0 }}>✉️</span>
             </div>
          </div>

          <div style={{ marginBottom: 32 }}>
             <label style={{ display: 'block', margin: '0 10px 8px', fontSize: 13, fontWeight: 700, color: GREEN, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'رقم الهاتف' : 'Phone Number'}</label>
             <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <input value={phone} onChange={e=>setPhone(e.target.value)} dir="ltr" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: FONT, background: 'transparent', textAlign: isRtl ? 'right' : 'left' }} />
                <span style={{ color: '#9CA3AF', fontSize: 18, marginLeft: isRtl ? 0 : 12, marginRight: isRtl ? 12 : 0 }}>📞</span>
             </div>
          </div>

          {/* Badge */}
          <div style={{ backgroundColor: '#ECFDF5', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
             <div style={{ width: 44, height: 44, backgroundColor: '#D1FAE5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GREEN, flexShrink: 0, fontSize: 18 }}>🛡️</div>
             <div>
                <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 800, color: DARK, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'أمان البيانات' : 'Data Security'}</p>
                <p style={{ margin: 0, fontSize: 12, color: GREEN, lineHeight: 1.5, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'تُستخدم بياناتك فقط لتخصيص تجربتك في الملاعب وحجز الأنشطة الرياضية.' : 'Your data is only used to improve your booking experience.'}</p>
             </div>
          </div>
     </div>
     
     <div style={{ padding: '0 20px 80px' }}>
         <motion.button whileTap={{ scale: 0.97 }} onClick={() => onSave({ name, email, phone })}
            style={{ width: '100%', padding: '18px', backgroundColor: GREEN, color: 'white', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: FONT, boxShadow: '0 4px 15px rgba(34,197,94,0.3)', display:'flex', justifyContent:'center', alignItems:'center', gap: 10 }}>
            <span>{isRtl ? 'حفظ التغييرات' : 'Save Changes'}</span>
            <span style={{ fontSize: 18 }}>💾</span>
         </motion.button>
     </div>
    </motion.div>
  );
};

/* ─── Bottom Nav ─── */
const BottomNav = ({ tab, setTab, isRtl, t, onLogout, notifications = [] }) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const tabs = [
    { id: 'profile', icon: ProfileIcon, label: isRtl ? 'حسابي' : 'PROFILE' },
    { id: 'notifications', icon: BellIcon, label: isRtl ? 'تنبيهات' : 'ALERTS' },
    { id: 'bookings', icon: BookingsIcon, label: isRtl ? 'حجوزاتي' : 'BOOKINGS' },
    { id: 'home', icon: HomeIcon, label: isRtl ? 'الرئيسية' : 'HOME' },
  ];

  // If RTL, we might want to reverse them or not? Image 1 has PROFILE on left, HOME on right.
  // In LTR: Profile | Alerts | Bookings | Home
  // In RTL: Home | Bookings | Alerts | Profile
  const orderedTabs = isRtl ? [...tabs].reverse() : tabs;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480, backgroundColor: 'white',
      borderTop: '1px solid #F3F4F6', padding: '10px 0 20px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      boxShadow: '0 -10px 30px rgba(0,0,0,0.05)', zIndex: 100,
      borderTopLeftRadius: 30, borderTopRightRadius: 30
    }}>
      {orderedTabs.map(item => {
        const active = tab === item.id;
        return (
          <button key={item.id}
            onClick={() => setTab(item.id)}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 4, 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '8px 0', 
              flex: 1,
              transition: 'all 0.3s'
            }}>
            
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: '50%', 
              backgroundColor: active ? '#D1FAE5' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.3s'
            }}>
              <item.icon active={active} />
              {item.id === 'notifications' && unreadCount > 0 && (
                <div style={{ position: 'absolute', top: 10, right: 10, width: 10, height: 10, backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid white' }} />
              )}
            </div>

            <span style={{ 
              fontSize: 10, 
              fontWeight: active ? 800 : 600, 
              color: active ? GREEN : '#9CA3AF', 
              fontFamily: FONT,
              letterSpacing: 0.5
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

/* ─── Helpers ─── */
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '12px 14px', border: '1.5px solid #E5E7EB', borderRadius: 12, fontSize: 14, fontFamily: FONT, boxSizing: 'border-box', outline: 'none', marginBottom: 12 };

/* ─── Bookings Screen ─── */
const BookingsScreen = ({ isRtl, onBack, bookings }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '0 20px 100px', direction: isRtl ? 'rtl' : 'ltr', flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '52px 0 24px', position: 'relative' }}>
         <h2 style={{ fontSize: 18, fontWeight: 800, color: GREEN, margin: 0, flex: 1, textAlign: 'center' }}>
            {isRtl ? 'حجوزاتي' : 'My Bookings'}
         </h2>
         <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: GREEN, position: 'absolute', right: isRtl ? 0 : 'auto', left: isRtl ? 'auto' : 0 }}>
            {isRtl ? '→' : '←'}
         </button>
      </div>

      {bookings && bookings.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 80, color: GREY }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 16, fontWeight: 800, color: DARK }}>{isRtl ? 'لا توجد حجوزات بعد' : 'No bookings yet'}</p>
          <p style={{ fontSize: 13 }}>{isRtl ? 'لم تقم بأي حجز حتى الآن.' : 'You haven\'t made any bookings.'}</p>
        </div>
      ) : (
        bookings.map(b => (
          <div key={b.id} style={{ backgroundColor: 'white', borderRadius: 20, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
             {/* Card Image */}
             <div style={{ width: '100%', height: 110, position: 'relative' }}>
                <img src="/stadium-bg.jpg" alt="stadium" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; e.target.parentNode.style.backgroundColor='#1a2744'; }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)' }} />
                <div style={{ position: 'absolute', top: 12, right: isRtl ? 12 : 'auto', left: isRtl ? 'auto' : 12, padding: '4px 12px', backgroundColor: 'rgba(255,255,255,0.9)', color: GREEN, borderRadius: 20, fontSize: 11, fontWeight: 800, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                   {isRtl ? 'حجز مباشر' : 'Direct Booking'}
                </div>
             </div>

             <div style={{ padding: 16 }}>
                {/* Header Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                   <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, color: DARK }}>الملعب {b.stadiumId}</h3>
                      <p style={{ margin: 0, fontSize: 12, color: GREY, display: 'flex', alignItems: 'center', gap: 4 }}>📍 الموقع المحدد</p>
                   </div>
                   <div style={{ padding: '4px 14px', backgroundColor: LIGHT_GREEN, color: GREEN, borderRadius: 12, fontSize: 11, fontWeight: 800 }}>
                      {b.status === 'confirmed' ? (isRtl ? 'مؤكد' : 'Confirmed') : b.status}
                   </div>
                </div>
                
                <div style={{ height: 1, backgroundColor: '#F3F4F6', marginBottom: 16 }} />

                {/* Date & Price */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
                   <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 10, color: GREY }}>{isRtl ? 'التاريخ والوقت' : 'Date & Time'}</p>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: DARK, display: 'flex', alignItems: 'center', gap: 6, direction: isRtl ? 'rtl' : 'ltr' }}>📅 {b.date} | {b.slot}</p>
                   </div>
                </div>
             </div>
          </div>
        ))
      )}
    </motion.div>
  );
};

/* ─── Security Settings Screen ─── */
const SecuritySettingsScreen = ({ isRtl, onBack, onSave }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return alert(isRtl ? 'يرجى تعبئة جميع الحقول' : 'Please fill all fields');
    if (newPassword !== confirmPassword) return alert(isRtl ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
    if (newPassword.length < 8) return alert(isRtl ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be 8 chars min');
    
    onSave(currentPassword, newPassword);
  };

  return (
    <motion.div initial={{ x: isRtl ? -40 : 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: isRtl ? 40 : -40, opacity: 0 }}
       style={{ position: 'fixed', inset: 0, backgroundColor: BG, display: 'flex', flexDirection: 'column', zIndex: 100, direction: isRtl ? 'rtl' : 'ltr' }}>
       
       <div style={{ padding: '52px 20px 20px', display: 'flex', alignItems: 'center', position: 'relative' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: GREEN, zIndex: 2 }}>
            {isRtl ? '→' : '←'}
          </button>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: GREEN, margin: 0, position: 'absolute', width: '100%', left: 0, textAlign: 'center', zIndex: 1 }}>
            {isRtl ? 'تأمين حسابك' : 'Security Settings'}
          </h2>
       </div>

       <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
             <div style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 10px 25px rgba(16,185,129,0.3)' }}>
                <span style={{ fontSize: 36, color: 'white' }}>🛡️</span>
             </div>
             <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: DARK }}>{isRtl ? 'تأمين حسابك' : 'Secure Account'}</h2>
             <p style={{ margin: 0, fontSize: 13, color: GREY, textAlign: 'center', lineHeight: 1.5 }}>
               {isRtl ? 'يرجى إدخال كلمة مرور قوية لحماية بياناتك الرياضية' : 'Please enter a strong password to protect your sports data'}
             </p>
          </div>

          <div style={{ marginBottom: 20 }}>
             <label style={{ display: 'block', margin: '0 10px 8px', fontSize: 13, fontWeight: 700, color: DARK, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'كلمة المرور الحالية' : 'Current Password'}</label>
             <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <span style={{ color: GREY, fontSize: 18, marginRight: isRtl ? 0 : 12, marginLeft: isRtl ? 12 : 0 }}>👁️</span>
                <input type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} placeholder="••••••••" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, fontFamily: FONT, background: 'transparent', textAlign: isRtl ? 'right' : 'left', letterSpacing: 4 }} />
                <span style={{ color: GREEN, fontSize: 18 }}>🔒</span>
             </div>
          </div>

          <div style={{ marginBottom: 8 }}>
             <label style={{ display: 'block', margin: '0 10px 8px', fontSize: 13, fontWeight: 700, color: DARK, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'كلمة المرور الجديدة' : 'New Password'}</label>
             <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <span style={{ color: GREY, fontSize: 18, marginRight: isRtl ? 0 : 12, marginLeft: isRtl ? 12 : 0 }}>👁️</span>
                <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="••••••••" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, fontFamily: FONT, background: 'transparent', textAlign: isRtl ? 'right' : 'left', letterSpacing: 4 }} />
                <span style={{ color: GREEN, fontSize: 18, fontWeight: 800 }}>***</span>
             </div>
          </div>
          
          {/* Str Indicator */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, padding: '0 10px' }}>
             <div style={{ height: 4, flex: 1, backgroundColor: newPassword.length > 2 ? GREEN : '#E5E7EB', borderRadius: 2 }} />
             <div style={{ height: 4, flex: 1, backgroundColor: newPassword.length > 5 ? GREEN : '#E5E7EB', borderRadius: 2 }} />
             <div style={{ height: 4, flex: 1, backgroundColor: newPassword.length > 7 ? GREEN : '#E5E7EB', borderRadius: 2 }} />
             <div style={{ height: 4, flex: 1, backgroundColor: newPassword.length > 9 ? GREEN : '#E5E7EB', borderRadius: 2 }} />
          </div>
          <p style={{ margin: '0 10px 24px', fontSize: 11, color: GREY, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'استخدم 8 أحرف على الأقل مع أرقام ورموز' : 'Use at least 8 characters with numbers'}</p>

          <div style={{ marginBottom: 32 }}>
             <label style={{ display: 'block', margin: '0 10px 8px', fontSize: 13, fontWeight: 700, color: DARK, textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}</label>
             <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <span style={{ color: GREY, fontSize: 18, marginRight: isRtl ? 0 : 12, marginLeft: isRtl ? 12 : 0 }}>👁️</span>
                <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="••••••••" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, fontFamily: FONT, background: 'transparent', textAlign: isRtl ? 'right' : 'left', letterSpacing: 4 }} />
                <span style={{ color: confirmPassword && newPassword===confirmPassword ? GREEN : '#E5E7EB', fontSize: 18 }}>✔️</span>
             </div>
          </div>

          <div style={{ backgroundColor: '#FFEDD5', borderRadius: 16, padding: '20px', display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 40, border: '1px solid #FDBA74' }}>
             <div style={{ flex: 1, textAlign: isRtl ? 'right' : 'left' }}>
                <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: '#9A3412' }}>{isRtl ? 'نصيحة أمنية' : 'Security Tip'}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#9A3412', lineHeight: 1.6 }}>{isRtl ? 'لا تشارك كلمة المرور الخاصة بك مع أي شخص، حتى مع فريق دعم Emerald Pitch.' : 'Do not share your password with anyone, not even our support team.'}</p>
             </div>
             <div style={{ width: 44, height: 44, backgroundColor: '#FDBA74', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, fontSize: 20 }}>💡</div>
          </div>
       </div>
       
       <div style={{ padding: '0 20px 80px' }}>
           <motion.button whileTap={{ scale: 0.97 }} onClick={handleUpdate}
              style={{ width: '100%', padding: '18px', backgroundColor: GREEN, color: 'white', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: FONT, boxShadow: '0 4px 15px rgba(34,197,94,0.3)', display:'flex', justifyContent:'center', alignItems:'center', gap: 10 }}>
              <span>{isRtl ? 'تحديث كلمة المرور' : 'Update Password'}</span>
              <span style={{ fontSize: 18 }}>🔄</span>
           </motion.button>
       </div>
    </motion.div>
  );
};

export default PlayerDashboard;
