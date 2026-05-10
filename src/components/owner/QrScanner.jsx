import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import DataService from '../../services/DataService';
import { motion, AnimatePresence } from 'framer-motion';

const QrScanner = ({ onScanSuccess }) => {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [0] // Camera only
    });

    scanner.render(onScan, onScanError);

    function onScan(decodedText) {
      // Decode the QR - if it's a token, we process it
      handleScan(decodedText);
      scanner.clear();
    }

    function onScanError(err) {
      // Quietly ignore errors unless critical
    }

    return () => {
      scanner.clear().catch(e => console.error("Scanner clear error", e));
    };
  }, []);

  const handleScan = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const result = await DataService.scanBooking(token);
      setScanResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!scanResult?.booking?.id) return;
    setConfirming(true);
    try {
      const result = await DataService.confirmPayment(scanResult.booking.id);
      setScanResult({ ...scanResult, booking: result.booking, message: 'Payment Confirmed!' });
      if (onScanSuccess) onScanSuccess(result.booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirming(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    window.location.reload(); // Simplest way to re-init scanner
  };

  return (
    <div style={{ padding: 20, textAlign: 'center', fontFamily: "'Cairo', sans-serif" }}>
      {!scanResult && !error && (
        <div style={{ backgroundColor: 'white', borderRadius: 24, padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1A2E', marginBottom: 10 }}>مسح رمز الحجز</h2>
          <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 20 }}>قم بتوجيه الكاميرا نحو رمز QR الخاص باللاعب</p>
          <div id="qr-reader" style={{ width: '100%', borderRadius: 16, overflow: 'hidden' }}></div>
        </div>
      )}

      {loading && <div style={{ marginTop: 20 }}>جاري التحقق...</div>}

      <AnimatePresence>
        {(scanResult || error) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ backgroundColor: 'white', borderRadius: 24, padding: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', marginTop: 20 }}
          >
            {error ? (
              <div>
                <div style={{ fontSize: 60, marginBottom: 20 }}>⚠️</div>
                <h3 style={{ color: '#EF4444', fontWeight: 800 }}>خطأ في التحقق</h3>
                <p style={{ color: '#6B7280' }}>{error}</p>
                <button onClick={resetScanner} style={{ marginTop: 20, padding: '12px 30px', backgroundColor: '#1A1A2E', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700 }}>إعادة المحاولة</button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 60, marginBottom: 10 }}>{scanResult.alreadyValidated ? '✅' : '🎫'}</div>
                <h3 style={{ fontWeight: 800, color: '#1A1A2E' }}>{scanResult.message}</h3>
                
                <div style={{ textAlign: 'right', marginTop: 20, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 16 }}>
                  <p style={{ margin: '5px 0', fontSize: 14 }}><strong>اللاعب:</strong> {scanResult.booking.user.fullName}</p>
                  <p style={{ margin: '5px 0', fontSize: 14 }}><strong>الملعب:</strong> {scanResult.booking.stadium.name}</p>
                  <p style={{ margin: '5px 0', fontSize: 14 }}><strong>الوقت:</strong> {scanResult.booking.slot}</p>
                  <p style={{ margin: '5px 0', fontSize: 14 }}><strong>المبلغ:</strong> {scanResult.booking.stadium.pricePerHour} د.ج</p>
                  <p style={{ margin: '5px 0', fontSize: 14 }}><strong>الحالة:</strong> 
                    <span style={{ 
                      color: scanResult.booking.status === 'paid' ? '#10B981' : '#F59E0B',
                      fontWeight: 700,
                      marginRight: 5
                    }}>{scanResult.booking.status.toUpperCase()}</span>
                  </p>
                </div>

                {scanResult.booking.status !== 'paid' && (
                  <button 
                    onClick={handleConfirmPayment}
                    disabled={confirming}
                    style={{ 
                      marginTop: 24, 
                      width: '100%', 
                      padding: '16px', 
                      backgroundColor: '#22C55E', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: 14, 
                      fontWeight: 800,
                      fontSize: 16,
                      boxShadow: '0 4px 15px rgba(34,197,94,0.3)'
                    }}
                  >
                    {confirming ? 'جاري التأكيد...' : 'تأكيد الدفع نقداً'}
                  </button>
                )}

                <button onClick={resetScanner} style={{ marginTop: 12, width: '100%', padding: '14px', backgroundColor: 'transparent', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: 14, fontWeight: 600 }}>إغلاق</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QrScanner;
