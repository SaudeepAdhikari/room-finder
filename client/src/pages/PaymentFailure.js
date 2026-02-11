import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 20 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: 450, width: '100%', background: '#fff', padding: 40, borderRadius: 24, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
            >
                <div style={{ width: 80, height: 80, background: '#fff1f2', color: '#e11d48', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 24px' }}>✕</div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 16 }}>Payment Failed</h1>
                <p style={{ color: '#64748b', marginBottom: 32, lineHeight: 1.6 }}>Something went wrong with your transaction. Your account has not been charged, or the payment was cancelled.</p>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ flex: 1, padding: '14px', borderRadius: 12, border: '2px solid #e2e8f0', background: 'transparent', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        style={{ flex: 1, padding: '14px', borderRadius: 12, background: '#1e293b', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                    >
                        Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentFailure;
