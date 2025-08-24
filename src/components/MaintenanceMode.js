import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useAdminSettings } from '../context/AdminSettingsContext';

function MaintenanceMode() {
    const { settings } = useAdminSettings();

    if (!settings?.maintenanceMode) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    color: '#fff',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
            >
                <div style={{
                    textAlign: 'center',
                    maxWidth: 500,
                    padding: '40px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 20,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ fontSize: 64, marginBottom: 20 }}>🔧</div>
                    <h1 style={{
                        fontSize: 32,
                        fontWeight: 700,
                        marginBottom: 16,
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        Under Maintenance
                    </h1>
                    <p style={{
                        fontSize: 18,
                        lineHeight: 1.6,
                        marginBottom: 30,
                        opacity: 0.9
                    }}>
                        {settings.maintenanceMessage || 'We\'re currently performing some maintenance on our site. Please check back soon!'}
                    </p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        fontSize: 14,
                        opacity: 0.7
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></div>
                        <span>We'll be back shortly</span>
                    </div>
                </div>
            </motion.div>
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </AnimatePresence>
    );
}

export default MaintenanceMode; 