import React, { useEffect, useState } from 'react';
import { FaBan, FaTrash, FaSearch, FaUserShield, FaUser, FaUndo } from 'react-icons/fa';
import './UserManagement.css';
import './AdminCommon.css';
import { fetchAllUsersAdmin, banUserAdmin, deleteUserAdmin } from '../api';
import { useAdminAuth } from './AdminAuthContext';

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
        <div className="user-mgmt-root">
            <div className="user-mgmt-header">
                <h2>User Management</h2>
            </div>
            <div className="user-mgmt-controls">
                <input className="user-mgmt-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." />
            </div>
            {loading ? (
                <div className="user-mgmt-loading">
                    <div>Loading users...</div>
                    <div className="spinner"></div>
                </div>
            ) : error ? (
                <div className="user-mgmt-error">
                    <div className="error-message">Error: {error}</div>
                    <button className="retry-button" onClick={handleRetry}>
                        Retry
                    </button>
                </div>
            ) : (
                <div className="user-mgmt-table-wrap">
                    <table className="user-mgmt-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Registered</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(user => (
                                <tr key={user._id}>
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin ? <><FaUserShield color="#2563eb" /> Admin</> : <><FaUser color="#64748b" /> User</>}</td>
                                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</td>
                                    <td>{user.banned ? <span className="user-mgmt-banned">Banned</span> : <span className="user-mgmt-active">Active</span>}</td>
                                    <td>
                                        <button className="user-mgmt-ban" onClick={() => handleBanToggle(user)}>
                                            {user.banned ? <><FaUndo /> Unban</> : <><FaBan /> Ban</>}
                                        </button>
                                        <button className="user-mgmt-delete" onClick={() => handleDelete(user._id)}><FaTrash /> Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {error && <div className="user-mgmt-error">{error}</div>}
        </div>
    );
}

export default UserManagement; 