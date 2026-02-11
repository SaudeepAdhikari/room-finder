import React, { useState, useRef } from 'react';
import { createBooking, initiateEsewaPayment } from './api';
import ChatMessenger from './components/ChatMessenger';
import EsewaPayment from './components/EsewaPayment';

// Props: room (object) - the room being viewed
function ContactHostButton({ room }) {
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toastTimerRef = useRef(null);

  // Payment Verification State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null); // { depositAmount, paymentToken, expiresAt }
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [esewaPaymentData, setEsewaPaymentData] = useState(null);

  const reset = () => {
    setCheckIn('');
    setMessage('');
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!checkIn) {
      setError('Please select a visit date.');
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
    if (!paymentData || !paymentData.bookingId) {
      console.error('Missing booking ID for payment initiation');
      alert('Booking information is missing. Please try creating a new booking request.');
      return;
    }
    setVerifyingPayment(true);
    try {
      const response = await initiateEsewaPayment(paymentData.bookingId);
      if (response.success) {
        setEsewaPaymentData(response.data);
      } else {
        throw new Error(response.message || 'Failed to initiate eSewa payment');
      }
    } catch (err) {
      alert(err.message || 'eSewa initiation failed');
    } finally {
      setVerifyingPayment(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
        <button onClick={() => setOpen(true)} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none rounded-lg font-semibold text-lg px-8 py-4 cursor-pointer shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex-1">
          Book It
        </button>
        <button
          onClick={() => setIsChatOpen(true)}
          style={{
            background: '#fff',
            color: '#7c3aed',
            border: '2px solid #7c3aed',
            borderRadius: '0.5rem',
            fontWeight: 600,
            fontSize: '1.125rem',
            padding: '1rem 2rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            flex: 1
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#f5f3ff'; }}
          onMouseOut={e => { e.currentTarget.style.background = '#fff'; }}
        >
          Chat with Host
        </button>
      </div>

      <ChatMessenger
        room={room}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={() => { setOpen(false); reset(); }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: 640,
            maxWidth: '96%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 24,
            padding: 32,
            color: '#1e293b',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: 'modalFadeIn 0.3s ease-out'
          }}>
            <style>
              {`
                @keyframes modalFadeIn {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .modern-input:focus {
                  outline: none;
                  border-color: #3b82f6 !important;
                  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }
              `}
            </style>

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 24 }}>
              <div style={{ width: 180, height: 120, borderRadius: 16, overflow: 'hidden', background: '#f1f5f9', flex: '0 0 auto', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                {(room?.images && room.images.length > 0) ? (
                  <img src={room.images[0]} alt={room.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : room?.imageUrl ? (
                  <img src={room.imageUrl} alt={room.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>No image</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, marginBottom: 4, color: '#1e293b', fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em' }}>
                  Book: <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{room.title || 'Listing'}</span>
                </h3>
                <div style={{ color: '#64748b', fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {room.location || ''}
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#475569' }}>Visit Date</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={e => setCheckIn(e.target.value)}
                      className="modern-input"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: '2px solid #e2e8f0',
                        color: '#1e293b',
                        background: '#fff',
                        fontSize: 15,
                        transition: 'all 0.2s'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Deposit Box */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              padding: 20,
              borderRadius: 16,
              marginBottom: 24,
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Monthly Rent</div>
                <div style={{ color: '#1e293b', fontSize: 14, opacity: 0.8 }}>Standard rental rate for this room</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#1e293b' }}>
                  NPR {room.price?.toLocaleString()} / month
                </div>
                <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600 }}>Monthly Rate</div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#475569' }}>Message (optional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                className="modern-input"
                placeholder="Introductions, questions, or visit preferences..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '2px solid #e2e8f0',
                  color: '#1e293b',
                  background: '#fff',
                  fontSize: 15,
                  resize: 'none',
                  transition: 'all 0.2s'
                }}
              />
            </div>

            {error && (
              <div style={{ color: '#ef4444', marginBottom: 20, padding: '12px 16px', background: '#fef2f2', borderRadius: 12, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setOpen(false); reset(); }}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 15,
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseOut={e => e.currentTarget.style.background = '#f1f5f9'}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #d946ef)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: 12,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: 15,
                  boxShadow: '0 10px 15px -3px rgba(236, 72, 153, 0.3)',
                  transition: 'all 0.2s',
                  transform: 'translateY(0)'
                }}
                onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(236, 72, 153, 0.4)')}
                onMouseOut={e => !loading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(236, 72, 153, 0.3)')}
              >
                {loading ? 'Processing...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Verification Modal */}
      {showPaymentModal && paymentData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2005 }}>
          <div style={{ width: 400, background: '#fff', borderRadius: 16, padding: 24, paddingBottom: 32, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            {esewaPaymentData ? (
              <div style={{ animation: 'fadeIn 0.3s' }}>
                <div style={{ width: 64, height: 64, background: '#a7f3d0', borderRadius: '50%', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px' }}>✓</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#059669', marginBottom: 8 }}>Redirecting...</h3>
                <p style={{ color: '#64748b' }}>Check your popup blocker if nothing happens.</p>
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
                  {verifyingPayment ? 'Verifying...' : 'Pay via eSewa'}
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
      {/* eSewa Hidden Form Submission */}
      {esewaPaymentData && <EsewaPayment paymentData={esewaPaymentData} />}
    </>
  );
}

export default ContactHostButton;
