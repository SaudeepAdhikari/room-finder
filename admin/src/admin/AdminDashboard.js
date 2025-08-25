import React, { useState, useEffect, useRef } from 'react';
import { useAdminUser } from './AdminUserContext.js';
import { useAdminAuth } from './AdminAuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { fetchAllUsersAdmin, fetchAllRoomsAdminEnhanced, approveRoomAdmin, rejectRoomAdmin, deleteRoomAdmin, updateRoomAdmin, getUserCountAdmin, getRoomCountAdmin, getRecentUsersAdmin, getRecentRoomsAdmin } from '../api.js';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import AdminHeader from './AdminHeader.js';
import AdminSettingsPanel from './AdminSettingsPanel.js';
import DashboardOverview from './AdminDashboardOverview.js';
import RoomManagement from './RoomManagement.js';
import UserManagement from './UserManagement.js';
import BookingHistory from './BookingHistory.js';
import ReviewModeration from './ReviewModeration.js';
import AdminProfile from './AdminProfile.js';
import AnalyticsDashboard from './AnalyticsDashboard.js';

const SIDEBAR_TABS = [
    { key: 'users', label: 'Users', icon: '👤' },
    { key: 'rooms', label: 'Rooms', icon: '🏠' },
    { key: 'bookings', label: 'Bookings', icon: '📖' },
    { key: 'reviews', label: 'Reviews', icon: '⭐' },
    { key: 'profile', label: 'Profile', icon: '🧑‍💼' },
    { key: 'analytics', label: 'Analytics', icon: '📊' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
];

function AdminDashboard() {
    const { admin, loading: oldLoading, logout: oldLogout } = useAdminUser();
    const { adminUser, loading, logout, isAuthenticated } = useAdminAuth();
    const { showToast } = useToast();
    const [tab, setTab] = useState('users');
    const navigate = useNavigate();

    // Users state
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState('');

    // Rooms state
    const [rooms, setRooms] = useState([]);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [roomsError, setRoomsError] = useState('');

    // Bookings state
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingsError, setBookingsError] = useState('');

    // Room editing state
    const [editingRoom, setEditingRoom] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    // Analytics state
    const [analytics, setAnalytics] = useState({ users: null, rooms: null, pending: null });
    
    // Search result navigation handler
    const [searchFilter, setSearchFilter] = useState(null);
    
    useEffect(() => {
        const handleSearchNavigation = (event) => {
            const { tab: newTab, filter } = event.detail;
            setTab(newTab);
            setSearchFilter(filter);
        };
        
        window.addEventListener('adminNavigate', handleSearchNavigation);
        
        return () => {
            window.removeEventListener('adminNavigate', handleSearchNavigation);
        };
    }, []);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [analyticsError, setAnalyticsError] = useState('');

    // Recent users/rooms state
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentRooms, setRecentRooms] = useState([]);
    const [recentLoading, setRecentLoading] = useState(false);
    const [recentError, setRecentError] = useState('');

    useEffect(() => {
        if (tab === 'users') {
            setUsersLoading(true);
            setUsersError('');
            fetchAllUsersAdmin()
                .then(setUsers)
                .catch(err => setUsersError(err.message || 'Failed to fetch users'))
                .finally(() => setUsersLoading(false));
        } else if (tab === 'rooms') {
            setRoomsLoading(true);
            setRoomsError('');
            fetchAllRoomsAdminEnhanced()
                .then(setRooms)
                .catch(err => setRoomsError(err.message || 'Failed to fetch rooms'))
                .finally(() => setRoomsLoading(false));
        } else if (tab === 'bookings') {
            setBookingsLoading(true);
            setBookingsError('');
            // The BookingHistory component loads its own data
            // We just need to set loading to false after a short delay
            setTimeout(() => {
                setBookingsLoading(false);
            }, 100);
        } else if (tab === 'analytics') {
            setAnalyticsLoading(true);
            setAnalyticsError('');
            setRecentLoading(true);
            setRecentError('');
            Promise.all([
                getUserCountAdmin(),
                getRoomCountAdmin(),
                getRecentUsersAdmin(),
                getRecentRoomsAdmin()
            ]).then(([userRes, roomRes, users, rooms]) => {
                setAnalytics({ users: userRes, rooms: roomRes });
                setRecentUsers(users);
                setRecentRooms(rooms);
            }).catch(err => {
                setAnalyticsError(err.message || 'Failed to fetch analytics');
                setRecentError(err.message || 'Failed to fetch recent data');
            }).finally(() => {
                setAnalyticsLoading(false);
                setRecentLoading(false);
            });
        }
    }, [tab]);

    const handleApproveRoom = async (id) => {
        try {
            await approveRoomAdmin(id);
            setRooms(rooms => rooms.map(r => r._id === id ? { ...r, status: 'approved' } : r));
            showToast('Room approved.', 'success');
        } catch (err) {
            showToast(err.message || 'Failed to approve room', 'error');
        }
    };

    const handleRejectRoom = async (id) => {
        try {
            await rejectRoomAdmin(id);
            setRooms(rooms => rooms.map(r => r._id === id ? { ...r, status: 'rejected' } : r));
            showToast('Room rejected.', 'success');
        } catch (err) {
            showToast(err.message || 'Failed to reject room', 'error');
        }
    };

    const handleDeleteRoom = async (id) => {
        if (!window.confirm('Are you sure you want to delete this room?')) return;
        try {
            await deleteRoomAdmin(id);
            setRooms(rooms => rooms.filter(r => r._id !== id));
            showToast('Room deleted.', 'success');
        } catch (err) {
            showToast(err.message || 'Failed to delete room', 'error');
        }
    };

    const handleEditRoom = (room) => {
        setEditingRoom(room);
        setEditModalOpen(true);
    };

    const handleSaveEditRoom = async (updated) => {
        setEditLoading(true);
        try {
            const updatedRoom = await updateRoomAdmin(editingRoom._id, updated);
            setRooms(rooms => rooms.map(r => r._id === editingRoom._id ? updatedRoom : r));
            setEditModalOpen(false);
            showToast('Room updated.', 'success');
        } catch (err) {
            showToast(err.message || 'Failed to update room', 'error');
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
    if (!admin) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--danger)', fontWeight: 600 }}>Access denied. Admins only.</div>;
    }

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            showToast('Logged out successfully.', 'success');
        } catch (error) {
            console.error('Logout error:', error);
            showToast('Logout failed.', 'error');
        }
    };

    return (
        <div>
            <AdminHeader />
            <div style={{
                minHeight: '80vh',
                display: 'flex',
                background: 'linear-gradient(90deg, #1e293b 0%, #2563eb 100%)',
                borderRadius: 22,
                boxShadow: '0 8px 32px 0 rgba(37,99,235,0.13)',
                margin: '40px auto',
                maxWidth: 1300,
                overflow: 'hidden',
            }}>
                {/* Sidebar */}
                <aside style={{
                    width: 260,
                    background: 'rgba(30,41,59,0.72)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderRadius: '22px 0 0 22px',
                    padding: '36px 0 28px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '2px 0 24px 0 rgba(30,41,59,0.10)',
                    position: 'relative',
                    overflow: 'visible',
                }}>
                    {/* Vertical gradient accent bar */}
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 24,
                        bottom: 24,
                        width: 7,
                        borderRadius: '8px',
                        background: 'linear-gradient(180deg, #2563eb 0%, #38bdf8 100%)',
                        opacity: 0.85,
                        zIndex: 1,
                    }} />
                    {/* Admin Avatar and Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36, zIndex: 2 }}>
                        <img
                            src={admin.avatar || 'https://ui-avatars.com/api/?name=Admin'}
                            alt="Admin Avatar"
                            style={{ width: 74, height: 74, borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563eb', marginBottom: 14, boxShadow: '0 2px 12px rgba(37,99,235,0.10)' }}
                        />
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 20, marginBottom: 2, textShadow: '0 1px 4px rgba(30,41,59,0.10)' }}>{admin.email}</div>
                        <span style={{ background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)', color: '#fff', fontWeight: 600, fontSize: 13, borderRadius: 8, padding: '2px 12px', letterSpacing: 1, boxShadow: '0 1px 4px rgba(37,99,235,0.10)' }}>ADMIN</span>
                    </div>
                    {/* Sidebar Navigation */}
                    <nav style={{ width: '100%', zIndex: 2 }}>
                        {SIDEBAR_TABS.map(({ key, label, icon }) => (
                            <button
                                key={key}
                                onClick={() => setTab(key)}
                                style={{
                                    width: '100%',
                                    background: tab === key ? 'rgba(37,99,235,0.22)' : 'none',
                                    color: tab === key ? '#38bdf8' : '#fff',
                                    border: 'none',
                                    outline: 'none',
                                    fontWeight: tab === key ? 800 : 500,
                                    fontSize: 18,
                                    padding: '16px 0 16px 38px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    borderLeft: tab === key ? '6px solid #38bdf8' : '6px solid transparent',
                                    transition: 'all 0.22s cubic-bezier(.4,1.3,.6,1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    letterSpacing: 0.5,
                                    position: 'relative',
                                    boxShadow: tab === key ? '0 2px 12px rgba(56,189,248,0.10)' : 'none',
                                }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(37,99,235,0.13)'}
                                onMouseOut={e => e.currentTarget.style.background = tab === key ? 'rgba(37,99,235,0.22)' : 'none'}
                            >
                                <span style={{ fontSize: 22, transition: 'transform 0.18s', transform: tab === key ? 'scale(1.18)' : 'scale(1)' }}>{icon}</span> {label}
                            </button>
                        ))}
                    </nav>
                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '82%',
                            background: 'linear-gradient(90deg, #ef4444 0%, #f59e42 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 10,
                            padding: '13px 0',
                            fontWeight: 800,
                            fontSize: 17,
                            cursor: 'pointer',
                            boxShadow: '0 2px 12px rgba(239,68,68,0.10)',
                            letterSpacing: 1,
                            marginBottom: 14,
                            marginTop: 32,
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
                    borderRadius: '0 22px 22px 0',
                    padding: '40px 48px',
                    minHeight: 600,
                    boxShadow: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24, color: '#2563eb', letterSpacing: -1 }}>Admin Dashboard</h1>
                                        {tab === 'users' && (
                        <div>
                            <UserManagement searchFilter={tab === 'users' ? searchFilter : null} />
                        </div>
                    )}
                    {tab === 'rooms' && (
                        <div>
                            <RoomManagement searchFilter={tab === 'rooms' ? searchFilter : null} />
                        </div>
                    )}
                    {tab === 'bookings' &&
                        (bookingsLoading ? (
                            <div className="admin-loading">Loading bookings...</div>
                        ) : (
                            <BookingHistory searchFilter={tab === 'bookings' ? searchFilter : null} />
                        )
                        )}
                    {tab === 'reviews' && (
                        <div>
                            <ReviewModeration />
                                </div>
                            )}
                    {tab === 'profile' && (
                        <div>
                            <AdminProfile />
                        </div>
                    )}
                    {tab === 'analytics' && (
                        <div>
                            <AnalyticsDashboard />
                        </div>
                    )}
                    {tab === 'settings' && <AdminSettingsPanel />}
                    {/* At the end of main content, render the edit modal */}
                    <EditRoomModal
                        room={editingRoom}
                        open={editModalOpen}
                        onClose={() => setEditModalOpen(false)}
                        onSave={handleSaveEditRoom}
                        loading={editLoading}
                    />
                </main>
            </div>
        </div>
    );
}

