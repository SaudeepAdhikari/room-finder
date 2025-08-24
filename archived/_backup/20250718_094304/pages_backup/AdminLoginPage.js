import React, { useState } from 'react';
import { useAdminUser } from './admin/AdminUserContext';
import { useToast } from './context/ToastContext';
import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
    const { login } = useAdminUser();
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }
            login(data);
            showToast('Admin login successful!', 'success');
            navigate('/admindashboard');
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '60px auto', padding: 32, background: 'var(--surface)', borderRadius: 12, boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    />
                </div>
                {error && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</div>}
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: 12, borderRadius: 6, background: 'var(--primary-gradient)', color: 'var(--text-inverse)', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                >
                    {loading ? 'Logging in...' : 'Login as Admin'}
                </button>
            </form>
        </div>
    );
}

export default AdminLoginPage; 