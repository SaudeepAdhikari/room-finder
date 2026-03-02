import React, { useEffect, useState } from 'react';
import { FaBan, FaTrash, FaSearch, FaUserShield, FaUser, FaUndo, FaSync, FaExclamationCircle } from 'react-icons/fa/index.esm.js';
import './UserManagement.css';
import './AdminCommon.css';
import { fetchAllUsersAdmin, banUserAdmin, deleteUserAdmin } from '../api.js';
import { useAdminAuth } from './AdminAuthContext.js';

function UserManagement({ searchFilter }) {
    const { isAuthenticated, adminUser } = useAdminAuth();
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            loadUsers();
        } else {
            setError('You must be logged in as an admin to view users');
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        let data = [...users];

        // Apply text search filter
        if (search) {
            data = data.filter(u =>
                (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
                (u.firstName && u.firstName.toLowerCase().includes(search.toLowerCase())) ||
                (u.lastName && u.lastName.toLowerCase().includes(search.toLowerCase()))
            );
        }

        // Apply search filter from universal search if present
        if (searchFilter) {
            data = data.filter(u => u._id === searchFilter);
        }

        setFiltered(data);
    }, [users, search, searchFilter]);

    const loadUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchAllUsersAdmin();
            setUsers(data);
        } catch (e) {
            console.error('Error loading users:', e);
            setError(e.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        loadUsers();
    };

    const handleBanToggle = async user => {
        await banUserAdmin(user._id, !user.banned);
        setUsers(users => users.map(u => u._id === user._id ? { ...u, banned: !u.banned } : u));
    };

    const handleDelete = async id => {
        if (!window.confirm('Delete this user?')) return;
        await deleteUserAdmin(id);
        setUsers(users => users.filter(u => u._id !== id));
    };

    return (
        <div className="user-mgmt-root animation-fade-in">
            <div className="page-header-actions">
                <div>
                    <h2 className="admin-page-title">User Management</h2>
                    <p className="admin-page-subtitle">Manage user accounts, roles, and access permissions.</p>
                </div>
            </div>

            <div className="premium-card user-mgmt-controls-card">
                <div className="user-mgmt-controls">
                    <div className="search-group">
                        <FaSearch className="search-icon" />
                        <input className="input-premium" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." />
                    </div>
                    <button className="btn-premium-outline" onClick={loadUsers} title="Refresh">
                        <FaSync />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="premium-card loading-state">
                    <div className="spinner"></div>
                    <p>Fetching user directory...</p>
                </div>
            ) : error ? (
                <div className="premium-card error-panel">
                    <FaExclamationCircle className="error-icon" />
                    <div>
                        <p>{error}</p>
                        <button className="btn-premium" style={{ marginTop: '12px' }} onClick={handleRetry}>Retry</button>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="premium-card no-data-state">
                    <FaUser className="empty-icon" />
                    <p>No users found matching your search.</p>
                </div>
            ) : (
                <div className="premium-card table-card">
                    <div className="table-responsive">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Registration Date</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar-small" style={{ background: user.isAdmin ? 'var(--primary)' : 'var(--text-dim)' }}>
                                                    {(user.firstName?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <div className="user-info">
                                                    <div className="user-name">{user.firstName} {user.lastName}</div>
                                                    <div className="user-email">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="role-cell">
                                                {user.isAdmin ? (
                                                    <span className="badge-role admin"><FaUserShield /> Admin</span>
                                                ) : (
                                                    <span className="badge-role user"><FaUser /> User</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-cell">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge-status ${user.banned ? 'danger' : 'success'}`}>
                                                {user.banned ? 'Banned' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="action-btns">
                                                <button className={`btn-icon-premium ${user.banned ? 'unban' : 'ban'}`} onClick={() => handleBanToggle(user)} title={user.banned ? 'Unban' : 'Ban'}>
                                                    {user.banned ? <FaUndo /> : <FaBan />}
                                                </button>
                                                <button className="btn-icon-premium delete" onClick={() => handleDelete(user._id)} title="Delete"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement; 