// Modal component for editing room
function EditRoomModal({ room, open, onClose, onSave, loading }) {
    const [form, setForm] = useState({ ...room });
    const [error, setError] = useState(null);

    useEffect(() => {
        setForm({ ...room });
        setError(null);
    }, [room, open]);

    if (!open) return null;

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        if (!form.title || !form.location || !form.price) {
            setError('Title, location, and price are required.');
            return;
        }
        try {
            await onSave({
                ...form,
                price: Number(form.price),
                amenities: typeof form.amenities === 'string' ? form.amenities.split(',').map(a => a.trim()).filter(Boolean) : form.amenities
            });
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 350, maxWidth: 420, boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}>
                <h2 style={{ marginBottom: 18 }}>Edit Room</h2>
                <input name="title" value={form.title || ''} onChange={handleChange} placeholder="Title" required style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }} />
                <textarea name="description" value={form.description || ''} onChange={handleChange} placeholder="Description" style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }} />
                <input name="location" value={form.location || ''} onChange={handleChange} placeholder="Location" required style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }} />
                <input name="price" value={form.price || ''} onChange={handleChange} placeholder="Price" type="number" required style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }} />
                <input name="amenities" value={Array.isArray(form.amenities) ? form.amenities.join(', ') : (form.amenities || '')} onChange={handleChange} placeholder="Amenities (comma separated)" style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }} />
                <input name="imageUrl" value={form.imageUrl || ''} onChange={handleChange} placeholder="Image URL" style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }} />
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <button type="submit" disabled={loading} style={{ padding: 10, fontSize: 16, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>Save</button>
                    <button type="button" onClick={onClose} style={{ padding: 10, fontSize: 16, background: '#eee', color: '#333', border: 'none', borderRadius: 6, fontWeight: 600 }}>Cancel</button>
                </div>
                {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
            </form>
        </div>
    );
}

// Pie chart component for room status
function RoomStatusPieChart({ pending = 0, approved = 0, rejected = 0 }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        const chart = new Chart(canvasRef.current, {
            type: 'pie',
            data: {
                labels: ['Pending', 'Approved', 'Rejected'],
                datasets: [{
                    data: [pending, approved, rejected],
                    backgroundColor: ['#f59e42', '#3b82f6', '#ef4444'],
                }],
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: { font: { size: 16 } }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: ${value}`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
        return () => chart.destroy();
    }, [pending, approved, rejected]);
    return <canvas ref={canvasRef} width={340} height={220} />;
}

export default AdminDashboard; 