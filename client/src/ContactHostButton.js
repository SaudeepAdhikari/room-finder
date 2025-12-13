import React, { useState, useEffect, useRef } from 'react';
import { createBooking, verifyPayment } from './api';

// Props: room (object) - the room being viewed
function ContactHostButton({ room }) {
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef(null);

  // Payment Verification State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null); // { depositAmount, paymentToken, expiresAt }
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const reset = () => {
    setCheckIn('');
    setMessage('');
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!checkIn) {
      setError('Please select a check-in date.');
      return;
    }

    setLoading(true);
    try {
      const response = await createBooking({ roomId: room._id || room.id, checkIn, message });

      // Check for payment instruction (SDPVA)
      if (response && response.paymentInstruction) {
        setPaymentData(response.paymentInstruction);
        setShowPaymentModal(true);
        setOpen(false); // Close booking form
      } else {
        // Standard booking (or confirmed immediately)
        setShowToast(true);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setShowToast(false), 5000);
        setOpen(false);
        reset();
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!paymentData) return;
    setVerifyingPayment(true);
    try {
      await verifyPayment(paymentData.paymentToken, paymentData.depositAmount);
      setPaymentSuccess(true);
      // Show success toast after small delay
      setTimeout(() => {
        setShowPaymentModal(false);
        setShowToast(true);
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setShowToast(false), 5000);
        reset();
        setPaymentSuccess(false);
        setPaymentData(null);
      }, 1500);
    } catch (err) {
      alert(err.message || 'Payment verification failed');
    } finally {
      setVerifyingPayment(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none rounded-lg font-semibold text-lg px-8 py-4 cursor-pointer shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
        Book It
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={() => { setOpen(false); reset(); }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 640, maxWidth: '96%', background: '#fff', borderRadius: 12, padding: 16, color: '#0f172a', boxShadow: '0 10px 30px rgba(2,6,23,0.4)', fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 160, height: 110, borderRadius: 8, overflow: 'hidden', background: '#f8fafc', flex: '0 0 auto' }}>
                {(room?.images && room.images.length > 0) ? (
                  <img src={room.images[0]} alt={room.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : room?.imageUrl ? (
                  <img src={room.imageUrl} alt={room.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 13 }}>No image</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, marginBottom: 8, color: '#0b61d6', fontSize: 20, lineHeight: '1.1' }}>Book: {room.title || 'Listing'}</h3>
                <div style={{ color: '#475569', fontSize: 13, marginBottom: 8 }}>{room.location || ''}</div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#0f172a' }}>Check-in</label>
                    <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e6e9ee', color: '#0f172a', background: '#fff', fontSize: 14 }} />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#0f172a' }}>Message (optional)</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', color: '#0f172a', background: '#fff' }} />
            </div>
            {error && <div style={{ color: '#b91c1c', marginBottom: 10 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => { setOpen(false); reset(); }} style={{ background: '#60a5fa', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
              <button onClick={handleSubmit} disabled={loading} style={{ background: '#ec4899', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>{loading ? 'Booking...' : 'Send Booking'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Verification Modal */}
      {showPaymentModal && paymentData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2005 }}>
          <div style={{ width: 400, background: '#fff', borderRadius: 16, padding: 24, paddingBottom: 32, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            {paymentSuccess ? (
              <div style={{ animation: 'fadeIn 0.3s' }}>
                <div style={{ width: 64, height: 64, background: '#a7f3d0', borderRadius: '50%', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px' }}>✓</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#059669', marginBottom: 8 }}>Payment Verified!</h3>
                <p style={{ color: '#64748b' }}>Your booking is confirmed.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>Secure Deposit Required</h3>
                <p style={{ color: '#64748b', marginBottom: 24, fontSize: 15 }}>
                  To hold this room, a 20% security deposit is required. This ensures serious inquiries only.
                </p>

                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 24, border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: 13, marginBottom: 4 }}>Deposit Amount</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                    Rs {paymentData.depositAmount?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>
                    Expires in 10 minutes
                  </div>
                </div>

                <button
                  onClick={handleVerifyPayment}
                  disabled={verifyingPayment}
                  style={{
                    width: '100%',
                    background: verifyingPayment ? '#94a3b8' : '#7c3aed',
                    color: '#fff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: verifyingPayment ? 'not-allowed' : 'pointer',
                    marginBottom: 12,
                    transition: 'all 0.2s'
                  }}
                >
                  {verifyingPayment ? 'Verifying...' : 'Pay Securely Now'}
                </button>

                <button
                  onClick={() => setShowPaymentModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: 14,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Cancel Booking
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Custom toast notification (non-browser) */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            right: 20,
            bottom: 24,
            width: 360,
            maxWidth: 'calc(100% - 40px)',
            background: 'linear-gradient(90deg,#7c3aed,#06b6d4)',
            color: '#fff',
            padding: '14px 16px',
            borderRadius: 12,
            boxShadow: '0 12px 30px rgba(2,6,23,0.35)',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            zIndex: 3000,
            fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
          }}
        >
          <div style={{ flex: '0 0 auto', marginTop: 2 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2z" fill="#ffffff22" />
              <path d="M11 16h2v-2h-2v2zm0-8h2v6h-2V8z" fill="#fff" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Booking request sent</div>
            <div style={{ fontSize: 13, lineHeight: 1.25, opacity: 0.95 }}>You will be notified when the booking is confirmed.</div>
          </div>
          <button
            onClick={() => {
              setShowToast(false);
              if (toastTimerRef.current) { clearTimeout(toastTimerRef.current); toastTimerRef.current = null; }
            }}
            aria-label="Dismiss notification"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.9)',
              fontSize: 18,
              cursor: 'pointer',
              padding: 6,
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default ContactHostButton;
