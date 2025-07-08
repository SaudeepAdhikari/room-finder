import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    let bg, color, icon;
    switch (type) {
        case 'success':
            bg = 'var(--success-bg, #e6f9ed)';
            color = 'var(--success, #219150)';
            icon = '✔️';
            break;
        case 'error':
            bg = 'var(--danger-bg, #ffeaea)';
            color = 'var(--danger, #d32f2f)';
            icon = '❌';
            break;
        default:
            bg = 'var(--info-bg, #eaf4ff)';
            color = 'var(--primary, #1976d2)';
            icon = 'ℹ️';
    }

    return (
        <div style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 2000,
            minWidth: 240,
            maxWidth: 360,
            background: bg,
            color,
            borderRadius: 12,
            boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontWeight: 600,
            fontSize: 16,
            transition: 'all 0.3s',
            border: `1.5px solid ${color}`,
            animation: 'toast-in 0.4s cubic-bezier(.4,0,.2,1)',
        }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <span style={{ flex: 1 }}>{message}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color, fontSize: 18, cursor: 'pointer', marginLeft: 8 }}>×</button>
            <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </div>
    );
} 