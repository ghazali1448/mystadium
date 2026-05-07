import React from 'react';
import { motion } from 'framer-motion';

const FONT = "'Cairo', 'Tajawal', 'Almarai', sans-serif";

export default function NotificationsScreen({ notifications = [], isRtl, onBack, onNotificationClick, onMarkAsRead, onAccept, onReject, isOwner }) {
  // Sort and group notifications
  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const unreadCount = sorted.filter(n => !n.isRead).length;

  const today = new Date().toISOString().split('T')[0];
  const todayNotifs = sorted.filter(n => n.createdAt.split('T')[0] === today);
  const earlierNotifs = sorted.filter(n => n.createdAt.split('T')[0] !== today);

  const handleNotificationClick = (n) => {
    if (!n.isRead && onMarkAsRead) {
      onMarkAsRead(n.id);
    }
    if (onNotificationClick) {
      onNotificationClick(n);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'booking_new': return { icon: '📅', color: '#10B981', bg: '#ECFDF5' };
      case 'rating_new': 
      case 'rate_stadium': return { icon: '⭐', color: '#F59E0B', bg: '#FEF3C7' };
      case 'match_reminder': return { icon: '⚽', color: '#10B981', bg: '#ECFDF5' };
      case 'booking_confirmed': return { icon: '✅', color: '#10B981', bg: '#D1FAE5' };
      case 'discount': return { icon: '🤝', color: '#F97316', bg: '#FFEDD5' };
      case 'match_canceled_conflict': return { icon: '⚠️', color: '#EF4444', bg: '#FEE2E2' };
      case 'match_new_broadcast': return { icon: '📣', color: '#3B82F6', bg: '#DBEAFE' };
      default: return { icon: '🔔', color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const renderNotifCard = (n) => {
    const { icon, color, bg } = getIcon(n.type);
    const isUnread = !n.isRead;
    const timeStr = new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isConflict = n.type === 'match_canceled_conflict';

    return (
      <motion.div key={n.id} whileTap={{ scale: 0.98 }} onClick={() => handleNotificationClick(n)}
        style={{ 
          width: '100%', 
          backgroundColor: 'white', 
          border: '1px solid #F3F4F6', 
          borderRadius: 28, 
          padding: '20px 24px', 
          marginBottom: 16, 
          boxShadow: isUnread ? '0 8px 30px rgba(0,0,0,0.04)' : 'none', 
          cursor: 'pointer', 
          textAlign: isRtl ? 'right' : 'left', 
          display: 'flex', 
          flexDirection: isRtl ? 'row' : 'row-reverse',
          gap: 16, 
          fontFamily: FONT, 
          opacity: isUnread ? 1 : 0.85, 
          position: 'relative',
          overflow: 'hidden'
        }}>
        
        {/* Accent for conflicts like Image 1 */}
        {isConflict && (
          <div style={{ position: 'absolute', right: isRtl ? -10 : 'auto', left: isRtl ? 'auto' : -10, top: 0, bottom: 0, width: 25, backgroundColor: '#EF4444', borderRadius: 40 }} />
        )}

        {/* Time Label */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', whiteSpace: 'nowrap', paddingTop: 4 }}>
          {n.createdAt.split('T')[0] === today ? (isRtl ? 'الآن' : 'Now') : timeStr}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 900, color: color }}>{n.title}</h4>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#4B5563', lineHeight: 1.6, fontWeight: isUnread ? 600 : 400 }}>
            {n.message}
          </p>
          
          {n.type === 'match_canceled_conflict' && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ width: 'fit-content', minWidth: 140, padding: '10px 24px', backgroundColor: '#3E5C8E', color: 'white', border: 'none', borderRadius: 20, fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(62,92,142,0.3)' }}>
              {isRtl ? 'أنشئ مباراة جديدة' : 'Create New Match'}
            </motion.button>
          )}

          {n.type === 'match_new_broadcast' && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ width: 'fit-content', minWidth: 140, padding: '10px 24px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: 20, fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
              {isRtl ? 'انضم للمباراة' : 'Join Match'}
            </motion.button>
          )}

          {n.type === 'booking_new' && onAccept && onReject && (
            <div style={{ display: 'flex', gap: 10 }}>
               <button 
                 onClick={(e) => { e.stopPropagation(); onReject(n.relatedId); }} 
                 style={{ flex: 1, padding: '10px', backgroundColor: '#F3F4F6', color: '#6B7280', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                 {isRtl ? 'رفض' : 'Reject'}
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); onAccept(n.relatedId); }} 
                 style={{ flex: 1, padding: '10px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                 {isRtl ? 'قبول' : 'Accept'}
               </button>
            </div>
          )}
        </div>

        {/* Icon */}
        <div style={{ width: 54, height: 54, borderRadius: 16, backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 4px 12px ${bg}`, zIndex: 1 }}>
          {icon}
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: FONT, display: 'flex', flexDirection: 'column' }}>

      {/* Header Match Image 2 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '52px 20px 16px', backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 0 rgba(0,0,0,0.05)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: '#10B981' }}>
          {isRtl ? '→' : '←'}
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#111827', margin: 0 }}>
          {isRtl ? 'الإشعارات' : 'Notifications'}
        </h2>
        {isOwner ? (
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: '#10B981' }}>⚙️</button>
        ) : (
          <div style={{ width: 30 }} />
        )}
      </div>

      <div style={{ padding: '24px 20px', flex: 1, overflowY: 'auto' }}>
        {/* Today Section */}
        {todayNotifs.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#111827' }}>{isRtl ? 'اليوم' : 'Today'}</h3>
              {unreadCount > 0 && (
                <span style={{ backgroundColor: '#DCFCE7', color: '#10B981', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                  {unreadCount} {isRtl ? 'جديدة' : 'New'}
                </span>
              )}
            </div>
            {todayNotifs.map(renderNotifCard)}
          </>
        )}

        {/* Earlier Section */}
        {earlierNotifs.length > 0 && (
          <>
            <h3 style={{ margin: '24px 0 20px', fontSize: 17, fontWeight: 900, color: '#111827' }}>{isRtl ? 'أمس' : 'Earlier'}</h3>
            {earlierNotifs.map(renderNotifCard)}
          </>
        )}

        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 100, color: '#6B7280' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📬</div>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', marginBottom: 8 }}>{isRtl ? 'صندوق الوارد فارغ' : 'Inbox is empty'}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
