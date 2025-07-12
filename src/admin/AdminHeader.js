import React from 'react';
import { useAdminUser } from './AdminUserContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

function AdminHeader() {
    const { admin, logout } = useAdminUser();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
        showToast('Logged out successfully.', 'success');
    };

    // Inject shimmer keyframes into the document
    React.useEffect(() => {
        if (!document.getElementById('admin-header-shimmer')) {
            const style = document.createElement('style');
            style.id = 'admin-header-shimmer';
            style.innerHTML = shimmerKeyframes;
            document.head.appendChild(style);
        }
    }, []);

    return (
        <header style={{
            width: '100%',
            background: 'rgba(30,41,59,0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: '#fff',
            padding: '0 36px',
            height: 78,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 32px 0 rgba(37,99,235,0.13)',
            borderRadius: '0 0 28px 28px',
            marginBottom: 28,
            zIndex: 10,
            position: 'relative',
            borderBottom: '2px solid rgba(59,130,246,0.18)',
            overflow: 'visible',
        }}>
            {/* Animated gradient border/glow */}
            <div style={{
                position: 'absolute',
                left: -4, right: -4, top: -4, height: 'calc(100% + 8px)',
                zIndex: 0,
                borderRadius: '0 0 32px 32px',
                pointerEvents: 'none',
                background: 'linear-gradient(90deg, #2563eb, #38bdf8, #f59e42, #ef4444, #2563eb)',
                backgroundSize: '300% 100%',
                filter: 'blur(8px) brightness(1.2)',
                opacity: 0.22,
            }} />
            {/* Glass reflection highlight */}
            <div style={{
                position: 'absolute',
                left: 0, right: 0, top: 0, height: 18,
                borderRadius: '0 0 18px 18px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 100%)',
                pointerEvents: 'none',
                zIndex: 1,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, zIndex: 2 }}>
                <span
                    style={{
                        fontWeight: 900,
                        fontSize: 28,
                        letterSpacing: -1,
                        color: '#fff',
                        marginRight: 10,
                        cursor: 'pointer',
                        transition: 'transform 0.18s, background 0.3s',
                        display: 'inline-block',
                        background: 'linear-gradient(90deg, #2563eb, #38bdf8, #f59e42, #ef4444, #2563eb)',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = 'scale(1.08)';
                        e.currentTarget.style.backgroundPosition = '100% 0';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundPosition = '0 0';
                    }}
                >
                    SajiloStay
                </span>
                <span style={{
                    fontWeight: 700,
                    fontSize: 20,
                    color: '#dbeafe',
                    letterSpacing: 1,
                    position: 'relative',
                    display: 'inline-block',
                }}>
                    Admin Dashboard
                    <span style={{
                        display: 'block',
                        height: 4,
                        width: '100%',
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #2563eb, #38bdf8, #f59e42, #ef4444, #2563eb)',
                        backgroundSize: '300% 100%',
                        position: 'absolute',
                        left: 0,
                        bottom: -7,
                        opacity: 0.95,
                    }} />
                </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, zIndex: 2 }}>
                <img
                    src={admin?.avatar || 'https://ui-avatars.com/api/?name=Admin'}
                    alt="Admin Avatar"
                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #fff', background: '#e0e7ef', boxShadow: '0 2px 8px rgba(37,99,235,0.10)' }}
                />
                <span style={{ fontWeight: 600, fontSize: 17, color: '#fff', textShadow: '0 1px 4px rgba(30,41,59,0.10)' }}>{admin?.email}</span>
                <button
                    onClick={handleLogout}
                    style={{ background: 'linear-gradient(90deg, #ef4444 0%, #f59e42 100%)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', letterSpacing: 1, marginLeft: 8, transition: 'background 0.18s' }}
                >
                    Logout
                </button>
            </div>
        </header>
    );
}

export default AdminHeader; 