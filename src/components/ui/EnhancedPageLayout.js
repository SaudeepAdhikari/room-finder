import React from 'react';
import { motion } from 'framer-motion';

export default function EnhancedPageLayout({ icon, title, children }) {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%)', padding: '0 1rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ maxWidth: 820, margin: '0 auto', background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px #7c3aed11', padding: '3.5rem 2rem 2.5rem 2rem', marginTop: 48, marginBottom: 48 }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    {icon && <span style={{ fontSize: 44, display: 'block', marginBottom: 8 }}>{icon}</span>}
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        background: 'linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: 0,
                        letterSpacing: '-1px',
                    }}>{title}</h1>
                </div>
                <div style={{ fontSize: '1.13rem', color: '#312e81', lineHeight: 1.7 }}>{children}</div>
            </motion.div>
        </div>
    );
} 