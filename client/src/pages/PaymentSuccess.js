import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        const verifyPayment = async () => {
            const data = searchParams.get('data');
            if (data) {
                const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                console.log('[PaymentSuccess] Verifying with:', `${apiBase}/api/esewa/verify`);
                try {
                    const response = await axios.post(`${apiBase}/api/esewa/verify`, { data });
                    if (response.data.success) {
                        // Redirect to transaction details page if transactionId is available
                        if (response.data.transactionId) {
                            setRedirecting(true);
                            setLoading(false);
                            // Immediate redirect without delay
                            setTimeout(() => {
                                navigate(`/transaction/${response.data.transactionId}`, { replace: true });
                            }, 800); // Shorter delay, just enough to show redirecting message
                        } else {
                            setLoading(false);
                        }
                    } else {
                        setError(response.data.message);
                        setLoading(false);
                    }
                } catch (err) {
                    console.error('Verification catch error:', err);
                    if (err.response) {
                        console.error('Response data:', err.response.data);
                        console.error('Response status:', err.response.status);
                        setError(`Verification failed: ${err.response.data.message || err.message}`);
                    } else {
                        setError(`Verification failed. ${err.message || 'Server connection error.'}`);
                    }
                    setLoading(false);
                }
            } else {
                setError('No payment data found.');
                setLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);


    if (loading || redirecting) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ width: 50, height: 50, border: '4px solid #e2e8f0', borderTopColor: '#7c3aed', borderRadius: '50%' }}
                />
                <p style={{ marginTop: 24, fontSize: 18, color: '#64748b' }}>
                    {redirecting ? 'Redirecting to transaction details...' : 'Verifying your payment with eSewa...'}
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 20 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ maxWidth: 450, width: '100%', background: '#fff', padding: 40, borderRadius: 24, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                >
                    <div style={{ width: 80, height: 80, background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 24px' }}>✕</div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>Verification Error</h1>
                    <p style={{ color: '#64748b', marginBottom: 32, lineHeight: 1.6 }}>{error}</p>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => navigate(-1)} style={{ flex: 1, padding: '14px', borderRadius: 12, border: '2px solid #e2e8f0', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}>Go Back</button>
                        <button onClick={() => navigate('/')} style={{ flex: 1, padding: '14px', borderRadius: 12, background: '#7c3aed', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Home</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 20 }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ maxWidth: 450, width: '100%', background: '#fff', padding: 40, borderRadius: 24, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
            >
                <div style={{ width: 80, height: 80, background: '#f0fdf4', color: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 24px' }}>✓</div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>Payment Successful!</h1>
                <p style={{ color: '#64748b', marginBottom: 32, lineHeight: 1.6 }}>Your room booking has been confirmed. You can now view it in your dashboard.</p>
                <button
                    onClick={() => navigate('/profile')}
                    style={{ width: '100%', padding: '16px', borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 10px 20px rgba(124, 58, 237, 0.2)' }}
                >
                    View My Bookings
                </button>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
