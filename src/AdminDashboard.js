import React, { useState, useEffect } from 'react';
import { useUser } from './context/UserContext';
import { useToast } from './context/ToastContext';
import { fetchAllUsers } from './api';

const SIDEBAR_TABS = [
    { key: 'users', label: 'Users', icon: '👤' },
    { key: 'rooms', label: 'Rooms', icon: '🏠' },
    { key: 'analytics', label: 'Analytics', icon: '📊' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
];

function AdminDashboard({ onNavigate }) {
    const { user, loading, logout } = useUser();
    const { showToast } = useToast();
    const [tab, setTab] = useState('users');

    // Users state
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState('');

    useEffect(() => {
        if (tab === 'users') {
            setUsersLoading(true);
            setUsersError('');
            fetchAllUsers()
                .then(setUsers)
                .catch(err => setUsersError(err.message || 'Failed to fetch users'))
                .finally(() => setUsersLoading(false));
        }
    }, [tab]);

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
    if (!user || !user.isAdmin) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--danger)', fontWeight: 600 }}>Access denied. Admins only.</div>;
    }

    const handleLogout = async () => {
        await logout();
        if (onNavigate) onNavigate('home');
        showToast('Logged out successfully.', 'success');
    };

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            background: 'linear-gradient(90deg, #1e293b 0%, #2563eb 100%)',
            borderRadius: 18,
            boxShadow: '0 8px 32px 0 rgba(37,99,235,0.10)',
            margin: '40px auto',
            maxWidth: 1300,
        }}>
            {/* Sidebar */}
            <aside style={{
                width: 260,
                background: 'rgba(30,41,59,0.98)',
                borderRadius: '18px 0 0 18px',
                padding: '32px 0 24px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '2px 0 16px 0 rgba(30,41,59,0.08)',
            }}>
                {/* Admin Avatar and Info */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                    <img
                        src={user.avatar || 'https://ui-avatars.com/api/?name=Admin'}
                        alt="Admin Avatar"
                        style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563eb', marginBottom: 12 }}
                    />
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 2 }}>{user.email}</div>
                    <span style={{ background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 13, borderRadius: 8, padding: '2px 10px', letterSpacing: 1 }}>ADMIN</span>
                </div>
                {/* Sidebar Navigation */}
                <nav style={{ width: '100%' }}>
                    {SIDEBAR_TABS.map(({ key, label, icon }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            style={{
                                width: '100%',
                                background: tab === key ? 'rgba(37,99,235,0.15)' : 'none',
                                color: tab === key ? '#3b82f6' : '#fff',
                                border: 'none',
                                outline: 'none',
                                fontWeight: tab === key ? 700 : 500,
                                fontSize: 17,
                                padding: '14px 0 14px 32px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                borderLeft: tab === key ? '4px solid #3b82f6' : '4px solid transparent',
                                transition: 'all 0.18s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 14,
                            }}
                        >
                            <span style={{ fontSize: 20 }}>{icon}</span> {label}
                        </button>
                    ))}
                </nav>
                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    style={{
                        marginTop: 'auto',
                        width: '80%',
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '12px 0',
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        letterSpacing: 1,
                        marginBottom: 12,
                        transition: 'background 0.18s',
                    }}
                >
                    Logout
                </button>
            </aside>
            {/* Main Content */}
            <main style={{
                flex: 1,
                background: 'rgba(255,255,255,0.98)',
                borderRadius: '0 18px 18px 0',
                padding: '40px 48px',
                minHeight: 600,
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24, color: '#2563eb', letterSpacing: -1 }}>Admin Dashboard</h1>
                {tab === 'users' && (
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Users Management</h2>
                        {usersLoading ? (
                            <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>Loading users...</div>
                        ) : usersError ? (
                            <div style={{ padding: 24, textAlign: 'center', color: 'var(--danger)', fontWeight: 600 }}>{usersError}</div>
                        ) : (
                            <div style={{ overflowX: 'auto', background: '#f1f5f9', borderRadius: 12, padding: 16 }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
                                    <thead>
                                        <tr style={{ background: '#e0e7ef' }}>
                                            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700 }}>Email</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700 }}>Phone</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700 }}>Created</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700 }}>Admin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '8px 12px' }}>{u.email}</td>
                                                <td style={{ padding: '8px 12px' }}>{u.phone}</td>
                                                <td style={{ padding: '8px 12px' }}>{u.createdAt ? new Date(u.createdAt).toLocaleString() : ''}</td>
                                                <td style={{ padding: '8px 12px' }}>{u.isAdmin ? <span style={{ color: '#2563eb', fontWeight: 700 }}>Yes</span> : 'No'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {users.length === 0 && <div style={{ textAlign: 'center', color: '#888', padding: 16 }}>No users found.</div>}
                            </div>
                        )}
                    </div>
                )}
                {tab === 'rooms' && (
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Rooms Management</h2>
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', background: '#f1f5f9', borderRadius: 12 }}>
                            <em>Rooms management coming soon...</em>
                        </div>
                    </div>
                )}
                {tab === 'analytics' && (
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Analytics</h2>
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', background: '#f1f5f9', borderRadius: 12 }}>
                            <em>Analytics coming soon...</em>
                        </div>
                    </div>
                )}
                {tab === 'settings' && (
                    <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Admin Settings</h2>
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)', background: '#f1f5f9', borderRadius: 12 }}>
                            <em>Settings coming soon...</em>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard; 