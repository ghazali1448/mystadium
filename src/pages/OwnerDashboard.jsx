import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import DataService from '../services/DataService';
import NotificationsScreen from '../components/NotificationsScreen';

/* ─── Constants & Styles ─── */
const GREEN = '#10B981';
const LIGHT_GREEN = '#ECFDF5';
const DARK = '#111827';
const GREY = '#6B7280';
const BG = '#F9FAFB';
const FONT = "'Cairo', 'Tajawal', 'Almarai', sans-serif";

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
    // In a real app we'd use WebSockets. For MVP, poll every 10s.
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  return { notifications, setNotifications };
};

/* ─── Shared UI ─── */
const ProgressBar = ({ label, value, max, color = GREEN }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 800, color: GREEN }}>{value}/{max}</span>
    </div>
    <div style={{ width: '100%', height: 6, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${(value/max)*100}%` }} style={{ height: '100%', backgroundColor: color, borderRadius: 4 }} />
    </div>
  </div>
);

/* ─── Screens ─── */
const DashboardHome = ({ user, isRtl, t, stadium, stats, bookings, onAcceptBooking, onRejectBooking }) => {
  const pendingRequests = bookings ? bookings.filter(b => b.status === 'pending') : [];
  
  // Example simplistic calculations
  const todayBookings = bookings ? bookings.filter(b => b.status === 'confirmed').length : 0;
  const revenue = bookings ? bookings.filter(b => b.status === 'confirmed').length * (stadium?.pricePerHour || 150) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '20px', paddingBottom: 100 }}>
      {/* Welcome Title */}
      <div style={{ marginBottom: 24, textAlign: isRtl ? 'right' : 'left' }}>
        <p style={{ margin: '0 0 4px', fontSize: 13, color: GREY }}>{isRtl ? 'أهلاً بك مجدداً' : 'Welcome back'}</p>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: DARK }}>
          {isRtl ? `كابتن ${user?.fullName?.split(' ')[0] || 'أحمد'}، يوم سعيد!` : `Captain ${user?.fullName?.split(' ')[0] || 'Ahmed'}, great day!`}
        </h1>
      </div>

      {/* Revenue Card */}
      <div style={{ backgroundColor: GREEN, borderRadius: 20, padding: 24, marginBottom: 16, boxShadow: '0 8px 25px rgba(16,185,129,0.3)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, opacity: 0.9 }}>{isRtl ? 'إجمالي الإيرادات هذا الشهر' : 'Total Revenue This Month'}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, direction: isRtl ? 'rtl' : 'ltr' }}>
            <span style={{ fontSize: 28, fontWeight: 800 }}>{revenue}</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{isRtl ? 'د.ج' : 'DZD'}</span>
          </div>
        </div>
        <div style={{ width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💰</div>
      </div>

      {/* Mini Cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, backgroundColor: LIGHT_GREEN, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 12 }}>📅</div>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: GREY }}>{isRtl ? ' إجمالي الحجوزات المؤكدة ' : 'Total Confirmed Bookings'}</p>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: DARK }}>{isRtl ? `${todayBookings} حجوزات` : `${todayBookings} Bookings`}</p>
        </div>
        <div style={{ flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, backgroundColor: '#FFFBEB', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 12 }}>⭐</div>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: GREY }}>{isRtl ? 'تقييم الملاعب' : 'Stadium Rating'}</p>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: DARK }}>{stats?.count > 0 ? ((stats.lighting + stats.pitch + stats.cleanliness) / 3).toFixed(1) : '0.0'} / 5.0</p>
        </div>
      </div>

      {/* Stadium Performance */}
      <h2 style={{ fontSize: 16, fontWeight: 800, color: DARK, margin: '0 0 16px', textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'أداء الملاعب' : 'Stadium Performance'}</h2>
      <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ width: '100%', height: 120, borderRadius: 14, overflow: 'hidden', position: 'relative', marginBottom: 16 }}>
          <img src="/stadium-bg.jpg" alt="Stadium" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; e.target.parentNode.style.backgroundColor='#1a2744'; }} />
          <div style={{ position: 'absolute', bottom: 12, right: isRtl ? 12 : 'auto', left: isRtl ? 'auto' : 12, color: 'white', textAlign: isRtl ? 'right' : 'left' }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{stadium?.name || (isRtl ? 'الاستاد الدولي' : 'International Stadium')}</h3>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{stadium?.location || 'حي الشقيق، الرياض'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
             <p style={{ margin: '0 0 2px', fontSize: 11, color: GREY }}>{isRtl ? 'نسبة الإشغال' : 'Occupancy Rate'}</p>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 100, height: 6, backgroundColor: LIGHT_GREEN, borderRadius: 4, overflow: 'hidden' }}>
                   <div style={{ width: '85%', height: '100%', backgroundColor: GREEN }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: GREEN }}>85%</span>
             </div>
          </div>
          <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
             <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 800, color: '#F59E0B' }}>★ {stats?.count > 0 ? ((stats.lighting + stats.pitch + stats.cleanliness) / 3).toFixed(1) : '0.0'}</p>
             <p style={{ margin: 0, fontSize: 10, color: GREY }}>{isRtl ? `${stats?.count || 0} تقييم` : `${stats?.count || 0} ratings`}</p>
          </div>
        </div>
      </div>

      {/* Detailed Status */}
      <h2 style={{ fontSize: 16, fontWeight: 800, color: DARK, margin: '0 0 16px', textAlign: isRtl ? 'right' : 'left' }}>{isRtl ? 'حالة الملعب (تقييم المستخدمين)' : 'Stadium Status (User Ratings)'}</h2>
      <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <ProgressBar label={isRtl ? 'الإضاءة 💡' : 'Lighting 💡'} value={stats?.lighting || 0} max={5} />
        <ProgressBar label={isRtl ? 'النظافة 🧹' : 'Cleanliness 🧹'} value={stats?.cleanliness || 0} max={5} />
        <ProgressBar label={isRtl ? 'جودة الأرضية 🌿' : 'Pitch Quality 🌿'} value={stats?.pitch || 0} max={5} />
      </div>

      {/* Pending Requests */}
      <h2 style={{ fontSize: 16, fontWeight: 800, color: DARK, margin: '0 0 16px', textAlign: isRtl ? 'right' : 'left' }}>
        {isRtl ? 'طلبات انتظار الموافقة' : 'Pending Requests'}
        <span style={{ backgroundColor: '#FEE2E2', color: '#EF4444', fontSize: 10, padding: '2px 8px', borderRadius: 10, marginRight: isRtl ? 8 : 0, marginLeft: isRtl ? 0 : 8 }}>{pendingRequests.length} {isRtl ? 'طلبات' : 'Reqs'}</span>
      </h2>
      
      {pendingRequests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
           <div style={{ fontSize: 50, marginBottom: 12 }}>📭</div>
           <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: GREY }}>{isRtl ? 'لا توجد طلبات معلقة حالياً' : 'No pending requests currently'}</p>
        </div>
      ) : (
        pendingRequests.map(req => (
          <div key={req.id} style={{ backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <div style={{ width: 40, height: 40, backgroundColor: '#F3F4F6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🧑</div>
                   <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 800, color: DARK }}>{req.user?.fullName || 'تطبيق MyStadium'}</p>
                      <p style={{ margin: 0, fontSize: 11, color: GREY }}>{req.slot}</p>
                   </div>
                </div>
                <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
                   <p style={{ margin: '0 0 2px', fontSize: 12, fontWeight: 700, color: GREEN }}>{req.date.split('T')[0]}</p>
                   <p style={{ margin: 0, fontSize: 10, color: GREY, direction: 'ltr' }}>{req.time || ''}</p>
                </div>
             </div>
             <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => onRejectBooking(req.id)} style={{ flex: 1, padding: 12, backgroundColor: '#F3F4F6', color: GREY, border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>{isRtl ? 'رفض' : 'Reject'}</button>
                <button onClick={() => onAcceptBooking(req.id)} style={{ flex: 1, padding: 12, backgroundColor: GREEN, color: 'white', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>{isRtl ? 'قبول' : 'Accept'}</button>
             </div>
          </div>
        ))
      )}
    </motion.div>
  );
};

const RatingsReviewsScreen = ({ isRtl, stats }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '0 20px 100px' }}>
      {/* Header handled outside */}
      
      {/* Overall Score */}
      <div style={{ backgroundColor: 'white', borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 48, fontWeight: 800, color: GREEN, margin: '0 0 8px' }}>{stats?.count > 0 ? ((stats.lighting + stats.pitch + stats.cleanliness) / 3).toFixed(1) : '0.0'}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 8, color: '#F59E0B', fontSize: 20 }}>★★★★★</div>
        <p style={{ margin: 0, fontSize: 11, color: GREY }}>{isRtl ? `بناءً على ${stats?.count || 0} تقييم` : `Based on ${stats?.count || 0} reviews`}</p>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #F3F4F6', textAlign: isRtl ? 'right' : 'left' }}>
           <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: GREEN }}>{isRtl ? 'تفاصيل معايير الجودة' : 'Quality Details'}</p>
           <ProgressBar label={isRtl ? 'جودة الأرضية' : 'Pitch Quality'} value={stats?.pitch || 0} max={5} />
           <ProgressBar label={isRtl ? 'الإضاءة' : 'Lighting'} value={stats?.lighting || 0} max={5} />
           <ProgressBar label={isRtl ? 'النظافة' : 'Cleanliness'} value={stats?.cleanliness || 0} max={5} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
         <h2 style={{ fontSize: 15, fontWeight: 800, color: DARK, margin: 0 }}>{isRtl ? 'أحدث المراجعات' : 'Latest Reviews'}</h2>
         <span style={{ fontSize: 18, color: GREEN }}>≡</span>
      </div>

      {stats?.count === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
           <div style={{ fontSize: 50, marginBottom: 12 }}>⭐</div>
           <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: GREY }}>{isRtl ? 'لا توجد تقييمات لملعبك بعد' : 'No ratings for your stadium yet'}</p>
        </div>
      ) : (
        <>
          {/* Review Item */}
          {[
            { name: 'أحمد محمد', date: 'منذ يومين', stars: 5, text: 'تجربة رائعة جداً، الملعب نظيف جداً والأرضية ممتازة للعب. الإضاءة كانت قوية وواضحة في المساء. بالتأكيد سأكرر التجربة.', s_light: 5.0, s_pitch: 5.0, s_clean: 4.0 },
            { name: 'سارة خالد', date: 'منذ أسبوع', stars: 4, text: 'الملعب جميل جداً والموقع ممتاز. ملاحظتي الوحيدة هي أن دورات المياه تحتاج لاهتمام أكثر قليلاً بالنظافة. غير ذلك كل شيء رائع.', s_light: 4.0, s_pitch: 4.5, s_clean: 3.0 },
          ].map((rev, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                     <div style={{ width: 42, height: 42, backgroundColor: '#1e293b', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
                     <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 800, color: DARK }}>{rev.name}</p>
                        <p style={{ margin: 0, fontSize: 10, color: GREY }}>{rev.date}</p>
                     </div>
                  </div>
                  <div style={{ color: '#F59E0B', fontSize: 14, letterSpacing: 2 }}>{Array(rev.stars).fill('★').join('')}</div>
               </div>
               <p style={{ margin: '0 0 16px', fontSize: 13, color: GREY, lineHeight: 1.6, textAlign: isRtl ? 'right' : 'left' }}>{rev.text}</p>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[{l: isRtl ? 'الإضاءة' : 'Lighting', v: rev.s_light}, {l: isRtl ? 'الأرضية' : 'Pitch', v: rev.s_pitch}, {l: isRtl ? 'النظافة' : 'Cleanliness', v: rev.s_clean}].map((s, idx) => (
                    <div key={idx} style={{ padding: '8px 12px', backgroundColor: '#F9FAFB', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: 11, color: GREY, fontWeight: 700 }}>{s.l}</span>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '60%' }}>
                          <div style={{ flex: 1, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
                             <div style={{ width: `${(s.v/5)*100}%`, height: '100%', backgroundColor: GREEN, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 800, color: DARK }}>{s.v.toFixed(1)}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </>
      )}
    </motion.div>
  );
};

/* ─── Main OwnerDashboard Component ─── */
const OwnerDashboard = ({ user, onLogout }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [tab, setTab] = useState('dashboard'); // dashboard | ratings | notifications | profile
  const [stadium, setStadium] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ lighting: 0, pitch: 0, cleanliness: 0, count: 0 });
  const { notifications, setNotifications } = useNotifications(user.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myStadium = await DataService.getStadiumByOwner(user.id);
        if (myStadium) {
           setStadium(myStadium);
           const [stadiumBookings, stadiumStats] = await Promise.all([
             DataService.getStadiumBookings(myStadium.id),
             DataService.getStadiumStats(myStadium.id)
           ]);
           setBookings(stadiumBookings);
           setStats(stadiumStats);
        }
      } catch (err) {}
    };
    fetchData();
  }, [user.id]);

  const handleAccept = async (bookingId) => {
    try {
      await DataService.updateBookingStatus(bookingId, 'confirmed');
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b));
    } catch (err) {}
  };

  const handleReject = async (bookingId) => {
    try {
      await DataService.updateBookingStatus(bookingId, 'rejected');
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'rejected' } : b));
    } catch (err) {}
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', backgroundColor: BG, fontFamily: FONT, display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
      
      {/* Header MATCH IMAGE 1 Style */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '52px 24px 16px', backgroundColor: 'white', borderBottom: '1px solid #F3F4F6' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, overflow: 'hidden', border: '2px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyItems: 'center', backgroundColor: 'white', cursor: 'pointer' }}
                 onClick={() => setTab('profile')}>
               <img src="/logo.png" alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML = '🧑' }} />
            </div>
            <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
               <h2 style={{ fontSize: 16, fontWeight: 800, color: GREEN, margin: 0 }}>{stadium?.name || 'MyStadium'}</h2>
            </div>
         </div>
         
         <h2 style={{ fontSize: 18, fontWeight: 900, color: GREEN, margin: 0, fontFamily: FONT }}>
            KINETIC ARENA
         </h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
           {tab === 'notifications' && (
            <NotificationsScreen 
              key="notifs" 
              notifications={notifications} 
              isRtl={isRtl} 
              isOwner={true}
              onBack={() => setTab('dashboard')}
              onMarkAsRead={async (id) => {
                const prev = [...notifications];
                setNotifications(prev.map(n => n.id === id ? { ...n, isRead: true } : n));
                try { await DataService.markNotificationRead(id); } catch(e) { setNotifications(prev); }
              }}
              onNotificationClick={(n) => {
                if(n.type === 'booking_new') setTab('dashboard');
                else if(n.type === 'rating_new') setTab('ratings');
              }}
              onAccept={(id) => { handleAccept(id); setTab('dashboard'); }}
              onReject={(id) => { handleReject(id); setTab('dashboard'); }}
            />
          )}
          {tab === 'dashboard' && <DashboardHome key="dash" user={user} isRtl={isRtl} t={t} stadium={stadium} stats={stats} bookings={bookings} onAcceptBooking={handleAccept} onRejectBooking={handleReject} />}
          {tab === 'ratings' && <RatingsReviewsScreen key="rate" isRtl={isRtl} stats={stats} />}
          {tab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 40, textAlign: 'center' }}>
               <div style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: LIGHT_GREEN, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🧑</div>
               <h2 style={{ color: DARK, fontWeight: 800 }}>{user.fullName}</h2>
               <p style={{ color: GREY }}>{user.email}</p>
               <button onClick={onLogout} style={{ marginTop: 40, width: '100%', padding: 16, backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: 16, fontWeight: 800, cursor: 'pointer' }}>{isRtl ? 'تسجيل الخروج' : 'Logout'}</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav REDESIGN */}
      {tab !== 'notifications' && (
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480, backgroundColor: 'white',
          borderTop: '1px solid #F3F4F6', padding: '10px 0 20px',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.05)', zIndex: 100,
          borderTopLeftRadius: 30, borderTopRightRadius: 30
        }}>
          {[
            { id: 'profile', icon: '👤', label: isRtl ? 'حسابي' : 'PROFILE' },
            { id: 'notifications', icon: '🔔', label: isRtl ? 'تنبيهات' : 'ALERTS' },
            { id: 'ratings', icon: '⭐', label: isRtl ? 'تقييمات' : 'REVIEWS' },
            { id: 'dashboard', icon: '📊', label: isRtl ? 'الرئيسية' : 'DASHBOARD' },
          ].map(item => {
            const active = tab === item.id;
            return (
              <button key={item.id}
                onClick={() => setTab(item.id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', flex: 1 }}>
                
                <div style={{ 
                  width: 48, height: 48, borderRadius: '50%', 
                  backgroundColor: active ? LIGHT_GREEN : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, position: 'relative'
                }}>
                  {item.icon}
                  {item.id === 'notifications' && unreadCount > 0 && (
                    <div style={{ position: 'absolute', top: 10, right: 10, width: 10, height: 10, backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid white' }} />
                  )}
                </div>

                <span style={{ fontSize: 10, fontWeight: active ? 800 : 600, color: active ? GREEN : '#9CA3AF', fontFamily: FONT }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
